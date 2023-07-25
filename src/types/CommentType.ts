import {ObjectId} from 'mongodb';
import {LikeStatus} from '../enums/Likes';

export interface Commentator {
    userId: string;
    userLogin: string;
}

export class CommentLikesInfo {
    constructor(
        public likesCount = 0,
        public dislikesCount = 0,
        public myStatus: LikeStatus = LikeStatus.NONE) {
    }
}

export interface CommentType {
    id: string;
    content: string;
    createdAt: string;
    commentatorInfo: Commentator;
    postId?: string;
    likesInfo: CommentLikesInfo;
}

// export interface CommentDBType extends Omit<CommentType,'id'> {
//     _id: ObjectId;
// }

export class CommentDBType {
    constructor(
        public _id: ObjectId,
        public content: string,
        public commentatorInfo: Commentator,
        public createdAt: string,
        public postId: string,
        public likesInfo: {
            likesCount: number,
            dislikesCount: number
        }
    ) {
    }
}
