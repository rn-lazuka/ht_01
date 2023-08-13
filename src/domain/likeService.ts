import {LikesRepository} from '../repositories/likesRepository';
import {LikeStatus} from '../enums/Likes';
import {CommentLikeDBType} from '../types/likeType';
import {inject, injectable} from 'inversify';

@injectable()
export class LikeService {
    constructor(@inject(LikesRepository) protected likeRepository: LikesRepository) {
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
