import nodemailer from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport';

export const emailAdapter = {
    async sendMail(email: string, subject: string, message: string ) {
        const auth = {
            auth: {
                api_key: '252f47053cab649bfcff39148b8120fb-db4df449-ad512e63',
                domain: 'sandbox9b9d145fa7214d2ba3ff97eba4ff140c.mailgun.org'
            }
        }
        const transport = nodemailer.createTransport(mailgunTransport(auth));

        const mailOptions = {
            from: 'Romych <arkdorf1@gmail.com>',
            to: email,
            subject: subject,
            html: message
        };

        return await transport.sendMail(mailOptions)
    }
};
