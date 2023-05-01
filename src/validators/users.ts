import {body} from 'express-validator';

export const userValidations = [
    body('login').isString().withMessage('Name must be a string').trim().notEmpty().isLength({max: 10, min: 3}).withMessage('Min 3, max 10 chars').matches(/^[a-zA-Z0-9_-]*$/),
    body('email').isString().withMessage('Name must be a string').trim().notEmpty().matches(/^[a-zA-Z0-9_-]*$/),
    body('password').isString().withMessage('Name must be a string').trim().notEmpty().isLength({max: 20, min: 6}).withMessage('Min 6, max 20 chars').matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
];
