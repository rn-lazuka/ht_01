import {Post} from '../types';
import {blogRepository} from '../repositories/blogRepository';
import {postsRepository} from '../repositories/postsRepository';

export const postsService = {
    async getPosts(page: number, pageSize: number) {
        return postsRepository.getPosts(page, pageSize);
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
    async updatePost(id: string, updatedPost: Omit<Post, 'blogName'>) {
        return await postsRepository.updatePost(id, updatedPost);
    },
    async deletePost(id: string) {
        return await postsRepository.deletePost(id);
    },
};
