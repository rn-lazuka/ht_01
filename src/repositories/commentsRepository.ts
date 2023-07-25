import {CommentDBType, CommentType} from '../types';
import {Comment} from '../models/comment';
import {LikesRepository} from './likesRepository';
import {LikeStatus} from '../enums/Likes';

export class CommentRepository {
    constructor(
        protected likesRepository: LikesRepository) {
    }

    async getCommentById(commentId: string, userId?: string) {
        const result = await Comment.findById(commentId);
        if (!result) {
            return null;
        }
        let myStatus = LikeStatus.NONE;
        if (userId) {
            const likeInfo = await this.likesRepository.getCommentLikeInfo(userId, commentId);

            if (likeInfo) {
                myStatus = likeInfo.likeStatus;
            }
        }
        return this._mapDbCommentToOutputModel(result, myStatus);
    }

    async updateComment(id: string, updatedComment: CommentType) {
        const result = await Comment.findByIdAndUpdate(id, updatedComment);
        return result;
    }

    async updateCommentLikeInfo(id: string, likesInfo: {likesCount: number, dislikesCount:number}) {
        const result = await Comment.findByIdAndUpdate(id, {likesInfo});
        return result;
    }

    async deleteComment(id: string) {
        const result = await Comment.findByIdAndDelete(id);
        return result;
    }

    async clearAllComments() {
        await Comment.deleteMany({});
    }

    _mapDbCommentToOutputModel(comment: CommentDBType, myStatus: LikeStatus): CommentType {
        return {
            id: comment._id.toString(),
            createdAt: comment.createdAt,
            commentatorInfo: comment.commentatorInfo,
            content: comment.content,
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus
            }
        };
    }
}
