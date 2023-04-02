import express from 'express';
import {videoRouter} from './routes/video-router';
import {testRouter} from './routes/test-router';

export const app = express();

app.use(express.json())
app.use('/videos',videoRouter)
app.use('/testing/all-data',testRouter)
