import {body} from 'express-validator';
import {userService} from '../domain/userService';

export const authValidations = [
    body('loginOrEmail').custom(async (value, {req}) => {
        const data = await userService.getUserByLogin(value);
        if (!data) {
            throw new Error('Invalid login or password');
        }
        req.user = data;
    }),
    body('password').custom(async (value, {req}) => {
        const data: { passwordHash: string, passwordSalt: string } = req.user;
        const result = await userService.checkUserPass({
            passwordSalt: data.passwordSalt,
            passwordHash: data.passwordHash,
            password: value
        });
        if (!result) {
            throw new Error('Invalid login or password');
        }
        return result
    }),
];

