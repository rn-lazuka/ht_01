import {body} from 'express-validator';
import {userService} from '../domain/userService';

export const authValidations = [
    body('loginOrEmail').isString().trim().notEmpty(),
    body('password').isString().trim().notEmpty(),
];

