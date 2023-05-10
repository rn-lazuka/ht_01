import {CommentEntity, Post} from '../types';
import { commentsCollection, postsCollection} from '../db';
import {ObjectId} from 'mongodb';
import {commentsRepository} from './commentsRepository';

export interface GetCommentProps {
    postId: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}

export const postsRepository = {
    async getPosts(page: number, pageSize: number, sortBy: string, sortDirection: 'asc' | 'desc') {
        const totalCount = await postsCollection.countDocuments();
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
    async getCommentsByPostId({
                                  postId,
                                  sortBy = 'createdAt',
                                  sortDirection = 'desc',
                                  page = 1,
                                  pageSize = 10
                              }: GetCommentProps) {
        try {
            const totalCount = await commentsCollection.countDocuments();
            const pagesCount = Math.ceil(totalCount / pageSize);
            const skip = (page - 1) * pageSize;
            const sortOptions: any = {};
            sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1;
            const comments = await commentsCollection.find({postId}).limit(pageSize).sort(sortOptions).skip(skip).toArray();
            return {
                pagesCount,
                page,
                pageSize,
                totalCount,
                items: comments.map(comment => commentsRepository._mapDbCommentToOutputModel(comment)),
            };
        } catch (e) {
            return null;
        }
    },
    async addComment(comment: CommentEntity) {
        const result = await commentsCollection.insertOne(comment);
        return commentsRepository._mapDbCommentToOutputModel({...comment, _id: result.insertedId});
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
