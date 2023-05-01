"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRouter = void 0;
const express_1 = require("express");
const video_router_1 = require("./video-router");
const blogRepository_1 = require("../repositories/blogRepository");
const postsRepository_1 = require("../repositories/postsRepository");
const userRepository_1 = require("../repositories/userRepository");
exports.testRouter = (0, express_1.Router)();
exports.testRouter.delete('/', (req, res) => {
    (0, video_router_1.clearVideosDB)();
    blogRepository_1.blogRepository.clearAllBlogs();
    postsRepository_1.postsRepository.clearAllPosts();
    userRepository_1.userRepository.clearAllUsers();
    res.sendStatus(204);
});
