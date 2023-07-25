import {CommentDBType, CommentType} from '../types';
import {Comment} from '../models/comment';
import {CommentLike} from '../models/likes';
import {CommentLikeDBType} from '../types/likeType';
import {LikeStatus} from '../enums/Likes';

export class LikesRepository {
    async getCommentLikeInfo(userId: string, commentId: string): Promise<CommentLikeDBType | null> {
        const result = await CommentLike.findOne({commentId, userId});
        return result;
    }
    async addCommentLikeInfo(commentLikeInfo:CommentLikeDBType) {
        let newCommentLike = new CommentLike(commentLikeInfo)
        newCommentLike = await newCommentLike.save();
        return newCommentLike;
    }
    async updateCommentLikeInfo(userId: string, commentId: string, likeStatus: LikeStatus) {
        const result = await CommentLike.updateOne({userId, commentId}, {likeStatus});
        return result.modifiedCount === 1;
    }
}
