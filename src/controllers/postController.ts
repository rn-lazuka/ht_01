import {PostService} from '../domain/postsService';
import {Request, Response} from 'express';
import {JwtService} from '../domain/jwtService';
import {CODE_RESPONSE} from '../enums';
import {inject, injectable} from 'inversify';
import {getUpdatedLikesCountForComment} from '../utils';
import {LikeService} from '../domain/likeService';
import {getUpdatedLikesCountForPost} from '../utils/getUpdatedLikesCountForPost';

@injectable()
export class PostController {
    constructor(
        @inject(PostService) protected postService: PostService,
        @inject(JwtService) protected jwtService: JwtService,
        @inject(LikeService) protected likeService: LikeService
    ) {
    }

    async getPosts(req: Request, res: Response) {
        const page = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
        const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt';
        const sortDirection = req.query.sortDirection === 'asc' ? 'asc' : 'desc';
        const posts = await this.postService.getPosts(page, pageSize, sortBy, sortDirection, req.user?.id);
        res.json(posts);
    }

    async getPostById(req: Request, res: Response) {
        const post = await this.postService.getPostById(req.params.id,req.user?.id);
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

    async updatePostLikeInfo(req: Request, res: Response) {
        const userId = req.user?.id!;
        const postId = req.params.id;
        const post = await this.postService.getPostById(postId);
        if (!post) return res.sendStatus(CODE_RESPONSE.NOT_FOUND_404);
        const likeStatus = req.body.likeStatus;
        const postLikeInfo = await this.likeService.getPostLikeInfo(userId, postId);
        if (!postLikeInfo) {
            await this.likeService.addPostLikeInfo({
                userId,
                postId: post.id,
                likeStatus,
                login: req.user!.login,
                addedAt: new Date().toISOString()
            });
        }
        if (postLikeInfo && postLikeInfo.likeStatus !== likeStatus) {
            await this.likeService.updatePostLikeInfo(userId, postId, likeStatus, new Date().toISOString(), req.user!.login);
        }
        let likesInfo = getUpdatedLikesCountForPost({postLikeInfo, likeStatus, post});

        if (postLikeInfo?.likeStatus !== likeStatus) {
            const isUpdatedPostInfo = await this.postService.updatePostLikeInfo(postId, likesInfo);
            return isUpdatedPostInfo ? res.sendStatus(CODE_RESPONSE.NO_CONTENT_204) : res.sendStatus(CODE_RESPONSE.NOT_FOUND_404);
        }
        if (postLikeInfo?.likeStatus === likeStatus) {
            return res.sendStatus(CODE_RESPONSE.NO_CONTENT_204);
        }
        return res.sendStatus(CODE_RESPONSE.INTERNAL_SERVER_ERROR_500);
    }

    async deletePost(req: Request, res: Response) {
        const isPostDeleted = await this.postService.deletePost(req.params.id);
        isPostDeleted ? res.sendStatus(204) : res.sendStatus(404);
    }
}
