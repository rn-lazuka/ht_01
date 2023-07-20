import {Router} from 'express';
import {inputValidationMiddleware} from '../utils/validateErrors';
import {blogPostValidations, blogValidations, updateBlogsValidations} from '../validators/blogs';
import {checkAuth} from '../utils';
import {blogController} from '../compositionRoot';

export const blogRouter = Router();

blogRouter.get('/', blogController.getBlogs.bind(blogController));
blogRouter.get('/:id/posts', blogController.getAllPostsForBlog.bind(blogController));
blogRouter.get('/:id', blogController.getBlogById.bind(blogController));
blogRouter.post('/:id/posts', checkAuth, blogPostValidations, inputValidationMiddleware, blogController.createPost.bind(blogController));
blogRouter.post('/', checkAuth, blogValidations, inputValidationMiddleware, blogController.createBlog.bind(blogController));
blogRouter.put('/:id', checkAuth, updateBlogsValidations, inputValidationMiddleware, blogController.updateBlog.bind(blogController));
blogRouter.delete('/:id', checkAuth, inputValidationMiddleware, blogController.deleteBlog.bind(blogController));
