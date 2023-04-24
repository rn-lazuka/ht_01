import {Blog} from '../types';
import {blogsCollection, postsCollection} from '../db';
import {ObjectId} from 'mongodb';
import {postsRepository} from './postsRepository';

export const blogRepository = {
    async getBlogs(page:number,pageSize:number,searchNameTerm: string | null, sortBy: string, sortDirection: 'asc' | 'desc') {
        const filter: any = {};
        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' }; // Case-insensitive search
        }

        const sortOptions: any = {};
        sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1;

        const totalCount = await blogsCollection.countDocuments();
        const pagesCount = Math.ceil(totalCount / pageSize);
        const skip = (page - 1) * pageSize;
        const blogs = await blogsCollection.find({}).sort(sortOptions).limit(pageSize).skip(skip).toArray();
        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: blogs.map((blog) => this._mapDbBlogToOutputModel(blog))
        };
    },
    async getBlogById(id: string) {
        const result = await blogsCollection.findOne({_id: new ObjectId(id)});
        return result ? this._mapDbBlogToOutputModel(result) : null;
    },
    async getAllPostsForBlog(id: string,page: number, pageSize: number,sortBy: string, sortDirection: 'asc' | 'desc') {
        const sortOptions: any = {};
        sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1;
        const filter = { blogId: new ObjectId(id) };

        const totalCount = await postsCollection.countDocuments(filter);
        const pagesCount = Math.ceil(totalCount / pageSize);
        const skip = (page - 1) * pageSize;
        const posts = await postsCollection.find(filter).sort(sortOptions).skip(skip).limit(pageSize).toArray();

        return posts ? {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: posts.map((post) => postsRepository._mapDbPostToOutputModel(post))
        } : null;
    },
    async createBlog(blog: Omit<Blog, 'id'>) {
        const result = await blogsCollection.insertOne(blog);
        return this._mapDbBlogToOutputModel(result);
    },
    async updateBlog(id: string, updatedBlog: Blog) {
        const result = await blogsCollection.updateOne({_id: new ObjectId(id)}, {$set: updatedBlog});
        return result.matchedCount === 1;
    },
    async deleteBlog(id: string) {
        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
    },
    async clearAllBlogs() {
        return await blogsCollection.deleteMany({});
    },
    _mapDbBlogToOutputModel(blog: any): Blog {
        return {
            id: blog._id,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        };
    }
};
