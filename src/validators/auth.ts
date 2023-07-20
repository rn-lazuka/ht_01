import {body} from 'express-validator';
import {userService} from '../compositionRoot';

export const authValidations = [
    body('loginOrEmail').isString().trim().notEmpty(),
    body('password').isString().trim().notEmpty(),
];

export const registrationValidations = [
    body('login').isString().trim().notEmpty().isLength({
        min: 3,
        max: 10
    }).matches(/^[a-zA-Z0-9_-]*$/).custom(async (value) => {
        const login = await userService.findUserByLoginOrEmail(value);
        if (login) {
            throw new Error('Login already exist');
        }
        return true;
    }),
    body('password').isString().trim().notEmpty().isLength({min: 6, max: 20}),
    body('email').isString().trim().notEmpty().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).custom(async (value) => {
        const email = await userService.findUserByLoginOrEmail(value);
        if (email) {
            throw new Error('Email already exist');
        }
        return true;
    }),
];

export const registrationConfirmationValidations = [
    body('code').isString().trim().notEmpty().custom(async (value) => {
        const user = await userService.findUserByConfirmationCode(value);
        if (!user) {
            throw new Error('No such user');
        }
        if (user?.emailConfirmation?.isConfirmed) {
            throw new Error('User already confirmed');
        }
        return true;
    }),
];

export const resendingEmailValidations = [
    body('email').isString().trim().notEmpty().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).custom(async (value) => {
        const user = await userService.findUserByLoginOrEmail(value);
        if (!user) {
            throw new Error('No user with such email');
        }
        if (user?.emailConfirmation?.isConfirmed) {
            throw new Error('User already confirmed');
        }
        return true;
    }),
];

export const passwordRecoveryValidations = [
    body('email').isString().trim().notEmpty().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
];

export const newPasswordValidations = [
    body('newPassword').isString().trim().notEmpty().isLength({min: 6, max: 20}),
    body('recoveryCode').isString().trim().notEmpty().custom(async (value) => {
        const user = await userService.findUserByPasswordRecoveryCode(value);
        if (!user) {
            throw new Error('Code is not valid');
        }
        return true;
    }),
];
