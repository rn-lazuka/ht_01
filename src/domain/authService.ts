import {userRepository} from '../repositories/userRepository';
import {userService} from './userService';
import {jwtService} from './jwtService';
import {v4 as uuid} from 'uuid';

export const authService = {
    async confirmEmail(code: string) {
        const user = await userService.findUserByConfirmationCode(code);
        if (!user) return false;
        if (user.emailConfirmation?.expirationDate! < new Date()) return false;
        return userRepository.updateUserConfirmStatus(user.id);
    },
    async resendEmailConfirmation(email: string) {
        const user = await userRepository.findUserByLoginOrEmail(email);
        if (!user) return false;
        return await userService.resendEmailConfirmation(user);
    },
    async passwordRecovery(email: string) {
        const user = await userRepository.findUserByLoginOrEmail(email);
        if (!user) return true;
        return await userService.passwordRecovery(user);
    },
    async loginUser(loginOrEmail: string, password: string) {
        const user = await userService.checkCredentials(loginOrEmail, password);
        if (user) {
            const accessToken = jwtService.createJWT(user.id!, '10s');
            const refreshToken = jwtService.createJWT(user.id!, '20s', uuid());
            return {accessToken, refreshToken, userId:user.id!};
        }
        return null;
    }
};
