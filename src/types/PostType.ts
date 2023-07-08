import {ObjectId} from 'mongodb';

export interface PostType {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
}

export interface PostDBType extends Omit<PostType,'id'> {
    _id: ObjectId;
}
