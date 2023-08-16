import {BlogService} from '../domain/blogService';
import {Request, Response} from 'express';
import {PostService} from '../domain/postsService';
import {inject, injectable} from 'inversify';

@injectable()
export class BlogController {
    constructor(
        @inject(BlogService) protected blogService: BlogService,
        @inject(PostService) protected postService: PostService
    ) {
    }

    async getBlogs(req: Request, res: Response) {
        const page = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
        const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
        const searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : null;
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt';
        const sortDirection = req.query.sortDirection === 'asc' ? 'asc' : 'desc';
        const blogs = await this.blogService.getBlogs(page, pageSize, searchNameTerm, sortBy, sortDirection);

        res.json(blogs);
    }

    async getAllPostsForBlog(req: Request, res: Response) {
        const blog = await this.blogService.getBlogById(req.params.id);
        if (!blog) {
            return res.sendStatus(404);
        }
        const page = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
        const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt';
        const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() as 'asc' | 'desc' : 'desc';
        const posts = await this.blogService.getAllPostsForBlog(req.params.id, page, pageSize, sortBy, sortDirection, req.user?.id);
        return res.json(posts);
    }

    async getBlogById(req: Request, res: Response) {
        const blog = await this.blogService.getBlogById(req.params.id);
        if (blog) {
            res.json(blog);
        } else {
            res.sendStatus(404);
        }
    }

    async createPost(req: Request, res: Response) {
        const blog = await this.blogService.getBlogById(req.params.id);
        if (!blog) {
            return res.sendStatus(404);
        }
        const post = await this.postService.createPost({blogId: req.params.id, ...req.body});
        return res.status(201).json(post);
    }

    async createBlog(req: Request, res: Response) {
        const blog = await this.blogService.createBlog(req.body);
        return res.status(201).json(blog);
    }

    async updateBlog(req: Request, res: Response) {
        const isUpdatedBlog = await this.blogService.updateBlog(req.params.id, req.body);
        return isUpdatedBlog ? res.sendStatus(204) : res.sendStatus(404);
    }

    async deleteBlog(req: Request, res: Response) {
        const isBlogDeleted = await this.blogService.deleteBlog(req.params.id);
        isBlogDeleted ? res.sendStatus(204) : res.sendStatus(404);
    }
}
