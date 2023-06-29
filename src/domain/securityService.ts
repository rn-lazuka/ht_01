import {devicesRepository} from '../repositories/devicesRepository';
import {ObjectId} from 'mongodb';

export const securityService = {
    async getDeviceById(deviceId: string) {
        return devicesRepository.getDeviceById(deviceId);
    },
    async getAllDevicesByUserId(id: string) {
        return devicesRepository.getAllDevicesByUserId(id);
    },
    async deleteAllOtherDevices(userId: string, deviceId: string) {
        return await devicesRepository.deleteAllOtherDevices(userId,deviceId);
    },
    async deleteDeviceById(userId: string, deviceId: string) {
        return await devicesRepository.deleteDeviceById(userId, deviceId);
    },
};
