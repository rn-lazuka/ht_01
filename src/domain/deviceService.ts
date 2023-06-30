import {devicesRepository} from '../repositories/devicesRepository';
import {jwtService} from './jwtService';
import {DeviceDbType} from '../types';

export const deviceService = {
    async addDevice(ip: string, title: string, userId: string, refreshToken: string) {
        const tokenPayload = await jwtService.getTokenPayload(refreshToken);
        if (tokenPayload) {
            const deviceInfo: Omit<DeviceDbType, '_id'> = {
                ip,
                title,
                userId,
                deviceId: tokenPayload.deviceId!,
                lastActiveDate: new Date(tokenPayload.iat!).toISOString(),
                expDate: new Date(tokenPayload.exp!).toISOString()
            };
            return devicesRepository.addDevice(deviceInfo);
        }
        return null;
    },
    async getDeviceById(deviceId: string) {
        return devicesRepository.getDeviceById(deviceId);
    },
    async getAllDevicesByUserId(id: string) {
        return devicesRepository.getAllDevicesByUserId(id);
    },
    async deleteAllOtherDevices(userId: string, deviceId: string) {
        return await devicesRepository.deleteAllOtherDevices(userId, deviceId);
    },
    async deleteDeviceById(userId: string, deviceId: string) {
        return await devicesRepository.deleteDeviceById(userId, deviceId);
    },
};
