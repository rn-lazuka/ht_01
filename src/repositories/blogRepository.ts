import {Blog} from '../types';
import {blogsCollection} from '../db';

export const blogRepository = {
    async getBlogs() {
        return blogsCollection.find({}).project({_id: 0}).toArray();
    },
    async getBlogById(id: string) {
        return await blogsCollection.findOne({id}, {projection: {_id: 0}});
    },
    async createBlog(blog: Omit<Blog, 'id'>) {
        const newBlog = {
            ...blog,
            id: new Date().getTime().toString(),
            createdAt: new Date().toISOString(),
            isMembership: false
        };
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
