import {body, check} from 'express-validator';

export const commentsValidations = [
    body('content').isString().withMessage('Name must be a string').trim().notEmpty().isLength({max: 300, min: 20}).withMessage('Min 20 max 300 characters'),
];
