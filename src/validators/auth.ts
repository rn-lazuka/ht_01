import {body} from 'express-validator';

export const authValidations = [
    body('loginOrEmail').isString().trim().notEmpty(),
    body('password').isString().trim().notEmpty(),
];

export const registrationValidations = [
    body('login').isString().trim().notEmpty().isLength({min: 3, max:10}).matches(/^[a-zA-Z0-9_-]*$/),
    body('password').isString().trim().notEmpty().isLength({min: 3, max:20}),
    body('email').isString().trim().notEmpty().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
];

export const registrationConfirmationValidations = [
    body('code').isString().trim().notEmpty(),
];

export const resendingEmailValidations = [
    body('email').isString().trim().notEmpty().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
];
