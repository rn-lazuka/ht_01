"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const video_router_1 = require("./routes/video-router");
const test_router_1 = require("./routes/test-router");
const blogs_router_1 = require("./routes/blogs-router");
const posts_router_1 = require("./routes/posts-router");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use('/videos', video_router_1.videoRouter);
exports.app.use('/blogs', blogs_router_1.blogRouter);
exports.app.use('/posts', posts_router_1.postsRouter);
exports.app.use('/testing/all-data', test_router_1.testRouter);
