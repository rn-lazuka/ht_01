import {Router} from 'express';
import {clearVideosDB} from './video-router';
import {blogRepository} from '../repositories/blogRepository';
import {postsRepository} from '../repositories/postsRepository';
import {userRepository} from '../repositories/userRepository';
import {commentsRepository} from '../repositories/commentsRepository';

export const testRouter = Router();

testRouter.delete('/', (req, res) => {
    clearVideosDB();
    blogRepository.clearAllBlogs();
    postsRepository.clearAllPosts();
    userRepository.clearAllUsers();
    commentsRepository.clearAllComments();
    res.sendStatus(204);
});
