import {ObjectId} from 'mongodb';
import {ExtendedLikesInfo} from './likeType';

export interface PostType {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
    extendedLikesInfo: ExtendedLikesInfo;
}

// export interface PostDBType extends Omit<PostType,'id'> {
//     _id: ObjectId;
// }

export class PostDBType {
    constructor(
        public _id: ObjectId,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string = new Date().toISOString(),
        public extendedLikesInfo = new ExtendedLikesInfo()
    ) {
    }
}
