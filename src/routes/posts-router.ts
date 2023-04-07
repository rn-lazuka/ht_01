import {Router, Request, Response} from 'express';
import {postsRepository} from '../repositories/postsRepository';
import {body, check, validationResult} from 'express-validator';
import {blogRepository} from '../repositories/blogRepository';
import {checkAuth} from '../utils';

export const postsRouter = Router();

const postsValidations = [
    body('title').isString().withMessage('Name must be a string').trim().notEmpty().isLength({max: 30}).withMessage('Name must not exceed 30 characters'),
    body('shortDescription').isString().withMessage('Name must be a string').trim().notEmpty().isLength({max: 100}).withMessage('Name must not exceed 100 characters'),
    body('content').isString().withMessage('Description must be a string').trim().notEmpty().isLength({max: 1000}).withMessage('Description must not exceed 1000 characters'),
    body('blogId').custom((value) => {
        const blog = blogRepository.getBlogById(value);
        if (!blog) {
            throw new Error('Invalid blog ID');
        }
        return true;
    }),
];
postsRouter.get('/', (req, res) => {
    const posts = postsRepository.getPosts();
    res.json(posts);
});

postsRouter.get('/:id', (req, res) => {
    const post = postsRepository.getPostById(req.params.id);
    if (post) {
        res.json(post);
    } else {
        res.sendStatus(404);
    }
});

postsRouter.post('/blogs',checkAuth, postsValidations, (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsMessages = errors.array().map(error => ({
            message: error.msg,
            field: error.param,
        }));
        return res.status(400).json({errorsMessages});
    }
    const post = postsRepository.createPost(req.body);
    return res.status(201).json(post);
});
postsRouter.put('/:id', checkAuth,[...postsValidations, check('id').notEmpty().withMessage('ID parameter is required'),], (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsMessages = errors.array().map(error => ({
            message: error.msg,
            field: error.param,
        }));
        return res.status(400).json({errorsMessages});
    }
    const isUpdatedPost = postsRepository.updatePost(req.params.id, req.body);
    return isUpdatedPost ? res.sendStatus(204) : res.sendStatus(404);
});

postsRouter.delete('/:id', checkAuth,[check('id').notEmpty().withMessage('ID parameter is required')], (req: Request, res: Response) => {
    const isPostDeleted = postsRepository.deletePost(req.params.id);
    isPostDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
