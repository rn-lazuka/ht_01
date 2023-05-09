import {Request, Response, Router} from 'express';
import {inputValidationMiddleware} from '../utils/validateErrors';
import {commentsValidations} from '../validators/comments';
import {commentsService} from '../domain/commentsService';
import { checkAuth } from '../utils';

export const commentsRouter = Router();

commentsRouter.get('/:id', async (req, res) => {
    const blog = await commentsService.getCommentById(req.params.id);
    if (blog) {
        res.json(blog);
    } else {
        res.sendStatus(404);
    }
});

commentsRouter.put('/:id', checkAuth, commentsValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const comment = await commentsService.getCommentById(req.params.id);
    if(req.user?._id.toString() !== comment?.id) {
        return res.sendStatus(403)
    }
    const isUpdatedComment = await commentsService.updateComment(req.params.id, req.body);
    return isUpdatedComment ? res.sendStatus(204) : res.sendStatus(404);
});

commentsRouter.delete('/:id', checkAuth, async (req: Request, res: Response) => {
    const comment = await commentsService.getCommentById(req.params.id);
    if(req.user?._id.toString() !== comment?.id) {
        return res.sendStatus(403)
    }
    const isCommentDeleted = await commentsService.deleteComment(req.params.id);
    return isCommentDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
