import {NextFunction, Request, Response} from 'express';
import { apiRequestInfoService } from '../compositionRoot';
import {ApiRequestInfo} from '../types';

export const apiRequestsRateMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.socket.remoteAddress;
    if (ip) {
        const requestInfoFilter: ApiRequestInfo = {
            IP: ip,
            URL: req.originalUrl,
            date: new Date(Date.now() - 10000) // отнимаю 10 сек.
        };
        try {
            const documentsInfoRequests = await apiRequestInfoService.getRequestsInfoByFilter(requestInfoFilter);
            if (documentsInfoRequests.length > 5) {

                return res.status(429).send('More than 5 attempts from one IP-address during 10 seconds');
            }
        } catch (e) {
            return res.sendStatus(500);
        }
    }
    return next();
};
