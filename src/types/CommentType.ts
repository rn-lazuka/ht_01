import {ObjectId} from 'mongodb';

export interface Commentator {
    userId: string;
    userLogin: string;
}

export interface CommentType {
    id: string;
    content: string;
    createdAt: string;
    commentatorInfo: Commentator;
    postId?: string;
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
        public postId?: string,
    ) {
    }
}
