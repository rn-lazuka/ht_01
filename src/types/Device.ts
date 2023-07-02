import {ObjectId} from 'mongodb';

export interface Device {
    ip: string;
    title: string;
    lastActiveDate: Date;
    deviceId: string;
    expDate?: Date;
    userId?: string;
}

export interface DeviceDbType extends Device {
    _id: ObjectId;
}
