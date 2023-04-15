import {Request, Response, Router} from 'express';
import {blogRepository} from '../repositories/blogRepository';
import {check} from 'express-validator';
import {checkAuth} from '../utils';
import {inputValidationMiddleware} from '../utils/validateErrors';
import {blogValidations} from '../validators/blogs';

export const blogRouter = Router();

blogRouter.get('/', (req, res) => {
    const blogs = blogRepository.getBlogs();
    res.json(blogs);
});

blogRouter.get('/:id', (req, res) => {
    const blog = blogRepository.getBlogById(req.params.id);
    if (blog) {
        res.json(blog);
    } else {
        res.sendStatus(404);
    }
});

blogRouter.post('/', checkAuth, blogValidations,inputValidationMiddleware, (req: Request, res: Response) => {
    const blog = blogRepository.createBlog(req.body);
    return res.status(201).json(blog);
});
blogRouter.put('/:id', checkAuth, [...blogValidations, check('id').notEmpty().withMessage('ID parameter is required'),],inputValidationMiddleware, (req: Request, res: Response) => {
    const isUpdatedBlog = blogRepository.updateBlog(req.params.id, req.body);
    return isUpdatedBlog ? res.sendStatus(204) : res.sendStatus(404);
});

blogRouter.delete('/:id', checkAuth,inputValidationMiddleware, (req: Request, res: Response) => {
    const isBlogDeleted = blogRepository.deleteBlog(req.params.id);
    isBlogDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
