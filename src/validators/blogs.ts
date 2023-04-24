import {body, check, param} from 'express-validator';
import {blogRepository} from '../repositories/blogRepository';

export const blogValidations = [
    body('name').isString().withMessage('Name must be a string').trim().notEmpty().isLength({max: 15}).withMessage('Name must not exceed 15 characters'),
    body('description').isString().withMessage('Description must be a string').trim().notEmpty().isLength({max: 500}).withMessage('Description must not exceed 500 characters'),
    body('websiteUrl').isString().withMessage('Website URL must be a string').trim().notEmpty().isLength({max: 100}).withMessage('Description must not exceed 100 characters')
        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('Website URL must be a valid URL with https protocol'),
];

export const updateBlogsValidations = [...blogValidations, check('id').notEmpty().withMessage('ID parameter is required')]

export const blogPostValidations = [
    body('title').isString().withMessage('Name must be a string').trim().notEmpty().isLength({max: 30}).withMessage('Name must not exceed 30 characters'),
    body('shortDescription').isString().withMessage('Name must be a string').trim().notEmpty().isLength({max: 100}).withMessage('Name must not exceed 100 characters'),
    body('content').isString().withMessage('Description must be a string').trim().notEmpty().isLength({max: 1000}).withMessage('Description must not exceed 1000 characters'),
    param('id').custom(async (value) => {
        const blog = await blogRepository.getBlogById(value);
        if (!blog) {
            throw new Error('Invalid blog ID');
        }
        return true;
    }),
];
