import {body} from 'express-validator';

export const blogValidations = [
    body('name').isString().withMessage('Name must be a string').trim().notEmpty().isLength({max: 15}).withMessage('Name must not exceed 15 characters'),
    body('description').isString().withMessage('Description must be a string').trim().notEmpty().isLength({max: 500}).withMessage('Description must not exceed 500 characters'),
    body('websiteUrl').isString().withMessage('Website URL must be a string').trim().notEmpty().isLength({max: 100}).withMessage('Description must not exceed 100 characters')
        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('Website URL must be a valid URL with https protocol'),
];
