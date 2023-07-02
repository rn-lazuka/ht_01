import {ObjectId} from 'mongodb';

export interface ApiRequestInfo {
    IP: string;
    URL: string;
    date: Date;
}

export interface ApiRequestInfoDBType extends ApiRequestInfo {
    _id: ObjectId;
}
