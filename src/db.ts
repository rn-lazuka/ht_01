import {MongoClient} from 'mongodb';
import {Blog, Post, UserEntity} from './types';

import dotenv from 'dotenv'
import {settings} from './settings';
import {CommentEntity} from './types/Comment';
dotenv.config()

export const client = new MongoClient(settings.MONGO_URI);

export const db = client.db();

export const postsCollection = db.collection<Omit<Post, 'id'>>('posts', {});
export const blogsCollection = db.collection<Omit<Blog, 'id'>>('blogs');
export const usersCollection = db.collection<UserEntity>('users');
export const commentsCollection = db.collection<CommentEntity>('comments');

export async function runDB() {
    try {
        await client.connect();
        await client.db('network').command({ping: 1});
        console.log('Successfully connected to mongodb!');
    } catch (error) {
        console.log(`some error: ${error}`);
        await client.close();
    }
}
