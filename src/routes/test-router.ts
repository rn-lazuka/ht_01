import {Router} from 'express';
import {clearDB} from './video-router';

export const testRouter = Router();

testRouter.delete('/', (req, res) => {
    clearDB();
    res.sendStatus(204);
});
