import {Request, Response, Router} from 'express';
import {inputValidationMiddleware} from '../utils/validateErrors';
import {blogPostValidations, blogValidations, updateBlogsValidations} from '../validators/blogs';
import {blogService} from '../domain/blogService';
import {postsService} from '../domain/postsService';
import {blogRepository} from '../repositories/blogRepository';
import {checkAuth} from '../utils';

export const blogRouter = Router();

blogRouter.get('/', async (req, res) => {
    const page = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
    const searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : null;
    const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt';
    const sortDirection = req.query.sortDirection === 'asc' ? 'asc' : 'desc';
    const blogs = await blogService.getBlogs(page, pageSize, searchNameTerm, sortBy, sortDirection);
    res.json(blogs);
});

blogRouter.get('/:id/posts', async (req, res) => {
    const blog = await blogRepository.getBlogById(req.params.id);
    if (!blog) {
        return res.sendStatus(404)
    }
    const page = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
    const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt';
    const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() as 'asc' | 'desc' : 'desc';
    const posts = await blogService.getAllPostsForBlog(req.params.id, page, pageSize, sortBy, sortDirection);
    return res.json(posts);
});

blogRouter.get('/:id', async (req, res) => {
    const blog = await blogService.getBlogById(req.params.id);
    if (blog) {
        res.json(blog);
    } else {
        res.sendStatus(404);
    }
});

blogRouter.post('/:id/posts', checkAuth, blogPostValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const blog = await blogRepository.getBlogById(req.params.id);
    if (!blog) {
        return res.sendStatus(404)
    }
    const post = await postsService.createPost({blogId: req.params.id, ...req.body});
    return res.status(201).json(post);
});

blogRouter.post('/', checkAuth, blogValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const blog = await blogService.createBlog(req.body);
    return res.status(201).json(blog);
});
blogRouter.put('/:id', checkAuth, updateBlogsValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const isUpdatedBlog = await blogService.updateBlog(req.params.id, req.body);
    return isUpdatedBlog ? res.sendStatus(204) : res.sendStatus(404);
});

blogRouter.delete('/:id', checkAuth, inputValidationMiddleware, async (req: Request, res: Response) => {
    const isBlogDeleted = await blogService.deleteBlog(req.params.id);
    isBlogDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
