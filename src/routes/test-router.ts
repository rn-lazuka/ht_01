import {Router} from 'express';
import {
    apiRequestInfoRepository,
    blogRepository,
    commentRepository,
    deviceRepository,
    postRepository,
    userRepository
} from '../compositionRoot';
import {clearVideosDB} from './video-router';


export const testRouter = Router();

testRouter.delete('/', (req, res) => {
    clearVideosDB();
    blogRepository.clearAllBlogs();
    postRepository.clearAllPosts();
    userRepository.clearAllUsers();
    commentRepository.clearAllComments();
    deviceRepository.clearAllDevices();
    apiRequestInfoRepository.clearRequestsInfo();
    res.sendStatus(204);
});
