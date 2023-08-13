import {NewUserData, Pagination, Sorting, UserDBType, UserEntity} from '../types';
import bcrypt from 'bcrypt';
import {UserRepository, UserSearchTerm} from '../repositories/userRepository';
import {v4 as uuid} from 'uuid';
import {add} from 'date-fns';
import {MailService} from './mailService';
import {ObjectId} from 'mongodb';
import {inject, injectable} from 'inversify';

@injectable()
export class UserService {
    constructor(
        @inject(UserRepository) protected userRepository: UserRepository,
        @inject(MailService) protected mailService: MailService
    ) {
    }

    getUsers(pagination: Pagination, searchTerm: UserSearchTerm, sorting: Sorting) {
        return this.userRepository.getUsers(pagination, sorting, searchTerm);
    }

    async createUserByAdmin(user: NewUserData) {
        try {
            const passSalt = await bcrypt.genSalt(10);
            const passHash = await bcrypt.hash(user.password, passSalt);
            const newUser = new UserDBType(new ObjectId(),
                user.login,
                user.email,
                new Date().toISOString(),
                passHash,
                passSalt,
                {
                    isConfirmed: true,
                });
            const createdUser = await this.userRepository.createUser(newUser);
            return this.userRepository._mapDbUserToOutputModel(createdUser);
        } catch (e) {
            return null;
        }
    }

    async resendEmailConfirmation(user: UserEntity) {
        const confirmationData = {
            confirmationCode: uuid(),
            isConfirmed: false,
            expirationDate: add(new Date(), {hours: 1, minutes: 3})
        };

        const updatedUser = await this.userRepository.updateUserConfirmationData(user.id!, confirmationData);
        if (!updatedUser) return false;
        try {
            const result = await this.mailService.sendEmailConfirmationCode(updatedUser);
            return result ? updatedUser : null;
        } catch (e) {
            return null;
        }
    }

    async passwordRecovery(user: UserEntity) {
        const recoveryData = {
            recoveryCode: uuid(),
            isValid: true,
            expirationDate: add(new Date(), {hours: 24})
        };
        const updatedUser = await this.userRepository.updateUserRecoveryData(user.id!, recoveryData);
        if (!updatedUser) return true;
        try {
            const result = await this.mailService.sendPasswordRecoveryCode(updatedUser);
            return result;
        } catch (e) {
            return true;
        }
    }

    async confirmNewPassword(recoveryCode: string, newPassword: string) {
        const user = await this.userRepository.findUserByPasswordRecoveryCode(recoveryCode);
        if (user && user.recoveryData?.isValid) {
            const isExpired = user.recoveryData?.expirationDate! < new Date();
            const passHash = await bcrypt.hash(newPassword, user.passwordSalt!);
            const newPassData = isExpired
                ? {recoveryData: {isValid: false}}
                : {
                    passwordHash: passHash,
                    recoveryData: {
                        recoveryCode: uuid(),
                        isValid: false,
                    }
                };
            const updateResult = await this.userRepository.updateUserPasswordData(user.id!, newPassData);
            return isExpired ? null : updateResult;
        }
        return null;
    }

    async createUser(user: NewUserData) {
        const passSalt = await bcrypt.genSalt(10);
        const passHash = await bcrypt.hash(user.password, passSalt);
        const newUser = new UserDBType(new ObjectId, user.login,
            user.email,
            new Date().toISOString(),
            passHash,
            passSalt,
            {
                confirmationCode: uuid(),
                isConfirmed: false,
                expirationDate: add(new Date(), {hours: 1, minutes: 3})
            });
        const createResult = await this.userRepository.createUser(newUser);
        try {
            const result = await this.mailService.sendEmailConfirmationCode(createResult);
            return result ? createResult : null;
        } catch (e) {
            console.error(e);
            await this.userRepository.deleteUser(createResult._id.toString());
            return null;
        }
    }

    async findUserById(id: string) {
        return await this.userRepository.findUserById(id);
    }

    async findUserByConfirmationCode(code: string) {
        return await this.userRepository.findUserByConfirmationCode(code);
    }

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await this.userRepository.findUserByLoginOrEmail(loginOrEmail);
        if (user && user?.passwordSalt) {
            const hash = await bcrypt.hash(password, user.passwordSalt);
            return hash === user?.passwordHash ? user : null;
        }
        return null;
    }

    async findUserByLoginOrEmail(loginOrEmail: string) {
        return await this.userRepository.findUserByLoginOrEmail(loginOrEmail);
    }

    async findUserByPasswordRecoveryCode(code: string) {
        return await this.userRepository.findUserByPasswordRecoveryCode(code);
    }

    deleteUser(id: string) {
        return this.userRepository.deleteUser(id);
    }
}
