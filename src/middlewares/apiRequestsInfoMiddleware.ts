import {NextFunction, Request, Response} from 'express';
import {ApiRequestInfo} from '../types';
import {apiRequestInfoService} from '../domain/apiRequestInfoService';

export const apiRequestsInfoMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.socket.remoteAddress;
    if (ip) {
        const apiRequestInfo: ApiRequestInfo = {
            IP: ip,
            URL: req.originalUrl,
            date: new Date()
        };
        try {
             await apiRequestInfoService.saveRequestInfo(apiRequestInfo);
        } catch (e) {
            console.error(e);
        }
    }
    next();
};
