import {MongoClient} from 'mongodb';
import {Blog, Post} from './types';

const mongoUri = process.env.API_URL || 'mongodb://localhost:27017';

export const client = new MongoClient(mongoUri);

export const db = client.db()

export const postsCollection = db.collection<Post>('posts', {})
export const blogsCollection = db.collection<Blog>('blogs')

export async function runDB() {
    try {
        await client.connect()
        await client.db('network').command({ping: 1})
        console.log('Successfully connected to mongodb!');
    } catch (error) {
        console.log(`some error: ${error}`);
        await client.close()
    }
}
