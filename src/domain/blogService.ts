import {BlogType} from '../types';
import {blogRepository} from '../repositories/blogRepository';

export const blogService = {
    getBlogs(page:number,pageSize:number,searchNameTerm: string | null, sortBy: string, sortDirection: 'asc' | 'desc') {
        return blogRepository.getBlogs(page,pageSize,searchNameTerm,sortBy,sortDirection);
    },
    getAllPostsForBlog(id:string,page:number,pageSize:number,sortBy: string, sortDirection: 'asc' | 'desc') {
        return blogRepository.getAllPostsForBlog(id,page,pageSize,sortBy,sortDirection);
    },
    getBlogById(id: string) {
        return blogRepository.getBlogById(id);
    },
    createBlog(blog: Omit<BlogType, 'id'>) {
        const newBlog = {
            ...blog,
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        return blogRepository.createBlog(newBlog);
    },
    updateBlog(id: string, updatedBlog: BlogType) {
        return blogRepository.updateBlog(id, updatedBlog);
    },
    deleteBlog(id: string) {
        return blogRepository.deleteBlog(id);
    }
};
