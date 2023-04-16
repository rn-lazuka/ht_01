import {Request, Response, Router} from 'express';
import {blogRepository} from '../repositories/blogRepository';
import {checkAuth} from '../utils';
import {inputValidationMiddleware} from '../utils/validateErrors';
import {blogValidations, updateBlogsValidations} from '../validators/blogs';

export const blogRouter = Router();

blogRouter.get('/', async (req, res) => {
    const blogs = await blogRepository.getBlogs();
    res.json(blogs);
});

blogRouter.get('/:id', async (req, res) => {
    const blog = await blogRepository.getBlogById(req.params.id);
    if (blog) {
        res.json(blog);
    } else {
        res.sendStatus(404);
    }
});

blogRouter.post('/', checkAuth, blogValidations,inputValidationMiddleware,async (req: Request, res: Response) => {
    const blog = await blogRepository.createBlog(req.body);
    return res.status(201).json(blog);
});
blogRouter.put('/:id', checkAuth, updateBlogsValidations,inputValidationMiddleware, async (req: Request, res: Response) => {
    const isUpdatedBlog =  await blogRepository.updateBlog(req.params.id, req.body);
    return isUpdatedBlog ? res.sendStatus(204) : res.sendStatus(404);
});

blogRouter.delete('/:id', checkAuth,inputValidationMiddleware, async (req: Request, res: Response) => {
    const isBlogDeleted = await blogRepository.deleteBlog(req.params.id);
    isBlogDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
