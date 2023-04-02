import {Video} from '../types';
import {VideoResolutions} from '../enums';

export const validateVideoData = (video: Video) => {
    const errors = [];
    const isoDatePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!video?.title) {
        errors.push({message: 'required field', field: 'title'});
    }
    if (!video?.author) {
        errors.push({message: 'required field', field: 'author'});
    }
    if (video?.title && video.title.length > 40) {
        errors.push({message: 'max length 40', field: 'title'});
    }
    if (video?.author && video.author.length > 20) {
        errors.push({message: 'max length 20', field: 'author'});
    }
    if (video?.availableResolutions?.length > 0 && video.availableResolutions.filter(resolution => !(resolution in VideoResolutions)).length > 0) {
        errors.push({message: 'each value should be equal to known resolutions', field: 'availableResolutions'});
    }
    if (video?.canBeDownloaded && typeof video?.canBeDownloaded !== 'boolean') {
        errors.push({message: 'should be true or false', field: 'canBeDownloaded'});
    }
    if (video?.minAgeRestriction && (video.minAgeRestriction > 18 || video.minAgeRestriction < 1)) {
        errors.push({message: 'should be between 1 and 18', field: 'minAgeRestriction'});
    }
    if (video?.publicationDate && (new Date(video.publicationDate).toString() === 'Invalid Date' || !isoDatePattern.test(video.publicationDate))) {
        errors.push({message: 'should be valid date string', field: 'publicationDate'});
    }
    return errors;
};
