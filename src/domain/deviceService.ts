import {DeviceRepository} from '../repositories/devicesRepository';
import {JwtService} from './jwtService';
import {DeviceDBType} from '../types';
import {JwtPayload} from 'jsonwebtoken';
import {ObjectId} from 'mongodb';

export class DeviceService  {
    constructor(protected deviceRepository: DeviceRepository, protected jwtService: JwtService) {
    }
    async addDevice(ip: string, title: string, userId: string, refreshToken: string) {
        const tokenPayload = await this.jwtService.getTokenPayload(refreshToken);
        if (tokenPayload) {
            const deviceInfo = new DeviceDBType(new ObjectId(), ip, title, new Date(tokenPayload.iat!).toISOString(), tokenPayload.deviceId!, new Date(tokenPayload.exp!).toISOString(), userId);
            return await this.deviceRepository.addDevice(deviceInfo);
        }
        return null;
    }
    async updateDeviceInfo(tokenPayload: JwtPayload) {
        return await this.deviceRepository.updateDeviceInfo(tokenPayload);
    }
    async getDeviceById(deviceId: string) {
        return await this.deviceRepository.getDeviceById(deviceId);
    }
    async getAllDevicesByUserId(id: string) {
        return await this.deviceRepository.getAllDevicesByUserId(id);
    }
    async deleteAllOtherDevices(userId: string, deviceId: string) {
        return await this.deviceRepository.deleteAllOtherDevices(userId, deviceId);
    }
    async deleteDeviceById(userId: string, deviceId: string) {
        return await this.deviceRepository.deleteDeviceById(userId, deviceId);
    }
}
