import {Request, Response, Router} from 'express';
import {postsRepository} from '../repositories/postsRepository';
import {checkAuth} from '../utils';
import {inputValidationMiddleware} from '../utils/validateErrors';
import {postsValidations, updatePostsValidations} from '../validators/posts';

export const postsRouter = Router();

postsRouter.get('/', async (req, res) => {
    const posts = await postsRepository.getPosts();
    res.json(posts);
});

postsRouter.get('/:id', async (req, res) => {
    const post = await postsRepository.getPostById(req.params.id);
    if (post) {
        res.json(post);
    } else {
        res.sendStatus(404);
    }
});

postsRouter.post('/', checkAuth, postsValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const post =  await postsRepository.createPost(req.body);
    return res.status(201).json(post);
});
postsRouter.put('/:id', checkAuth, updatePostsValidations, inputValidationMiddleware,async (req: Request, res: Response) => {
    const isUpdatedPost = await postsRepository.updatePost(req.params.id, req.body);
    return isUpdatedPost ? res.sendStatus(204) : res.sendStatus(404);
});

postsRouter.delete('/:id', checkAuth, inputValidationMiddleware,async (req: Request, res: Response) => {
    const isPostDeleted = await postsRepository.deletePost(req.params.id);
    isPostDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
