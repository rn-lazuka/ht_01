import {ObjectId} from 'mongodb';

export interface Blog {
    id: ObjectId;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
}

export interface BlogWithId extends Omit<Blog, 'id'> {
    _id: ObjectId;
}
