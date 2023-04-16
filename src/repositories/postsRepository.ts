import {Post} from '../types';
import {blogRepository} from './blogRepository';
import {postsCollection} from '../db';

export const postsRepository = {
    async getPosts() {
        return postsCollection.find().project({_id: 0}).toArray();
    },
    async getPostById(id: string) {
        //@ts-ignore
        return await postsCollection.findOne({id}, {_id: 0});
    },
    async createPost(post: Omit<Post, 'id' | 'blogName'>) {
        const blog = await blogRepository.getBlogById(post.blogId);
        const newPost = {
            ...post,
            blogName: blog?.name!,
            createdAt: new Date().toISOString(),
            id: new Date().getTime().toString(),
            _id: null
        };
        await postsCollection.insertOne(newPost);
        return newPost;
    },
    async updatePost(id: string, updatedPost: Omit<Post, 'blogName'>) {
        const result = await postsCollection.updateOne({id}, {$set: updatedPost});
        return result.matchedCount === 1;
    },
    async deletePost(id: string) {
        const result = await postsCollection.deleteOne({id});
        return result.deletedCount === 1;
    },
    async clearAllPosts() {
        await postsCollection.deleteMany({});
    }
};
