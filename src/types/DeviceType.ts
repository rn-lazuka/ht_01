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
