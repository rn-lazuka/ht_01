import {CommentDBType, CommentLikesInfo, PostDBType, PostType} from '../types';
import {BlogRepository} from '../repositories/blogRepository';
import {PostRepository} from '../repositories/postsRepository';
import {ObjectId} from 'mongodb';

export interface CreateCommentProps {
    postId: string;
    content: string;
    userId: string;
    userLogin: string;
}

export class PostService {
    constructor(protected postRepository: PostRepository, protected blogRepository: BlogRepository) {
    }

    async getPosts(page: number, pageSize: number, sortBy: string, sortDirection: 'asc' | 'desc') {
        return this.postRepository.getPosts(page, pageSize, sortBy, sortDirection);
    }

    async getPostById(id: string) {
        return await this.postRepository.getPostById(id);
    }

    async createPost(post: Omit<PostType, 'id' | 'blogName'>) {
        const blog = await this.blogRepository.getBlogById(post.blogId);
        const newPost = new PostDBType(new ObjectId(), post.title, post.shortDescription, post.content, post.blogId, blog?.name!, new Date().toISOString());
        return await this.postRepository.createPost(newPost);
    }

    async getCommentsByPostId(userId:string,postId: string, page: number, pageSize: number, sortBy: string, sortDirection: 'asc' | 'desc') {
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

    async updatePost(id: string, updatedPost: Omit<PostType, 'blogName'>) {
        return await this.postRepository.updatePost(id, updatedPost);
    }

    async deletePost(id: string) {
        return await this.postRepository.deletePost(id);
    }
}
