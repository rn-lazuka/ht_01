import {UserRepository} from '../repositories/userRepository';
import {UserService} from './userService';
import {JwtService} from './jwtService';
import {v4 as uuid} from 'uuid';

export class AuthService {
    constructor(protected userService: UserService, protected jwtService: JwtService, protected userRepository: UserRepository) {
    }
    async confirmEmail(code: string) {
        const user = await this.userService.findUserByConfirmationCode(code);
        if (!user) return false;
        if (user.emailConfirmation?.expirationDate! < new Date()) return false;
        return this.userRepository.updateUserConfirmStatus(user.id);
    }
    async resendEmailConfirmation(email: string) {
        const user = await this.userRepository.findUserByLoginOrEmail(email);
        if (!user) return false;
        return await this.userService.resendEmailConfirmation(user);
    }
    async passwordRecovery(email: string) {
        const user = await this.userRepository.findUserByLoginOrEmail(email);
        if (!user) return true;
        return await this.userService.passwordRecovery(user);
    }
    async loginUser(loginOrEmail: string, password: string) {
        const user = await this.userService.checkCredentials(loginOrEmail, password);
        if (user) {
            const accessToken = this.jwtService.createJWT(user.id!, '10s');
            const refreshToken = this.jwtService.createJWT(user.id!, '20s', uuid());
            return {accessToken, refreshToken, userId:user.id!};
        }
        return null;
    }
}
