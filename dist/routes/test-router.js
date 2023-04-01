"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRouter = void 0;
const express_1 = require("express");
const video_router_1 = require("./video-router");
exports.testRouter = (0, express_1.Router)();
exports.testRouter.delete('/', (req, res) => {
    (0, video_router_1.clearDB)();
    res.send(204);
});
