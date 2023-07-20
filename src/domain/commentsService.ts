import {CommentRepository} from '../repositories/commentsRepository';
import {CommentType} from '../types';

export class CommentService  {
    constructor(protected commentRepository: CommentRepository) {
    }
    getCommentById(id: string) {
        return this.commentRepository.getCommentById(id);
    }
    updateComment(id: string, comment: CommentType) {
        return this.commentRepository.updateComment(id, comment);
    }
    deleteComment(id: string) {
        return this.commentRepository.deleteComment(id);
    }
}
