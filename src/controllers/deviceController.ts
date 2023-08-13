import {DeviceService} from '../domain/deviceService';
import {Request, Response} from 'express';
import {JwtService} from '../domain/jwtService';
import {inject, injectable} from 'inversify';

@injectable()
export class DeviceController {
    constructor(
        @inject(DeviceService) protected deviceService: DeviceService,
        @inject(JwtService) protected jwtService: JwtService
    ) {
    }

    async getAllDevicesByUserId(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const userId = await this.jwtService.getUserIdByToken(refreshToken);
        if (userId) {
            const devices = await this.deviceService.getAllDevicesByUserId(userId);
            return res.status(200).json(devices);
        } else {
            return res.sendStatus(401);
        }
    }

    async deleteAllOtherDevices(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const payload = await this.jwtService.getTokenPayload(refreshToken);

        if (payload) {
            const isDeleted = await this.deviceService.deleteAllOtherDevices(payload.userId, payload.deviceId!);
            return isDeleted ? res.sendStatus(204) : res.sendStatus(500);
        } else {
            return res.sendStatus(401);
        }
    }

    async deleteDeviceById(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const payload = await this.jwtService.getTokenPayload(refreshToken);

        if (payload) {
            const device = await this.deviceService.getDeviceById(req.params.deviceId);
            if (!device) return res.sendStatus(404);
            if (device.userId !== payload.userId) return res.sendStatus(403);
            const isDeleted = await this.deviceService.deleteDeviceById(payload.userId, req.params.deviceId);
            return isDeleted ? res.sendStatus(204) : res.sendStatus(500);
        } else {
            return res.sendStatus(401);
        }
    }
}
