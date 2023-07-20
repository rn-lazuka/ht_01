import {ObjectId} from 'mongodb';

export interface DeviceType {
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string;
    expDate?: string;
    userId?: string;
}

export interface DeviceDbType extends DeviceType {
    _id: ObjectId;
}

export class DeviceDBType {
    constructor(
        public _id: ObjectId,
        public ip: string,
        public title: string,
        public lastActiveDate: string,
        public deviceId: string,
        public expDate?: string,
        public userId?: string, //TODO нормально ли иметь несколько вариативных пропсов
    ) {
    }
}
