import {PostService} from '../domain/postsService';
import {Request, Response} from 'express';
import {JwtService} from '../domain/jwtService';
import {CODE_RESPONSE} from '../enums';
import {inject, injectable} from 'inversify';

@injectable()
export class PostController {
    constructor(
        @inject(PostService) protected postService: PostService,
        @inject(JwtService) protected jwtService: JwtService
    ) {
    }

    async getPosts(req: Request, res: Response) {
        const page = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
        const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt';
        const sortDirection = req.query.sortDirection === 'asc' ? 'asc' : 'desc';
        const posts = await this.postService.getPosts(page, pageSize, sortBy, sortDirection);
        res.json(posts);
    }

    async getPostById(req: Request, res: Response) {
        const post = await this.postService.getPostById(req.params.id);
        if (post) {
            res.json(post);
        } else {
            res.sendStatus(404);
        }
    }

    async getCommentsByPostId(req: Request, res: Response) {
        const page = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
        const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt';
        const sortDirection = req.query.sortDirection === 'asc' ? 'asc' : 'desc';
        const comments = await this.postService.getCommentsByPostId(req.user?.id, req.params.id, page, pageSize, sortBy, sortDirection);
        return comments ? res.status(CODE_RESPONSE.OK_200).json(comments) : res.sendStatus(CODE_RESPONSE.NOT_FOUND_404);
    }

    async createComment(req: Request, res: Response) {
        const comment = await this.postService.createComment({
            postId: req.params.id,
            content: req.body.content,
            userId: req.user?.id!,
            userLogin: req.user!.login,
        });
        return comment ? res.status(201).json(comment) : res.sendStatus(404);
    }

    async createPost(req: Request, res: Response) {
        const post = await this.postService.createPost(req.body);
        return res.status(201).json(post);
    }

    async updatePost(req: Request, res: Response) {
        const isUpdatedPost = await this.postService.updatePost(req.params.id, req.body);
        return isUpdatedPost ? res.sendStatus(204) : res.sendStatus(404);
    }

    async deletePost(req: Request, res: Response) {
        const isPostDeleted = await this.postService.deletePost(req.params.id);
        isPostDeleted ? res.sendStatus(204) : res.sendStatus(404);
    }
}
