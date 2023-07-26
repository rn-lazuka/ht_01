import {Router} from 'express';
import {inputValidationMiddleware} from '../utils/validateErrors';
import {postsValidations, updatePostsValidations} from '../validators/posts';
import {commentsValidations} from '../validators/comments';
import {checkAuth} from '../utils';
import {authMiddleware, validateAccessTokenGetRequests} from '../middlewares/authMiddleware';
import {postController} from '../compositionRoot';

export const postsRouter = Router();

postsRouter.get('/', postController.getPosts.bind(postController));
postsRouter.get('/:id', postController.getPostById.bind(postController));
postsRouter.get('/:id/comments', validateAccessTokenGetRequests, postController.getCommentsByPostId.bind(postController));
postsRouter.post('/:id/comments', authMiddleware, commentsValidations, inputValidationMiddleware, postController.createComment.bind(postController));
postsRouter.post('/', checkAuth, postsValidations, inputValidationMiddleware, postController.createPost.bind(postController));
postsRouter.put('/:id', checkAuth, updatePostsValidations, inputValidationMiddleware, postController.updatePost.bind(postController));
postsRouter.delete('/:id', checkAuth, inputValidationMiddleware, postController.deletePost.bind(postController));
