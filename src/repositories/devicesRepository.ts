import {DeviceType, DeviceDBType} from '../types';
import {JwtPayload} from 'jsonwebtoken';
import {Device} from '../models/device';
import {injectable} from 'inversify';

@injectable()
export class DeviceRepository {
    async addDevice(deviceInfo: DeviceDBType) {
        let newDevice = new Device(deviceInfo);
        newDevice = await newDevice.save();
        return this._mapDbDeviceToOutputModel(newDevice);
    }

    async updateDeviceInfo(tokenPayload: JwtPayload) {
        const result = await Device.findOneAndUpdate({deviceId: tokenPayload.deviceId}, {
            lastActiveDate: new Date(tokenPayload.iat!).toISOString(),
            expDate: new Date(tokenPayload.exp!).toISOString()
        });
        return result;
    }

    async getAllDevicesByUserId(userId: string) {
        const devices = await Device.find({userId});
        return devices.map((device) => this._mapDbDeviceToOutputModel(device));
    }

    async getDeviceById(deviceId: string) {
        const result = await Device.findOne({deviceId});
        return result;
    }

    async deleteAllOtherDevices(userId: string, deviceId: string) {
        try {
            const result = await Device.deleteMany({userId, deviceId: {$ne: deviceId}});
            return result.deletedCount > 0;
        } catch (e) {
            return false;
        }
    }

    async deleteDeviceById(userId: string, deviceId: string) {
        try {
            const result = await Device.deleteMany({deviceId, userId});
            return result.deletedCount > 0;
        } catch (e) {
            return false;
        }
    }

    async clearAllDevices() {
        const result = await Device.deleteMany({});
        return result.deletedCount > 0;
    }

    _mapDbDeviceToOutputModel(device: DeviceDBType): DeviceType {
        return {
            deviceId: device.deviceId,
            title: device.title,
            lastActiveDate: device.lastActiveDate,
            ip: device.ip
        };
    }
}
