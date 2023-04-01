"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const video_router_1 = require("./routes/video-router");
const test_router_1 = require("./routes/test-router");
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const parserMiddleware = (0, body_parser_1.default)();
app.use(parserMiddleware);
app.use('/hometask_01/api/videos', video_router_1.videoRouter);
app.use('/ht_01/api/testing/all-data', test_router_1.testRouter);
app.listen(port, () => {
    console.log(`App listen on port ${port}`);
});
