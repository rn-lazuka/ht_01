import {Router} from 'express';
import {Video} from '../types';
import {validateVideoData} from '../utils';
import {addDays} from 'date-fns';

export const videoRouter = Router();

let videos: Video[] = [];

export const clearVideosDB = () => {
    videos = [];
};
videoRouter.get('/', (req, res) => {
    res.send(videos);
});

videoRouter.get('/:id', (req, res) => {
    const video = videos.find(video => video.id === +req.params.id);
    if (video) {
        res.send(video);
    } else {
        res.sendStatus(404);
    }
});

videoRouter.post('/', (req, res) => {
    const errors = validateVideoData(req.body);
    if (errors.length > 0) {
        res.status(400).send({errorsMessages: errors});
    } else {
        const newVideo = {
            minAgeRestriction: null,
            id: new Date().getTime(),
            canBeDownloaded: false,
            createdAt: new Date().toISOString(),
            publicationDate: addDays(new Date(new Date()), 1).toISOString(),
            ...req.body,
        };
        videos.push(newVideo);
        res.status(201).send(newVideo);
    }
});
videoRouter.put('/:id', (req, res) => {
    const videoIndex = videos.findIndex(video => video.id === +req.params.id);
    const errors = validateVideoData(req.body);
    if (videoIndex > -1 && errors.length > 0) {
        res.status(400).send({errorsMessages: errors});
    }
    if (videoIndex === -1) {
        res.sendStatus(404);
    } else {
        videos[videoIndex] = {...videos[videoIndex], ...req.body};
        res.sendStatus(204);
    }
});

videoRouter.delete('/:id', (req, res) => {
    const videoIndex = videos.findIndex(video => video.id === +req.params.id);
    if (videoIndex > -1) {
        videos.splice(videoIndex, 1);
        res.sendStatus(204);
    }
    if (videoIndex === -1) {
        res.sendStatus(404);
    }
});
