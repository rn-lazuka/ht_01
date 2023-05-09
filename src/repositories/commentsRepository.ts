import {commentsCollection} from '../db';
import {ObjectId} from 'mongodb';
import {Comment, CommentDBType} from '../types';

export const commentsRepository = {
    async getCommentById(id: string) {
        try {
            const result = await commentsCollection.findOne({_id: new ObjectId(id)});
            return result ? this._mapDbCommentToOutputModel(result) : null;
        } catch (e) {
            return null;
        }
    },
    async updateComment(id: string, updatedComment: Comment) {
        try {
            const result = await commentsCollection.updateOne({_id: new ObjectId(id)}, {$set: updatedComment});
            return result.matchedCount === 1;
        } catch (e) {
            return null;
        }
    },
    async deleteComment(id: string) {
        try {
            const result = await commentsCollection.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (e) {
            return null;
        }
    },
    async clearAllComments() {
        return await commentsCollection.deleteMany({});
    },
    _mapDbCommentToOutputModel(comment: CommentDBType): Comment {
        return {
            id: comment._id.toString(),
            createdAt: comment.createdAt,
            commentatorInfo: comment.commentatorInfo,
            content: comment.content
        };
    }
};
