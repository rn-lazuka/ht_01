import {Blog, BlogWithId} from '../types';
import {blogsCollection, postsCollection} from '../db';
import {ObjectId} from 'mongodb';
import {postsRepository} from './postsRepository';

export const blogRepository = {
    async getBlogs(page: number, pageSize: number, searchNameTerm: string | null, sortBy: string, sortDirection: 'asc' | 'desc') {
        const filter: any = {};
        if (searchNameTerm) {
            filter.name = {$regex: searchNameTerm, $options: 'i'}; // Case-insensitive search
        }

        const sortOptions: any = {};
        sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1;

        const totalCount = await blogsCollection.countDocuments(filter);
        const pagesCount = Math.ceil(totalCount / pageSize);
        const skip = (page - 1) * pageSize;
        const blogs = await blogsCollection.find(filter).sort(sortOptions).limit(pageSize).skip(skip).toArray();
        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: blogs.map((blog) => this._mapDbBlogToOutputModel(blog))
        };
    },
    async getBlogById(id: string) {
        try {
            const result = await blogsCollection.findOne({_id: new ObjectId(id)});
            return result ? this._mapDbBlogToOutputModel(result) : null;
        } catch (e) {
            return null;
        }
    },
    async getAllPostsForBlog(id: string, page: number, pageSize: number, sortBy: string, sortDirection: 'asc' | 'desc') {
        try {
            const sortOptions: any = {};
            sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1;
            const filter = {blogId: id};

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
        } catch (e) {
            return null;
        }
    },
    async createBlog(blog: Omit<Blog, 'id'>) {
        const result = await blogsCollection.insertOne(blog);
        const blogWithId = {
            ...blog, _id: result.insertedId
        };
        return this._mapDbBlogToOutputModel(blogWithId);
    },
    async updateBlog(id: string, updatedBlog: Blog) {
        try {
            const result = await blogsCollection.updateOne({_id: new ObjectId(id)}, {$set: updatedBlog});
            return result.matchedCount === 1;
        } catch (e) {
            return null;
        }
    },
    async deleteBlog(id: string) {
        try {
            const result = await blogsCollection.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (e) {
            return null;
        }
    },
    async clearAllBlogs() {
        return await blogsCollection.deleteMany({});
    },
    _mapDbBlogToOutputModel(blog: BlogWithId): Blog {
        return {
            id: blog._id.toString(),
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        };
    }
};
