import {CommentRepository} from '../repositories/commentsRepository';
import {CommentType} from '../types';
import {LikesRepository} from '../repositories/likesRepository';
import {LikeStatus} from '../enums/Likes';
import {CommentLikeDBType} from '../types/likeType';

export class LikeService {
    constructor(protected likeRepository: LikesRepository) {
    }

    getCommentLikeInfo(userId: string, commentId: string) {
        return this.likeRepository.getCommentLikeInfo(userId, commentId);
    }

    addCommentLikeInfo(commentLikeInfo:CommentLikeDBType) {
        return this.likeRepository.addCommentLikeInfo(commentLikeInfo);
    }
    updateCommentLikeInfo(userId: string, commentId: string, likeStatus: LikeStatus) {
        return this.likeRepository.updateCommentLikeInfo(userId, commentId, likeStatus);
    }

}
