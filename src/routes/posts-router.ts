import {Request, Response, Router} from 'express';
import {inputValidationMiddleware} from '../utils/validateErrors';
import {postsValidations, updatePostsValidations} from '../validators/posts';
import {postsService} from '../domain/postsService';
import {commentsValidations} from '../validators/comments';
import { checkAuth } from '../utils';
import {authMiddleware} from '../middlewares/authMiddleware';

export const postsRouter = Router();

postsRouter.get('/', async (req, res) => {
    const page = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
    const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt';
    const sortDirection = req.query.sortDirection === 'asc' ? 'asc' : 'desc';
    const posts = await postsService.getPosts(page, pageSize, sortBy, sortDirection);
    res.json(posts);
});

postsRouter.get('/:id', async (req, res) => {
    const post = await postsService.getPostById(req.params.id);
    if (post) {
        res.json(post);
    } else {
        res.sendStatus(404);
    }
});
postsRouter.get('/:id/comments', async (req, res) => {
    const page = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
    const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt';
    const sortDirection = req.query.sortDirection === 'asc' ? 'asc' : 'desc';
    const comments = await postsService.getCommentsByPostId(req.params.id, page, pageSize, sortBy, sortDirection);
    return comments ? res.status(200).json(comments) : res.sendStatus(404)
});

postsRouter.post('/:id/comments', authMiddleware, commentsValidations,inputValidationMiddleware, async (req: Request, res: Response) => {
    const comment = await postsService.createComment({
        postId: req.params.id,
        content: req.body.content,
        userId: req.user?.id!,
        userLogin: req.user!.login,
    });
    return comment ? res.status(201).json(comment) : res.sendStatus(404);
});

postsRouter.post('/', checkAuth, postsValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const post = await postsService.createPost(req.body);
    return res.status(201).json(post);
});
postsRouter.put('/:id', checkAuth, updatePostsValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const isUpdatedPost = await postsService.updatePost(req.params.id, req.body);
    return isUpdatedPost ? res.sendStatus(204) : res.sendStatus(404);
});

postsRouter.delete('/:id', checkAuth, inputValidationMiddleware, async (req: Request, res: Response) => {
    const isPostDeleted = await postsService.deletePost(req.params.id);
    isPostDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
