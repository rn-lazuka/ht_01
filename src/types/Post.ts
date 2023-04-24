import {ObjectId} from 'mongodb';

export interface Post {
    id: ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: ObjectId;
    blogName: string;
    createdAt: string;
}

export interface PostWithId extends Omit<Post,'id'> {
    _id: ObjectId;
}
