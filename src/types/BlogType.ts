import {ObjectId} from 'mongodb';

export interface BlogType {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
}

export interface BlobDBType extends Omit<BlogType, 'id'> {
    _id: ObjectId;
}
