import express from 'express';
import {videoRouter} from './routes/video-router';
import {testRouter} from './routes/test-router';
import {blogRouter} from './routes/blogs-router';
import {postsRouter} from './routes/posts-router';

export const app = express();

app.use(express.json());
app.use('/videos', videoRouter);
app.use('/blogs', blogRouter);
app.use('/posts', postsRouter);
app.use('/testing/all-data', testRouter);
