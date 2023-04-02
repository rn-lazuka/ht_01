"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVideoData = void 0;
const enums_1 = require("../enums");
const validateVideoData = (video) => {
    var _a;
    const errors = [];
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    if (!(video === null || video === void 0 ? void 0 : video.title)) {
        errors.push({ message: 'required field', field: 'title' });
    }
    if (!(video === null || video === void 0 ? void 0 : video.author)) {
        errors.push({ message: 'required field', field: 'author' });
    }
    if ((video === null || video === void 0 ? void 0 : video.title) && video.title.length > 40) {
        errors.push({ message: 'max length 40', field: 'title' });
    }
    if ((video === null || video === void 0 ? void 0 : video.author) && video.author.length > 20) {
        errors.push({ message: 'max length 20', field: 'author' });
    }
    if (((_a = video === null || video === void 0 ? void 0 : video.availableResolutions) === null || _a === void 0 ? void 0 : _a.length) > 0 && video.availableResolutions.filter(resolution => !(resolution in enums_1.VideoResolutions)).length > 0) {
        errors.push({ message: 'each value should be equal to known resolutions', field: 'availableResolutions' });
    }
    if ((video === null || video === void 0 ? void 0 : video.canBeDownloaded) && typeof (video === null || video === void 0 ? void 0 : video.canBeDownloaded) !== 'boolean') {
        errors.push({ message: 'should be true or false', field: 'canBeDownloaded' });
    }
    if ((video === null || video === void 0 ? void 0 : video.minAgeRestriction) && (video.minAgeRestriction > 18 || video.minAgeRestriction < 1)) {
        errors.push({ message: 'should be between 1 and 18', field: 'minAgeRestriction' });
    }
    if ((video === null || video === void 0 ? void 0 : video.publicationDate) && (new Date(video.publicationDate).toString() === 'Invalid Date' || !isoDatePattern.test(video.publicationDate))) {
        errors.push({ message: 'should be valid date string', field: 'publicationDate' });
    }
    return errors;
};
exports.validateVideoData = validateVideoData;
