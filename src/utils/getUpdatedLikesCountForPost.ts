import {LikeStatus} from '../enums/Likes';
import {PostType} from '../types';
import {PostLikeDBType} from '../types/likeType';

interface getUpdatedLikesCountForPost {
    likeStatus: LikeStatus;
    post: PostType;
    postLikeInfo: PostLikeDBType | null;
}

export const getUpdatedLikesCountForPost = ({
                                                   likeStatus,
                                                   post,
                                                   postLikeInfo
                                               }: getUpdatedLikesCountForPost): {
    likesCount: number,
    dislikesCount: number
} => {
    if (likeStatus === LikeStatus.LIKE && postLikeInfo) {
        return {
            likesCount: postLikeInfo.likeStatus !== LikeStatus.LIKE ? post.extendedLikesInfo.likesCount + 1 : post.extendedLikesInfo.likesCount,
            dislikesCount: postLikeInfo.likeStatus === LikeStatus.DISLIKE ? post.extendedLikesInfo.dislikesCount - 1 : post.extendedLikesInfo.dislikesCount
        };
    }
    if (likeStatus === LikeStatus.DISLIKE && postLikeInfo) {
        return {
            likesCount: postLikeInfo.likeStatus === LikeStatus.LIKE ? post.extendedLikesInfo.likesCount - 1 : post.extendedLikesInfo.likesCount,
            dislikesCount: postLikeInfo.likeStatus === LikeStatus.DISLIKE ? post.extendedLikesInfo.dislikesCount : post.extendedLikesInfo.dislikesCount + 1
        };
    }
    if (likeStatus === LikeStatus.NONE && postLikeInfo) {
        return {
            likesCount: postLikeInfo.likeStatus === LikeStatus.LIKE ? post.extendedLikesInfo.likesCount - 1 : post.extendedLikesInfo.likesCount,
            dislikesCount: postLikeInfo.likeStatus === LikeStatus.DISLIKE ? post.extendedLikesInfo.dislikesCount - 1 : post.extendedLikesInfo.dislikesCount
        };
    }
    if (!postLikeInfo) {
        return {
            likesCount: likeStatus === LikeStatus.LIKE ? post.extendedLikesInfo.likesCount + 1 : post.extendedLikesInfo.likesCount,
            dislikesCount: likeStatus === LikeStatus.DISLIKE ? post.extendedLikesInfo.dislikesCount + 1 : post.extendedLikesInfo.dislikesCount
        };
    }
    return {
        likesCount: post.extendedLikesInfo.likesCount,
        dislikesCount: post.extendedLikesInfo.dislikesCount
    };
};
