import mongoose from 'mongoose';
import {CommentDBType} from '../types';
import {LikeStatus} from '../enums/Likes';
import {CommentLikeDBType, PostLikeDBType} from '../types/likeType';

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

export const postLikeSchema = new mongoose.Schema<PostLikeDBType>({
    userId: {type: String, required: true},
    postId: {type: String, required: true},
    login: {type: String, required: true},
    addedAt: {type: String, required: true},
    likeStatus: {
        type: String,
        enum: [LikeStatus.LIKE, LikeStatus.NONE, LikeStatus.DISLIKE],
        default: LikeStatus.NONE
    }
});


export const PostLike = mongoose.model('postLike', postLikeSchema);
