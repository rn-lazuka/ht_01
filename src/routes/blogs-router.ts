import {Router} from 'express';
import {checkAuth, inputValidationMiddleware} from '../utils';
import {blogPostValidations, blogValidations, updateBlogsValidations} from '../validators/blogs';
import {container} from '../compositionRoot';
import {BlogController} from '../controllers/blogController';

export const blogRouter = Router();
const blogController = container.resolve(BlogController);

blogRouter.get('/', blogController.getBlogs.bind(blogController));
blogRouter.get('/:id/posts', blogController.getAllPostsForBlog.bind(blogController));
blogRouter.get('/:id', blogController.getBlogById.bind(blogController));
blogRouter.post('/:id/posts', checkAuth, blogPostValidations, inputValidationMiddleware, blogController.createPost.bind(blogController));
blogRouter.post('/', checkAuth, blogValidations, inputValidationMiddleware, blogController.createBlog.bind(blogController));
blogRouter.put('/:id', checkAuth, updateBlogsValidations, inputValidationMiddleware, blogController.updateBlog.bind(blogController));
blogRouter.delete('/:id', checkAuth, inputValidationMiddleware, blogController.deleteBlog.bind(blogController));
