import mongoose from 'mongoose';
import {PostDBType} from '../types';
import {ExtendedLikesInfo, NewLike} from '../types/likeType';
import {LikeStatus} from '../enums/Likes';

export const postSchema = new mongoose.Schema<PostDBType>({
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String,
    extendedLikesInfo: {
        likesCount: Number,
        dislikesCount: Number,
    },
});

postSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

postSchema.set('toJSON', {virtuals: true});

export const Post = mongoose.model('posts', postSchema);
