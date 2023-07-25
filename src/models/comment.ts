import mongoose from 'mongoose';
import {CommentDBType} from '../types';


export const commentSchema = new mongoose.Schema<CommentDBType>({
    content: String,
    createdAt: String,
    commentatorInfo: {
        userId: String,
        userLogin: String
    },
    postId: String,
    likesInfo: {
        likesCount: {type: Number, required: true},
        dislikesCount: {type: Number, required: true}
    }
});

commentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

commentSchema.set('toJSON', {virtuals: true});

export const Comment = mongoose.model('comments', commentSchema);
