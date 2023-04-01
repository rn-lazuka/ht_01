"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDB = exports.videoRouter = void 0;
const express_1 = require("express");
const utils_1 = require("../utils");
exports.videoRouter = (0, express_1.Router)();
let videos = [];
const clearDB = () => {
    videos = [];
};
exports.clearDB = clearDB;
exports.videoRouter.get('/', (req, res) => {
    res.send(videos);
});
exports.videoRouter.get('/:id', (req, res) => {
    const video = videos.find(video => video.id === +req.params.id);
    if (video) {
        res.send(video);
    }
    else {
        res.send(404);
    }
});
exports.videoRouter.post('/', (req, res) => {
    const errors = (0, utils_1.validateVideoData)(req.body);
    if (errors.length > 0) {
        res.status(400).send({ errorMessages: errors });
    }
    else {
        videos.push(Object.assign(Object.assign({}, req.body), { id: new Date().getTime() }));
        res.status(201).send(req.body);
    }
});
exports.videoRouter.put('/:id', (req, res) => {
    const videoIndex = videos.findIndex(video => video.id === +req.params.id);
    const errors = (0, utils_1.validateVideoData)(req.body);
    if (videoIndex > -1 && errors.length > 0) {
        res.status(400).send({ errorMessages: errors });
    }
    if (videoIndex === -1) {
        res.send(404);
    }
    else {
        videos[videoIndex] = Object.assign(Object.assign({}, videos[videoIndex]), req.body);
        res.send(204);
    }
});
exports.videoRouter.delete('/:id', (req, res) => {
    const videoIndex = videos.findIndex(video => video.id === +req.params.id);
    if (videoIndex > -1) {
        videos.splice(videoIndex, 1);
        res.send(204);
    }
    if (videoIndex === -1) {
        res.send(404);
    }
});
