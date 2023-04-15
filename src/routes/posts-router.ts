import {Request, Response, Router} from 'express';
import {postsRepository} from '../repositories/postsRepository';
import {check} from 'express-validator';
import {checkAuth} from '../utils';
import {inputValidationMiddleware} from '../utils/validateErrors';
import {postsValidations} from '../validators/posts';

export const postsRouter = Router();

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

postsRouter.post('/', checkAuth, postsValidations, inputValidationMiddleware, (req: Request, res: Response) => {
    const post = postsRepository.createPost(req.body);
    return res.status(201).json(post);
});
postsRouter.put('/:id', checkAuth, [...postsValidations, check('id').notEmpty().withMessage('ID parameter is required'),], inputValidationMiddleware, (req: Request, res: Response) => {
    const isUpdatedPost = postsRepository.updatePost(req.params.id, req.body);
    return isUpdatedPost ? res.sendStatus(204) : res.sendStatus(404);
});

postsRouter.delete('/:id', checkAuth, inputValidationMiddleware, (req: Request, res: Response) => {
    const isPostDeleted = postsRepository.deletePost(req.params.id);
    isPostDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
