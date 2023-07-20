import {BlogDBType, BlogType} from '../types';
import {BlogRepository} from '../repositories/blogRepository';
import {ObjectId} from 'mongodb';

export class BlogService {
    constructor(protected blogRepository: BlogRepository) {
    }

    getBlogs(page: number, pageSize: number, searchNameTerm: string | null, sortBy: string, sortDirection: 'asc' | 'desc') {
        return this.blogRepository.getBlogs(page, pageSize, searchNameTerm, sortBy, sortDirection);
    }

    getAllPostsForBlog(id: string, page: number, pageSize: number, sortBy: string, sortDirection: 'asc' | 'desc') {
        return this.blogRepository.getAllPostsForBlog(id, page, pageSize, sortBy, sortDirection);
    }

    getBlogById(id: string) {
        return this.blogRepository.getBlogById(id);
    }

    createBlog(blog: Omit<BlogType, 'id'>) {
        const newBlog = new BlogDBType(new ObjectId(), blog.name, blog.description, blog.websiteUrl, new Date().toISOString(), false);
        return this.blogRepository.createBlog(newBlog);
    }

    updateBlog(id: string, updatedBlog: BlogType) {
        return this.blogRepository.updateBlog(id, updatedBlog);
    }

    deleteBlog(id: string) {
        return this.blogRepository.deleteBlog(id);
    }
}
