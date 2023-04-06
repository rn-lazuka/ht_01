import {Router} from 'express';
import {clearVideosDB} from './video-router';
import {blogRepository} from '../repositories/blogRepository';
import {postsRepository} from '../repositories/postsRepository';

export const testRouter = Router();

testRouter.delete('/', (req, res) => {
    clearVideosDB();
    blogRepository.clearAllBlogs();
    postsRepository.clearAllPosts()
    res.sendStatus(204);
});
