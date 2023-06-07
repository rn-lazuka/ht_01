import express from 'express';
import {videoRouter} from './routes/video-router';
import {testRouter} from './routes/test-router';
import {blogRouter} from './routes/blogs-router';
import {postsRouter} from './routes/posts-router';
import {userRouter} from './routes/users-router';
import {authRouter} from './routes/auth-router';
import {commentsRouter} from './routes/comments-router';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

export const app = express();
dotenv.config();
export const JWT_SECRET = process.env.JWT_SECRET || '123';

app.use(express.json());
app.use(cookieParser())
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/videos', videoRouter);
app.use('/blogs', blogRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
app.use('/testing/all-data', testRouter);
