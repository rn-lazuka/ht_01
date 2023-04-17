import {ObjectId} from 'mongodb';

export interface Post {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
}

export interface PostWithId extends Post {
    _id?: ObjectId;
}
