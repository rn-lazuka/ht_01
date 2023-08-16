import {LikeStatus} from '../enums/Likes';

export interface NewLike {
    addedAt: string;
    userId: string;
    login: string;
}

export class ExtendedLikesInfo {
    constructor(
        public likesCount: number = 0,
        public dislikesCount: number = 0,
        public myStatus: LikeStatus = LikeStatus.NONE,
        public newestLikes: NewLike[] = [],
    ){}
}

export class CommentLikeDBType {
    constructor(
        public commentId: string,
        public userId: string,
        public likeStatus: LikeStatus
    ) {
    }
}

export class PostLikeDBType {
    constructor(
        public userId: string,
        public postId: string,
        public login: string,
        public addedAt: string,
        public likeStatus: LikeStatus
    ) {
    }
}
