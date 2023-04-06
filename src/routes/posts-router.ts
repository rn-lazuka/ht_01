import {Router, Request, Response} from 'express';
import {postsRepository} from '../repositories/postsRepository';
import {body, check, validationResult} from 'express-validator';
import {blogRepository} from '../repositories/blogRepository';

export const postsRouter = Router();

const postsValidations = [
    body('title').isString().withMessage('Name must be a string').trim().isLength({max: 30}).withMessage('Name must not exceed 30 characters'),
    body('shortDescription').isString().withMessage('Name must be a string').trim().isLength({max: 100}).withMessage('Name must not exceed 100 characters'),
    body('content').isString().withMessage('Description must be a string').trim().isLength({max: 1000}).withMessage('Description must not exceed 1000 characters'),
    body('blogId').custom((value) => {
        const blog = blogRepository.getBlogById(value);
        if (!blog) {
            throw new Error('Invalid blog ID');
        }
        return true;
    }),
];
postsRouter.get('/', (req, res) => {
    const blogs = postsRepository.getPosts();
    res.send(blogs);
});

postsRouter.get('/:id', (req, res) => {
    const blog = postsRepository.getPostById(req.params.id);
    if (blog) {
        res.send(blog);
    } else {
        res.sendStatus(404);
    }
});

postsRouter.post('/blogs', postsValidations, (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            message: error.msg,
            field: error.param,
        }));
        return res.status(400).json({errorMessages});
    }
    const blog = postsRepository.createPost(req.body);
    return res.status(201).json({blog});
});
postsRouter.put('/:id', [...postsValidations, check('id').notEmpty().withMessage('ID parameter is required'),], (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            message: error.msg,
            field: error.param,
        }));
        return res.status(400).json({errorMessages});
    }
    const isUpdatedBlog = postsRepository.updatePost(req.params.id, req.body);
    return isUpdatedBlog ? res.sendStatus(204) : res.sendStatus(404);
});

postsRouter.delete('/:id', [check('id').notEmpty().withMessage('ID parameter is required')], (req: Request, res: Response) => {
    const isBlogDeleted = postsRepository.deletePost(req.params.id);
    isBlogDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
