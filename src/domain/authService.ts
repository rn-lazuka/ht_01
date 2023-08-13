import {UserRepository} from '../repositories/userRepository';
import {UserService} from './userService';
import {JwtService} from './jwtService';
import {v4 as uuid} from 'uuid';
import {inject, injectable} from 'inversify';

@injectable()
export class AuthService {
    constructor(
       @inject(UserService) protected userService: UserService,
       @inject(JwtService) protected jwtService: JwtService,
       @inject(UserRepository) protected userRepository: UserRepository
    ) {
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
            const accessToken = this.jwtService.createJWT(user.id!, '30m');
            const refreshToken = this.jwtService.createJWT(user.id!, '24h', uuid());
            return {accessToken, refreshToken, userId:user.id!};
        }
        return null;
    }
}
