import {Request, Response, Router} from 'express';
import {blogRepository} from '../repositories/blogRepository';
import {body, check} from 'express-validator';
import {checkAuth} from '../utils';
import {inputValidationMiddleware} from '../utils/validateErrors';

export const blogRouter = Router();

const blogValidations = [
    body('name').isString().withMessage('Name must be a string').trim().notEmpty().isLength({max: 15}).withMessage('Name must not exceed 15 characters'),
    body('description').isString().withMessage('Description must be a string').trim().notEmpty().isLength({max: 500}).withMessage('Description must not exceed 500 characters'),
    body('websiteUrl').isString().withMessage('Website URL must be a string').trim().notEmpty().isLength({max: 100}).withMessage('Description must not exceed 100 characters')
        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('Website URL must be a valid URL with https protocol'),
];
blogRouter.get('/', (req, res) => {
    const blogs = blogRepository.getBlogs();
    res.json(blogs);
});

blogRouter.get('/:id', (req, res) => {
    const blog = blogRepository.getBlogById(req.params.id);
    if (blog) {
        res.json(blog);
    } else {
        res.sendStatus(404);
    }
});

blogRouter.post('/', checkAuth, blogValidations,inputValidationMiddleware, (req: Request, res: Response) => {
    const blog = blogRepository.createBlog(req.body);
    return res.status(201).json(blog);
});
blogRouter.put('/:id', checkAuth, [...blogValidations, check('id').notEmpty().withMessage('ID parameter is required'),],inputValidationMiddleware, (req: Request, res: Response) => {
    const isUpdatedBlog = blogRepository.updateBlog(req.params.id, req.body);
    return isUpdatedBlog ? res.sendStatus(204) : res.sendStatus(404);
});

blogRouter.delete('/:id', checkAuth, [check('id').notEmpty().withMessage('ID parameter is required')],inputValidationMiddleware, (req: Request, res: Response) => {
    const isBlogDeleted = blogRepository.deleteBlog(req.params.id);
    isBlogDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
