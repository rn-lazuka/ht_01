import {body} from 'express-validator';
import {blogRepository} from '../repositories/blogRepository';
import {userRepository} from '../repositories/userRepository';

export const authValidations = [
    body('loginOrEmail').isString().trim().notEmpty(),
    body('password').isString().trim().notEmpty(),
];

export const registrationValidations = [
    body('login').isString().trim().notEmpty().isLength({min: 3, max:10}).matches(/^[a-zA-Z0-9_-]*$/).custom(async (value) => {
        const login = await userRepository.findUserByLoginOrEmail(value);
        if (login) {
            throw new Error('Login already exist');
        }
        return true;
    }),
    body('password').isString().trim().notEmpty().isLength({min: 3, max:20}),
    body('email').isString().trim().notEmpty().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).custom(async (value) => {
        const email = await userRepository.findUserByLoginOrEmail(value);
        if (email) {
            throw new Error('Email already exist');
        }
        return true;
    }),
];

export const registrationConfirmationValidations = [
    body('code').isString().trim().notEmpty(),
];

export const resendingEmailValidations = [
    body('email').isString().trim().notEmpty().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
];
