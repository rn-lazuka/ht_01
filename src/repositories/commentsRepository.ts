import {CommentDBType, CommentType} from '../types';
import {Comment} from '../models/comment';

export const commentsRepository = {
    async getCommentById(id: string) {
        const result = await Comment.findById(id);
        return result ? this._mapDbCommentToOutputModel(result) : null;
    },
    async updateComment(id: string, updatedComment: CommentType) {
        const result = await Comment.findByIdAndUpdate(id, updatedComment);
        return result;
    },
    async deleteComment(id: string) {
        const result = await Comment.findByIdAndDelete(id);
        return result;
    },
    async clearAllComments() {
        await Comment.deleteMany({});
    },
    _mapDbCommentToOutputModel(comment: CommentDBType): CommentType {
        return {
            id: comment._id.toString(),
            createdAt: comment.createdAt,
            commentatorInfo: comment.commentatorInfo,
            content: comment.content
        };
    }
};
