import {Router} from 'express';
import {checkAuth, inputValidationMiddleware} from '../utils';
import {blogPostValidations, blogValidations, updateBlogsValidations} from '../validators/blogs';
import {container} from '../compositionRoot';
import {BlogController} from '../controllers/blogController';
import {validateAccessTokenGetRequests} from '../middlewares/authMiddleware';

export const blogRouter = Router();
const blogController = container.resolve(BlogController);

blogRouter.get('/', blogController.getBlogs.bind(blogController));
blogRouter.get('/:id/posts',validateAccessTokenGetRequests, blogController.getAllPostsForBlog.bind(blogController));
blogRouter.get('/:id',validateAccessTokenGetRequests, blogController.getBlogById.bind(blogController));
blogRouter.post('/:id/posts', checkAuth, blogPostValidations, inputValidationMiddleware, blogController.createPost.bind(blogController));
blogRouter.post('/', checkAuth, blogValidations, inputValidationMiddleware, blogController.createBlog.bind(blogController));
blogRouter.put('/:id', checkAuth, updateBlogsValidations, inputValidationMiddleware, blogController.updateBlog.bind(blogController));
blogRouter.delete('/:id', checkAuth, inputValidationMiddleware, blogController.deleteBlog.bind(blogController));
