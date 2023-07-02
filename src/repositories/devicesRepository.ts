import {Device, DeviceDbType} from '../types';
import {devicesCollection} from '../db';
import {JwtPayload} from 'jsonwebtoken';

export const devicesRepository = {
    async addDevice(deviceInfo: Omit<DeviceDbType, '_id'>) {
        const result = await devicesCollection.insertOne(deviceInfo);
        return this._mapDbDeviceToOutputModel({...deviceInfo, _id: result.insertedId});
    },
    async updateDeviceInfo(tokenPayload: JwtPayload) {
        const result = await devicesCollection.findOneAndUpdate({deviceId: tokenPayload.deviceId}, {
            $set: {
                lastActiveDate: `${tokenPayload.iat!}`,
                expDate: `${tokenPayload.exp!}`
            }
        });
        return result.ok === 1;
    },
    async getAllDevicesByUserId(userId: string) {
        const devices = await devicesCollection.find({userId}).toArray();
        return devices.map((device) => this._mapDbDeviceToOutputModel(device));
    },
    async getDeviceById(deviceId: string) {
        return await devicesCollection.findOne({deviceId});
    },
    async deleteAllOtherDevices(userId: string, deviceId: string) {
        try {
            const result = await devicesCollection.deleteMany({userId, deviceId: {$ne: deviceId}});
            return result.deletedCount > 0;
        } catch (e) {
            return false;
        }
    },
    async deleteDeviceById(userId: string, deviceId: string) {
        try {
            const result = await devicesCollection.deleteMany({deviceId, userId});
            return result.deletedCount > 0;
        } catch (e) {
            return false;
        }
    },
    async clearAllDevices() {
        return await devicesCollection.deleteMany({});
    },
    _mapDbDeviceToOutputModel(device: DeviceDbType): Device {
        return {
            deviceId: device.deviceId,
            title: device.title,
            lastActiveDate: device.lastActiveDate,
            ip: device.ip
        };
    }
};
