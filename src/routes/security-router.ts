import {Request, Response, Router} from 'express';
import {securityService} from '../domain/securityService';
import {jwtService} from '../domain/jwtService';

export const securityRouter = Router();
securityRouter.get('/devices', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const userId = await jwtService.getUserIdByToken(refreshToken);
    if (userId) {
        const devices = await securityService.getAllDevicesByUserId(userId);
        return res.status(200).json(devices);
    } else {
        return res.sendStatus(401);
    }
});

securityRouter.delete('/devices', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const payload = await jwtService.getTokenPayload(refreshToken);

    if (payload) {
        const isDeleted = await securityService.deleteAllOtherDevices(payload.userId, payload.deviceId!);
        return isDeleted ? res.sendStatus(204) : res.sendStatus(500);
    } else {
        return res.sendStatus(401);
    }
});

securityRouter.delete('/devices/:deviceId', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const payload = await jwtService.getTokenPayload(refreshToken);

    if (payload) {
        const device = await securityService.getDeviceById(req.params.deviceId)
        if(!device) return res.sendStatus(404)
        if(device.userId !== payload.userId) return res.sendStatus(403)
        const isDeleted = await securityService.deleteDeviceById(payload.userId, req.params.deviceId);
        return isDeleted ? res.sendStatus(204) : res.sendStatus(500);
    } else {
        return res.sendStatus(401);
    }
});
