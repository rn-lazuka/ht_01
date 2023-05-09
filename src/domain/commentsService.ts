import {commentsRepository} from '../repositories/commentsRepository';
import {Comment} from '../types';

export const commentsService = {
    getCommentById(id: string) {
        return commentsRepository.getCommentById(id);
    },
    updateComment(id: string, comment: Comment) {
        return commentsRepository.updateComment(id, comment);
    },
    deleteComment(id: string) {
        return commentsRepository.deleteComment(id);
    }
};
