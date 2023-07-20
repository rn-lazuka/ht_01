import nodemailer from 'nodemailer';

export class EmailAdapter {
    async sendMail(email: string, subject: string, message: string) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'arkdorf1@gmail.com',
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        const mailOptions = {
            from: 'Romych <arkdorf1@gmail.com>',
            to: email,
            subject: subject,
            html: message
        };

        return  await transporter.sendMail(mailOptions);
    }
}
