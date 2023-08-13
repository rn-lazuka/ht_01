import {Router} from 'express';
import {inputValidationMiddleware} from '../utils';
import {commentLikeInfoValidations, commentsValidations} from '../validators/comments';
import {authMiddleware, validateAccessTokenGetRequests} from '../middlewares/authMiddleware';
import {container} from '../compositionRoot';
import {CommentController} from '../controllers/commentController';

export const commentsRouter = Router();
const commentController = container.resolve(CommentController);

commentsRouter.get('/:id', validateAccessTokenGetRequests, commentController.getCommentById.bind(commentController));
commentsRouter.put('/:id', authMiddleware, commentsValidations, inputValidationMiddleware, commentController.updateComment.bind(commentController));
commentsRouter.put('/:commentId/like-status', authMiddleware, commentLikeInfoValidations, inputValidationMiddleware, commentController.updateCommentLikeInfo.bind(commentController));
commentsRouter.delete('/:id', authMiddleware, commentController.deleteComment.bind(commentController));
