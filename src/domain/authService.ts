import {userRepository} from '../repositories/userRepository';
import {userService} from './userService';

export const authService = {
    async confirmEmail(code: string) {
        const user = await userService.findUserByConfirmationCode(code);
        if (!user) return false;
        if (user.emailConfirmation?.expirationDate! < new Date()) return false;
        return userRepository.updateUserConfirmStatus(user._id);
    },
    async resendEmailConfirmation(email: string) {
        const user = await userRepository.findUserByLoginOrEmail(email);
        if (!user) return false;
        return await userService.resendEmailConfirmation(user);
    }
};
