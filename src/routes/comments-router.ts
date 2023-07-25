import {Router} from 'express';
import {inputValidationMiddleware} from '../utils/validateErrors';
import {commentLikeInfoValidations, commentsValidations} from '../validators/comments';
import {authMiddleware} from '../middlewares/authMiddleware';
import {commentController} from '../compositionRoot';

export const commentsRouter = Router();

commentsRouter.get('/:id', commentController.getCommentById.bind(commentController));
commentsRouter.put('/:id', authMiddleware, commentsValidations, inputValidationMiddleware, commentController.updateComment.bind(commentController));
commentsRouter.put('/:commentId/like-status', authMiddleware,commentLikeInfoValidations,inputValidationMiddleware, commentController.updateCommentLikeInfo.bind(commentController));
commentsRouter.delete('/:id', authMiddleware, commentController.deleteComment.bind(commentController));
