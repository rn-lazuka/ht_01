import {Request, Response, Router} from 'express';
import {inputValidationMiddleware} from '../utils/validateErrors';
import {commentsValidations} from '../validators/comments';
import {commentsService} from '../domain/commentsService';
import {authMiddleware} from '../middlewares/authMiddleware';

export const commentsRouter = Router();

commentsRouter.get('/:id', async (req, res) => {
    const comment = await commentsService.getCommentById(req.params.id);
    if (comment) {
        res.json(comment);
    } else {
        res.sendStatus(404);
    }
});

commentsRouter.put('/:id', authMiddleware, commentsValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const comment = await commentsService.getCommentById(req.params.id);
    if(!comment) return res.sendStatus(404)
    if(req.user?.id !== comment?.commentatorInfo.userId) {
        return res.sendStatus(403)
    }
    const isUpdatedComment = await commentsService.updateComment(req.params.id, req.body);
    return isUpdatedComment ? res.sendStatus(204) : res.sendStatus(404);
});

commentsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const comment = await commentsService.getCommentById(req.params.id);
    if(!comment) return res.sendStatus(404)
    if(req.user?.id !== comment?.commentatorInfo.userId) {
        return res.sendStatus(403)
    }
    const isCommentDeleted = await commentsService.deleteComment(req.params.id);
    return isCommentDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
