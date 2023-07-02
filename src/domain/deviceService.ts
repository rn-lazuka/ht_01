import {devicesRepository} from '../repositories/devicesRepository';
import {jwtService} from './jwtService';
import {DeviceDbType} from '../types';
import {JwtPayload} from 'jsonwebtoken';

export const deviceService = {
    async addDevice(ip: string, title: string, userId: string, refreshToken: string) {
        const tokenPayload = await jwtService.getTokenPayload(refreshToken);
        if (tokenPayload) {
            const deviceInfo: Omit<DeviceDbType, '_id'> = {
                ip,
                title,
                userId,
                deviceId: tokenPayload.deviceId!,
                lastActiveDate: +new Date(tokenPayload.iat!),
                expDate: +new Date(tokenPayload.exp!)
            };
            return await devicesRepository.addDevice(deviceInfo);
        }
        return null;
    },
    async updateDeviceInfo(tokenPayload: JwtPayload) {
        return await devicesRepository.updateDeviceInfo(tokenPayload);
    },
    async getDeviceById(deviceId: string) {
        return await devicesRepository.getDeviceById(deviceId);
    },
    async getAllDevicesByUserId(id: string) {
        return await devicesRepository.getAllDevicesByUserId(id);
    },
    async deleteAllOtherDevices(userId: string, deviceId: string) {
        return await devicesRepository.deleteAllOtherDevices(userId, deviceId);
    },
    async deleteDeviceById(userId: string, deviceId: string) {
        return await devicesRepository.deleteDeviceById(userId, deviceId);
    },
};
