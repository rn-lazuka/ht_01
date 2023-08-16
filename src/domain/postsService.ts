import {CommentDBType, PostDBType, PostType} from '../types';
import {BlogRepository} from '../repositories/blogRepository';
import {PostRepository} from '../repositories/postsRepository';
import {ObjectId} from 'mongodb';
import {inject, injectable} from 'inversify';

export interface CreateCommentProps {
    postId: string;
    content: string;
    userId: string;
    userLogin: string;
}

@injectable()
export class PostService {
    constructor(
        @inject(PostRepository) protected postRepository: PostRepository,
        @inject(BlogRepository) protected blogRepository: BlogRepository) {
    }

    async getPosts(page: number, pageSize: number, sortBy: string, sortDirection: 'asc' | 'desc', userId?:string) {
        return this.postRepository.getPosts(page, pageSize, sortBy, sortDirection,userId);
    }

    async getPostById(id: string, userId?:string) {
        return await this.postRepository.getPostById(id,userId);
    }

    async createPost(post: Omit<PostType, 'id' | 'blogName' | 'extendedLikesInfo'>) {
        const blog = await this.blogRepository.getBlogById(post.blogId);
        const newPost = new PostDBType(new ObjectId(), post.title, post.shortDescription, post.content, post.blogId, blog?.name!);
        return await this.postRepository.createPost(newPost);
    }

    async getCommentsByPostId(userId: string | undefined, postId: string, page: number, pageSize: number, sortBy: string, sortDirection: 'asc' | 'desc') {
        const post = await this.postRepository.getPostById(postId);
        if (!post) return null;
        return this.postRepository.getCommentsByPostId({userId, postId, page, pageSize, sortBy, sortDirection});
    }

    async createComment(props: CreateCommentProps) {
        const post = await this.postRepository.getPostById(props.postId);
        if (!post) return null;
        const commentatorInfo = {
            userId: props.userId,
            userLogin: props.userLogin
        };
        const newComment = new CommentDBType(new ObjectId(), props.content, commentatorInfo, new Date().toISOString(), props.postId, {
            likesCount: 0,
            dislikesCount: 0
        });
        return await this.postRepository.addComment(newComment);
    }
    updatePostLikeInfo(id: string, likesInfo: { likesCount: number, dislikesCount: number }) {
        return this.postRepository.updatePostLikeInfo(id, likesInfo);
    }
    async updatePost(id: string, updatedPost: Omit<PostType, 'blogName'>) {
        return await this.postRepository.updatePost(id, updatedPost);
    }

    async deletePost(id: string) {
        return await this.postRepository.deletePost(id);
    }
}
