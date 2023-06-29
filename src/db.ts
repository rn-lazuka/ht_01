import {MongoClient} from 'mongodb';
import {ApiRequestInfo, Blog, Device, Post, UserEntity} from './types';
import dotenv from 'dotenv'
import {CommentEntity} from './types';
import {RefreshToken} from './types/Token';

dotenv.config()

export const MONGO_URI = process.env.API_URL || 'mongodb://localhost:27017';

export const client = new MongoClient(MONGO_URI);

export const db = client.db();

export const postsCollection = db.collection<Omit<Post, 'id'>>('posts', {});
export const blogsCollection = db.collection<Omit<Blog, 'id'>>('blogs');
export const usersCollection = db.collection<UserEntity>('users');
export const commentsCollection = db.collection<CommentEntity>('comments');
export const refreshTokensCollection = db.collection<RefreshToken>('refreshTokens');
export const devicesCollection = db.collection<Device>('devices');
export const apiRequestsCollection = db.collection<ApiRequestInfo>('apiRequests');

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
