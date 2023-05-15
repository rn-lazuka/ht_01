import {Post} from '../types';
import {blogRepository} from '../repositories/blogRepository';
import {postsRepository} from '../repositories/postsRepository';

export interface CreateCommentProps {
    postId: string;
    content: string;
    userId: string;
    userLogin: string;
}

export const postsService = {
    async getPosts(page: number, pageSize: number, sortBy: string, sortDirection: 'asc' | 'desc') {
        return postsRepository.getPosts(page, pageSize, sortBy, sortDirection);
    },
    async getPostById(id: string) {
        return await postsRepository.getPostById(id);
    },
    async createPost(post: Omit<Post, 'id' | 'blogName'>) {
        const blog = await blogRepository.getBlogById(post.blogId);
        const newPost = {
            ...post,
            blogName: blog?.name!,
            createdAt: new Date().toISOString(),
        };
        return await postsRepository.createPost(newPost);
    },
    async getCommentsByPostId(postId: string, page: number, pageSize: number, sortBy: string, sortDirection: 'asc' | 'desc') {
        return postsRepository.getCommentsByPostId({postId, page, pageSize, sortBy, sortDirection});
    },
    async createComment(props: CreateCommentProps) {
        const  post =  await postsRepository.getPostById(props.postId)
        if(!post) return null
        const newComment = {
            postId: props.postId,
            content: props.content,
            commentatorInfo: {
                userId: props.userId,
                userLogin: props.userLogin
            },
            createdAt: new Date().toISOString(),
        };
        return await postsRepository.addComment(newComment);
    },
    async updatePost(id: string, updatedPost: Omit<Post, 'blogName'>) {
        return await postsRepository.updatePost(id, updatedPost);
    },
    async deletePost(id: string) {
        return await postsRepository.deletePost(id);
    },
};
