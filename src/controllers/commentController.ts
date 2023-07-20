import {CommentService} from '../domain/commentsService';
import {Request, Response} from 'express';

export class CommentController {
    constructor(protected commentService: CommentService) {
    }

    async getCommentById(req: Request, res: Response) {
        const comment = await this.commentService.getCommentById(req.params.id);
        if (comment) {
            res.json(comment);
        } else {
            res.sendStatus(404);
        }
    }

    async updateComment(req: Request, res: Response) {
        const comment = await this.commentService.getCommentById(req.params.id);
        if (!comment) return res.sendStatus(404);
        if (req.user?.id !== comment?.commentatorInfo.userId) {
            return res.sendStatus(403);
        }
        const isUpdatedComment = await this.commentService.updateComment(req.params.id, req.body);
        return isUpdatedComment ? res.sendStatus(204) : res.sendStatus(404);
    }

    async deleteComment(req: Request, res: Response) {
        const comment = await this.commentService.getCommentById(req.params.id);
        if (!comment) return res.sendStatus(404);
        if (req.user?.id !== comment?.commentatorInfo.userId) {
            return res.sendStatus(403);
        }
        const isCommentDeleted = await this.commentService.deleteComment(req.params.id);
        return isCommentDeleted ? res.sendStatus(204) : res.sendStatus(404);
    }
}
