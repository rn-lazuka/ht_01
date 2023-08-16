import {Router} from 'express';
import {checkAuth, inputValidationMiddleware} from '../utils';
import {postsValidations, updatePostsValidations} from '../validators/posts';
import {commentsValidations, likeInfoValidations} from '../validators/comments';
import {authMiddleware, validateAccessTokenGetRequests} from '../middlewares/authMiddleware';
import {container} from '../compositionRoot';
import {PostController} from '../controllers/postController';

export const postsRouter = Router();
const postController = container.resolve(PostController);


postsRouter.get('/',validateAccessTokenGetRequests, postController.getPosts.bind(postController));
postsRouter.get('/:id', validateAccessTokenGetRequests,postController.getPostById.bind(postController));
postsRouter.get('/:id/comments', validateAccessTokenGetRequests, postController.getCommentsByPostId.bind(postController));
postsRouter.post('/:id/comments', authMiddleware, commentsValidations, inputValidationMiddleware, postController.createComment.bind(postController));
postsRouter.post('/', checkAuth, postsValidations, inputValidationMiddleware, postController.createPost.bind(postController));
postsRouter.put('/:id', checkAuth, updatePostsValidations, inputValidationMiddleware, postController.updatePost.bind(postController));
postsRouter.put('/:id/like-status', authMiddleware, likeInfoValidations, inputValidationMiddleware, postController.updatePostLikeInfo.bind(postController));
postsRouter.delete('/:id', checkAuth, inputValidationMiddleware, postController.deletePost.bind(postController));
