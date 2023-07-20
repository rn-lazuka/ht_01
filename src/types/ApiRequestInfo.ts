import {ObjectId} from 'mongodb';

export interface ApiRequestInfo {
    IP: string;
    URL: string;
    date: Date;
}

export class ApiRequestInfoDBType {
    constructor(
        public _id: ObjectId,
        public IP: string,
        public URL: string,
        public date: Date
    ) {
    }
}
