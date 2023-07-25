import {body} from 'express-validator';
import {LikeStatus} from '../enums/Likes';

export const commentsValidations = [
    body('content').isString().withMessage('Name must be a string').trim().notEmpty().isLength({max: 300, min: 20}).withMessage('Min 20 max 300 characters'),
];

export const commentLikeInfoValidations = [
    body('likeStatus')
        .isString().withMessage('Name must be a string')
        .trim()
        .notEmpty().withMessage('likeStatus cannot be empty')
        .custom(value => Object.values(LikeStatus).includes(value))
        .withMessage(`likeStatus must be one of: ${Object.values(LikeStatus).join(', ')}`),
];
