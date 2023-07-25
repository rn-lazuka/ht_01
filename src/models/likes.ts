import mongoose from 'mongoose';
import {CommentDBType} from '../types';
import {LikeStatus} from '../enums/Likes';
import {CommentLikeDBType} from '../types/likeType';

export const commentLikeSchema = new mongoose.Schema<CommentLikeDBType>({
    userId: {type: String, required: true},
    commentId: {type: String, required: true},
    likeStatus: {
        type: String,
        enum: [LikeStatus.LIKE, LikeStatus.NONE, LikeStatus.DISLIKE],
        default: LikeStatus.NONE
    }
});


export const CommentLike = mongoose.model('commentLike', commentLikeSchema);
