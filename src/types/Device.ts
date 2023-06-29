import {ObjectId} from 'mongodb';

export interface Device {
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string;
    userId?: string;
}

export interface DeviceDbType extends Device {
    _id: ObjectId;
}
