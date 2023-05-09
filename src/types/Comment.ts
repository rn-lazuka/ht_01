import {ObjectId} from 'mongodb';

export interface CommentEntity {
    content: string;
    createdAt: string;
    commentatorInfo: Commentator;
    postId: string;
}

export interface Commentator {
    userId: string;
    userLogin: string;
}

export interface Comment extends Omit<CommentEntity, 'postId'> {
    id: string;
}

export interface CommentDBType extends Omit<Comment,'id'> {
    _id: ObjectId;
}
