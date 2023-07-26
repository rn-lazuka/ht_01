import {CommentService} from '../domain/commentsService';
import {Request, Response} from 'express';
import {LikeService} from '../domain/likeService';
import {LikeStatus} from '../enums/Likes';
import {CODE_RESPONSE} from '../enums';
import {JwtService} from '../domain/jwtService';
import {getUpdatedLikesCountForComment} from '../utils/getUpdatedLikesCountForComment';

export class CommentController {
    constructor(protected commentService: CommentService, protected likeService: LikeService, protected jwtService: JwtService,) {
    }

    async getCommentById(req: Request, res: Response) {
        const comment = await this.commentService.getCommentById(req.params.id, req.user?.id!);
        if (comment) {
            res.json(comment);
        } else {
            res.sendStatus(404);
        }
    }

    async updateComment(req: Request, res: Response) {
        const comment = await this.commentService.getCommentById(req.params.id, req.user?.id!);
        if (!comment) return res.sendStatus(404);
        if (req.user?.id !== comment?.commentatorInfo.userId) {
            return res.sendStatus(403);
        }
        const isUpdatedComment = await this.commentService.updateComment(req.params.id, req.body);
        return isUpdatedComment ? res.sendStatus(204) : res.sendStatus(404);
    }

    async updateCommentLikeInfo(req: Request, res: Response) {
        const userId = req.user?.id!;
        const comment = await this.commentService.getCommentById(req.params.commentId, userId);
        if (!comment) return res.sendStatus(CODE_RESPONSE.NOT_FOUND_404);
        const likeStatus = req.body.likeStatus;
        const commentLikeInfo = await this.likeService.getCommentLikeInfo(userId, comment.id);
        if (!commentLikeInfo) {
            await this.likeService.addCommentLikeInfo({userId, commentId: comment.id, likeStatus});
        }
        if (commentLikeInfo && commentLikeInfo.likeStatus !== likeStatus) {
            await this.likeService.updateCommentLikeInfo(userId, comment.id, likeStatus);
        }
        let likesInfo = getUpdatedLikesCountForComment({commentLikeInfo, likeStatus, comment});

        if (commentLikeInfo?.likeStatus !== likeStatus) {
            const isUpdatedComment = await this.commentService.updateCommentLikeInfo(req.params.commentId, likesInfo);
            return isUpdatedComment ? res.sendStatus(CODE_RESPONSE.NO_CONTENT_204) : res.sendStatus(CODE_RESPONSE.NOT_FOUND_404);
        }
        if (commentLikeInfo?.likeStatus === likeStatus) {
            return res.sendStatus(CODE_RESPONSE.NO_CONTENT_204);
        }
        return res.sendStatus(CODE_RESPONSE.INTERNAL_SERVER_ERROR_500);
    }

    async deleteComment(req: Request, res: Response) {
        const comment = await this.commentService.getCommentById(req.params.id, req.user?.id!);
        if (!comment) return res.sendStatus(404);
        if (req.user?.id !== comment?.commentatorInfo.userId) {
            return res.sendStatus(403);
        }
        const isCommentDeleted = await this.commentService.deleteComment(req.params.id);
        return isCommentDeleted ? res.sendStatus(204) : res.sendStatus(404);
    }
}
