import {Post} from '../types';
import {blogsCollection, postsCollection} from '../db';
import {ObjectId} from 'mongodb';

export const postsRepository = {
    async getPosts(page: number, pageSize: number, sortBy: string, sortDirection: 'asc' | 'desc') {
        const totalCount = await blogsCollection.countDocuments();
        const pagesCount = Math.ceil(totalCount / pageSize);
        const skip = (page - 1) * pageSize;
        const sortOptions: any = {};
        sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1;
        const posts = await postsCollection.find().limit(pageSize).sort(sortOptions).skip(skip).toArray();
        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: posts.map(post => this._mapDbPostToOutputModel(post))
        };
    },
    async getPostById(id: string) {
        try {
            const result = await postsCollection.findOne({_id: new ObjectId(id)});
            return this._mapDbPostToOutputModel(result);
        } catch (e) {
            return null;
        }
    },
    async createPost(post: Omit<Post, 'id'>) {
        const result = await postsCollection.insertOne(post);
        return this._mapDbPostToOutputModel({_id: result.insertedId, ...post});
    },
    async updatePost(id: string, updatedPost: Omit<Post, 'blogName'>) {
        try {
            const result = await postsCollection.updateOne({_id: new ObjectId(id)}, {$set: updatedPost});
            return result.matchedCount === 1;
        } catch (e) {
            return null;
        }
    },
    async deletePost(id: string) {
        try {
        const result = await postsCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
        } catch (e) {
            return null;
        }
    },
    async clearAllPosts() {
        await postsCollection.deleteMany({});
    },
    _mapDbPostToOutputModel(post: any): Post {
        return {
            id: post._id.toString(),
            blogName: post.blogName,
            createdAt: post.createdAt,
            blogId: post.blogId,
            content: post.content,
            title: post.title,
            shortDescription: post.shortDescription,
        };
    }
};
