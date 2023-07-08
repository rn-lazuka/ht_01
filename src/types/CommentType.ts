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

export interface CommentType extends CommentEntity {
    id: string;
}

export interface CommentDBType extends Omit<CommentType,'id'> {
    _id: ObjectId;
}
