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
    if (likeStatus === LikeStatus.LIKE && commentLikeInfo && commentLikeInfo.likeStatus === LikeStatus.DISLIKE) {
        return {
            likesCount: comment.likesInfo.likesCount + 1,
            dislikesCount: comment.likesInfo.dislikesCount - 1
        };
    }
    if (likeStatus === LikeStatus.LIKE && commentLikeInfo && commentLikeInfo.likeStatus !== LikeStatus.DISLIKE) {
        return {
            likesCount: comment.likesInfo.likesCount + 1,
            dislikesCount: comment.likesInfo.dislikesCount
        };
    }
    if (likeStatus === LikeStatus.DISLIKE && commentLikeInfo && commentLikeInfo.likeStatus === LikeStatus.LIKE) {
        return {
            likesCount: comment.likesInfo.likesCount - 1,
            dislikesCount: comment.likesInfo.dislikesCount + 1
        };
    }
    if (likeStatus === LikeStatus.DISLIKE && commentLikeInfo && commentLikeInfo.likeStatus !== LikeStatus.LIKE) {
        return {
            likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount + 1
        };
    }
    return {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount
    };
};
