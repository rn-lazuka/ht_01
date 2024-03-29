import {body, check} from 'express-validator';
import {container} from '../compositionRoot';
import {BlogService} from '../domain/blogService';

const blogService = container.resolve(BlogService);
export const postsValidations = [
    body('title').isString().withMessage('Name must be a string').trim().notEmpty().isLength({max: 30}).withMessage('Name must not exceed 30 characters'),
    body('shortDescription').isString().withMessage('Name must be a string').trim().notEmpty().isLength({max: 100}).withMessage('Name must not exceed 100 characters'),
    body('content').isString().withMessage('Description must be a string').trim().notEmpty().isLength({max: 1000}).withMessage('Description must not exceed 1000 characters'),
    body('blogId').custom(async (value) => {
        const blog = await blogService.getBlogById(value);
        if (!blog) {
            throw new Error('Invalid blog ID');
        }
    }),
];

export const updatePostsValidations = [...postsValidations, check('id').notEmpty().withMessage('ID parameter is required')];
