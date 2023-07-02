import {ObjectId} from 'mongodb';

export interface ApiRequestInfo {
    IP: string;
    URL: string;
    date: string;
}

export interface ApiRequestInfoDBType extends ApiRequestInfo {
    _id: ObjectId;
}
