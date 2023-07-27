import {LikeStatus} from '../enums/Likes';
import {CommentType} from '../types';
import {CommentLikeDBType} from '../types/likeType';

interface getUpdatedLikesCountForComment {
    likeStatus: LikeStatus;
    comment: CommentType;
    commentLikeInfo: CommentLikeDBType | null;
}

export const getUpdatedLikesCountForComment = ({
                                                   likeStatus,
                                                   comment,
                                                   commentLikeInfo
                                               }: getUpdatedLikesCountForComment): {
    likesCount: number,
    dislikesCount: number
} => {
    if (likeStatus === LikeStatus.LIKE && commentLikeInfo) {
        return {
            likesCount: commentLikeInfo.likeStatus !== LikeStatus.LIKE ? comment.likesInfo.likesCount + 1 : comment.likesInfo.likesCount,
            dislikesCount: commentLikeInfo.likeStatus === LikeStatus.DISLIKE ? comment.likesInfo.dislikesCount - 1 : comment.likesInfo.dislikesCount
        };
    }
    if (likeStatus === LikeStatus.DISLIKE && commentLikeInfo) {
        return {
            likesCount: commentLikeInfo.likeStatus === LikeStatus.LIKE ? comment.likesInfo.likesCount - 1 : comment.likesInfo.likesCount,
            dislikesCount: commentLikeInfo.likeStatus === LikeStatus.DISLIKE ? comment.likesInfo.dislikesCount : comment.likesInfo.dislikesCount + 1
        };
    }
    if (likeStatus === LikeStatus.NONE && commentLikeInfo) {
        return {
            likesCount: commentLikeInfo.likeStatus === LikeStatus.LIKE ? comment.likesInfo.likesCount - 1 : comment.likesInfo.likesCount,
            dislikesCount: commentLikeInfo.likeStatus === LikeStatus.DISLIKE ? comment.likesInfo.dislikesCount - 1 : comment.likesInfo.dislikesCount
        };
    }
    if (!commentLikeInfo) {
        return {
            likesCount: likeStatus === LikeStatus.LIKE ? comment.likesInfo.likesCount + 1 : comment.likesInfo.likesCount,
            dislikesCount: likeStatus === LikeStatus.DISLIKE ? comment.likesInfo.dislikesCount + 1 : comment.likesInfo.dislikesCount
        };
    }
    return {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount
    };
};
