import {Blog} from '../types';
import {blogsCollection} from '../db';

export const blogRepository = {
    async getBlogs() {
        return blogsCollection.find().toArray();
    },
    async getBlogById(id: string) {
        return await blogsCollection.findOne({id});
    },
    async createBlog(blog: Omit<Blog, 'id'>) {
        const newBlog: Blog = {...blog, id: new Date().getTime().toString(), createdAt: new Date().toISOString(), isMembership: false};
        await blogsCollection.insertOne(newBlog);
        return newBlog;
    },
    async updateBlog(id: string, updatedBlog: Blog) {
        const result = await blogsCollection.updateOne({id}, {$set: updatedBlog});
        return result.matchedCount === 1;
    },
    async deleteBlog(id: string) {
        const result = await blogsCollection.deleteOne({id});
        return result.deletedCount === 1;
    },
    async clearAllBlogs() {
        return await blogsCollection.deleteMany({});
    }
};
