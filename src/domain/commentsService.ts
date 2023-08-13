import {CommentRepository} from '../repositories/commentsRepository';
import {CommentType} from '../types';
import {inject, injectable} from 'inversify';

@injectable()
export class CommentService {
    constructor(@inject(CommentRepository) protected commentRepository: CommentRepository) {
    }

    getCommentById(commentId: string, userId: string) {
        return this.commentRepository.getCommentById(commentId, userId);
    }

    updateComment(id: string, comment: CommentType) {
        return this.commentRepository.updateComment(id, comment);
    }

    updateCommentLikeInfo(id: string, likesInfo: { likesCount: number, dislikesCount: number }) {
        return this.commentRepository.updateCommentLikeInfo(id, likesInfo);
    }

    deleteComment(id: string) {
        return this.commentRepository.deleteComment(id);
    }
}
