import {NextFunction, Request, Response} from 'express';
import {ApiRequestInfoDBType} from '../types';
import {ObjectId} from 'mongodb';
import {container} from '../compositionRoot';
import {ApiRequestInfoService} from '../domain/apiRequestInfoService';


export const apiRequestsInfoMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.socket.remoteAddress;
    const apiRequestInfoService = container.resolve(ApiRequestInfoService);
    if (ip) {
        const apiRequestInfo = new ApiRequestInfoDBType(
            new ObjectId(),
            ip,
            req.originalUrl,
            new Date()
        );
        try {
            await apiRequestInfoService.saveRequestInfo(apiRequestInfo);
        } catch (e) {
            console.error(e);
        }
    }
    next();
};
