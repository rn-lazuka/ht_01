import {ObjectId} from 'mongodb';

export interface BlogType {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
}

// export interface BlobDBType extends Omit<BlogType, 'id'> {
//     _id: ObjectId;
// }

export class BlogDBType {
    constructor(
        public _id: ObjectId,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership: boolean,
    ) {
    }
}
