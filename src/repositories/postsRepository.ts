import {Post} from '../types';
import {blogsCollection, postsCollection} from '../db';
import {ObjectId} from 'mongodb';

export const postsRepository = {
    async getPosts(page: number, pageSize: number) {
        const totalCount = await blogsCollection.countDocuments();
        const pagesCount = Math.ceil(totalCount / pageSize);
        const skip = (page - 1) * pageSize;
        const posts = await postsCollection.find().limit(pageSize).skip(skip).toArray();
        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: posts.map(post => this._mapDbPostToOutputModel(post))
        };
    },
    async getPostById(id: string) {
        const result = await postsCollection.findOne({_id: new ObjectId(id)});
        return this._mapDbPostToOutputModel(result);
    },
    async createPost(post: Omit<Post, 'id'>) {
        const result = await postsCollection.insertOne(post);
        return this._mapDbPostToOutputModel({_id: result.insertedId, ...result});
    },
    async updatePost(id: string, updatedPost: Omit<Post, 'blogName'>) {
        const result = await postsCollection.updateOne({_id: new ObjectId(id)}, {$set: updatedPost});
        return result.matchedCount === 1;
    },
    async deletePost(id: string) {
        const result = await postsCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
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
