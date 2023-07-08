import mongoose from 'mongoose';
import {BlobDBType, PostDBType} from '../types';

export const postSchema = new mongoose.Schema<PostDBType>({
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String,
});

postSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

postSchema.set('toJSON', {virtuals: true});

export const Post = mongoose.model('posts', postSchema);
