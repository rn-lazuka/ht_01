import {UserEntity} from '../types';
import {emailAdapter} from '../adapters/emailAdapter';

export const mailService = {
    async sendEmailConfirmationCode(user: UserEntity) {
        const mail = `<div><h1>Thank for your registration</h1><p>To finish registration please follow the link below:
        <a href=\`https://somesite.com/confirm-email?code=${user.emailConfirmation?.confirmationCode}\`>complete registration</a></p></div>`;
        const info = await emailAdapter.sendMail(user.email, 'Confirmation code', mail);
        return info ? info : null;
    }
};
