import {ObjectId} from 'mongodb';

export interface Device {
    ip: string;
    title: string;
    lastActiveDate: number;
    deviceId: string;
    expDate?: number;
    userId?: string;
}

export interface DeviceDbType extends Device {
    _id: ObjectId;
}
