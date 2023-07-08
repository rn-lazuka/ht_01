import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const MONGO_URI = process.env.API_URL || 'mongodb://localhost:27017';

// export const client = new MongoClient(MONGO_URI);
//
// export const db = client.db();

// export const postsCollection = db.collection<Omit<PostType, 'id'>>('posts', {});
// export const blogsCollection = db.collection<Omit<BlogType, 'id'>>('blogs');
// export const usersCollection = db.collection<UserEntity>('users');
// export const commentsCollection = db.collection<CommentEntity>('comments');
// export const refreshTokensCollection = db.collection<RefreshToken>('refreshTokens');
// export const devicesCollection = db.collection<DeviceType>('devices');
// export const apiRequestsCollection = db.collection<ApiRequestInfo>('apiRequests');



export async function runDB() {
    try {
        // await client.connect();
        await mongoose.connect(MONGO_URI);
        // await client.db('network').command({ping: 1});
        console.log('Successfully connected to mongodb!');
    } catch (error) {
        console.log(`some error: ${error}`);
        await mongoose.disconnect();
    }
}
