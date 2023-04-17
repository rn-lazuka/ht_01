import {ObjectId} from 'mongodb';

export interface Blog {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
}

export interface BlogWithId extends Blog {
    _id?: ObjectId;
}
