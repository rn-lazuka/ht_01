import {UserEntity} from '../types';
import {EmailAdapter} from '../adapters/emailAdapter';
import {inject, injectable} from 'inversify';

@injectable()
export class MailService {
    constructor( @inject(EmailAdapter) protected emailAdapter: EmailAdapter) {
    }

    async sendEmailConfirmationCode(user: UserEntity) {
        const mail = `<div><h1>Thank for your registration</h1><p>To finish registration please follow the link below:
        <a href="https://somesite.com/confirm-email?code=${user.emailConfirmation?.confirmationCode}">complete registration</a></p></div>`;
        const info = await this.emailAdapter.sendMail(user.email, 'Confirmation code', mail);
        return info ? info : null;
    }

    async sendPasswordRecoveryCode(user: UserEntity) {
        const mail = `<h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${user.recoveryData?.recoveryCode}'>recovery password</a>
        </p>`;
        const info = await this.emailAdapter.sendMail(user.email, 'Recovery code', mail);
        return info ? info : true;
    }
}
