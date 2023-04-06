"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearVideosDB = exports.videoRouter = void 0;
const express_1 = require("express");
const utils_1 = require("../utils");
const date_fns_1 = require("date-fns");
exports.videoRouter = (0, express_1.Router)();
let videos = [];
const clearVideosDB = () => {
    videos = [];
};
exports.clearVideosDB = clearVideosDB;
exports.videoRouter.get('/', (req, res) => {
    res.send(videos);
});
exports.videoRouter.get('/:id', (req, res) => {
    const video = videos.find(video => video.id === +req.params.id);
    if (video) {
        res.send(video);
    }
    else {
        res.sendStatus(404);
    }
});
exports.videoRouter.post('/', (req, res) => {
    const errors = (0, utils_1.validateVideoData)(req.body);
    if (errors.length > 0) {
        res.status(400).send({ errorsMessages: errors });
    }
    else {
        const newVideo = Object.assign({ minAgeRestriction: null, id: new Date().getTime(), canBeDownloaded: false, createdAt: new Date().toISOString(), publicationDate: (0, date_fns_1.addDays)(new Date(new Date()), 1).toISOString() }, req.body);
        videos.push(newVideo);
        res.status(201).send(newVideo);
    }
});
exports.videoRouter.put('/:id', (req, res) => {
    const videoIndex = videos.findIndex(video => video.id === +req.params.id);
    const errors = (0, utils_1.validateVideoData)(req.body);
    if (videoIndex > -1 && errors.length > 0) {
        res.status(400).send({ errorsMessages: errors });
    }
    if (videoIndex === -1) {
        res.sendStatus(404);
    }
    else {
        videos[videoIndex] = Object.assign(Object.assign({}, videos[videoIndex]), req.body);
        res.sendStatus(204);
    }
});
exports.videoRouter.delete('/:id', (req, res) => {
    const videoIndex = videos.findIndex(video => video.id === +req.params.id);
    if (videoIndex > -1) {
        videos.splice(videoIndex, 1);
        res.sendStatus(204);
    }
    if (videoIndex === -1) {
        res.sendStatus(404);
    }
});
