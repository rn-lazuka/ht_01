import {Router, Request, Response} from 'express';
import {blogRepository} from '../repositories/blogRepository';
import {body, check, validationResult} from 'express-validator';
import {checkAuth} from '../utils';

export const blogRouter = Router();

const blogValidations = [
    body('name').isString().withMessage('Name must be a string').isLength({max: 15}).withMessage('Name must not exceed 15 characters'),
    body('description').isString().withMessage('Description must be a string').isLength({max: 500}).withMessage('Description must not exceed 500 characters'),
    body('websiteUrl').isString().withMessage('Website URL must be a string')
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

blogRouter.post('/', checkAuth, blogValidations, (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            message: error.msg,
            field: error.param,
        }));
        return res.status(400).json({errorMessages});
    }
    const blog = blogRepository.createBlog(req.body);
    return res.status(201).json(blog);
});
blogRouter.put('/:id', checkAuth,[...blogValidations, check('id').notEmpty().withMessage('ID parameter is required'),], (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            message: error.msg,
            field: error.param,
        }));
        return res.status(400).json({errorMessages});
    }
    const isUpdatedBlog = blogRepository.updateBlog(req.params.id, req.body);
    return isUpdatedBlog ? res.sendStatus(204) : res.sendStatus(404);
});

blogRouter.delete('/:id', checkAuth,[check('id').notEmpty().withMessage('ID parameter is required')], (req: Request, res: Response) => {
    const isBlogDeleted = blogRepository.deleteBlog(req.params.id);
    isBlogDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
