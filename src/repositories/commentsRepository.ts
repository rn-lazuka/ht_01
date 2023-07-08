import {CommentType} from '../types';
import {Comment} from '../models/comment';

export const commentsRepository = {
    async getCommentById(id: string) {
        const result = await Comment.findById(id).select('-postId');
        return result;
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
};
