import {NewUserData, Pagination, Sorting, UserEntity} from '../types';
import bcrypt from 'bcrypt';
import {userRepository, UserSearchTerm} from '../repositories/userRepository';
import {v4 as uuid} from 'uuid';
import {add} from 'date-fns';
import {mailService} from './mailService';

export const userService = {
    getUsers(pagination: Pagination, searchTerm: UserSearchTerm, sorting: Sorting) {
        return userRepository.getUsers(pagination, sorting, searchTerm);
    },
    async createUserByAdmin(user: NewUserData) {
        try {
            const passSalt = await bcrypt.genSalt(10);
            const passHash = await bcrypt.hash(user.password, passSalt);
            const newUser: UserEntity = {
                login: user.login,
                email: user.email,
                passwordHash: passHash,
                passwordSalt: passSalt,
                createdAt: new Date().toISOString(),
                emailConfirmation: {
                    isConfirmed: true,
                }
            };
            const createdUser = await userRepository.createUser(newUser);
            return userRepository._mapDbUserToOutputModel(createdUser);
        } catch (e) {
            return null;
        }
    },
    async resendEmailConfirmation(user: UserEntity) {
        const confirmationData = {
            confirmationCode: uuid(),
            isConfirmed: false,
            expirationDate: add(new Date(), {hours: 1, minutes: 3})
        };

        const updatedUser = await userRepository.updateUserConfirmationData(user.id!, confirmationData);
        if (!updatedUser) return false;
        try {
            const result = await mailService.sendEmailConfirmationCode(updatedUser);
            return result ? updatedUser : null;
        } catch (e) {
            return null;
        }
    },
    async passwordRecovery(user: UserEntity) {
        const recoveryData = {
            recoveryCode: uuid(),
            isValid: true,
            expirationDate: add(new Date(), {hours: 24})
        };
        const updatedUser = await userRepository.updateUserRecoveryData(user.id!, recoveryData);
        if (!updatedUser) return true;
        try {
            const result = await mailService.sendPasswordRecoveryCode(updatedUser);
            return result;
        } catch (e) {
            return true;
        }
    },
    async confirmNewPassword(recoveryCode: string, password: string) {
        const user = await userRepository.findUserByPasswordRecoveryCode(recoveryCode);
        if (user && user.recoveryData?.isValid) {
            const isExpired = user.recoveryData?.expirationDate! < new Date();
            const passHash = await bcrypt.hash(password, user.passwordSalt!);
            const newPassData = isExpired
                ? {recoveryData: {isValid: false}}
                : {
                    passwordHash: passHash,
                    recoveryData: {
                        recoveryCode: uuid(),
                        isValid: false,
                    }
                };
            const updateResult = await userRepository.updateUserPasswordData(user.id!, newPassData);
            return isExpired ? null : updateResult;
        }
        return null;
    },
    async createUser(user: NewUserData) {
        const passSalt = await bcrypt.genSalt(10);
        const passHash = await bcrypt.hash(user.password, passSalt);
        const newUser: UserEntity = {
            login: user.login,
            email: user.email,
            passwordHash: passHash,
            passwordSalt: passSalt,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: uuid(),
                isConfirmed: false,
                expirationDate: add(new Date(), {hours: 1, minutes: 3})
            }
        };
        const createResult = await userRepository.createUser(newUser);
        try {
            const result = await mailService.sendEmailConfirmationCode(createResult);
            return result ? createResult : null;
        } catch (e) {
            console.error(e);
            await userRepository.deleteUser(createResult._id.toString());
            return null;
        }
    },
    async findUserById(id: string) {
        return userRepository.findUserById(id);
    },
    async findUserByConfirmationCode(code: string) {
        return userRepository.findUserByConfirmationCode(code);
    },
    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await userRepository.findUserByLoginOrEmail(loginOrEmail);
        if (user && user?.passwordSalt) {
            const hash = await bcrypt.hash(password, user.passwordSalt);
            return hash === user?.passwordHash ? user : null;
        }
        return null;
    },
    deleteUser(id: string) {
        return userRepository.deleteUser(id);
    }
};
