import {LikesRepository} from '../repositories/likesRepository';
import {LikeStatus} from '../enums/Likes';
import {CommentLikeDBType, PostLikeDBType} from '../types/likeType';
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

    getPostLikeInfo(userId: string, postId: string) {
        return this.likeRepository.getPostLikeInfo(userId, postId);
    }
    addPostLikeInfo(likeInfo:PostLikeDBType) {
        return this.likeRepository.addPostLikeInfo(likeInfo);
    }
    updatePostLikeInfo(userId: string, postId: string, likeStatus: LikeStatus, addedAt: string, login: string) {
        return this.likeRepository.updatePostLikeInfo(userId, postId, likeStatus, addedAt, login);
    }
}
