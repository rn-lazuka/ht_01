import {NextFunction, Request, Response} from 'express';
import {ObjectId} from 'mongodb';
import {jwtService, userService} from '../compositionRoot';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.sendStatus(401);
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = await jwtService.getUserIdByToken(token); //TODO можно ли использовать сервисы напрямую в мидлварах
    if (userId) {
        req.user = await userService.findUserById(userId);
        return next();
    }
    return res.sendStatus(401);
};

export const validateAccessTokenGetRequests = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return next();
    }

    const token = req.headers.authorization.split(' ')[1];
    const userId = await jwtService.getUserIdByToken(token);

    if (userId) {
        req.user = await userService.findUserById(userId);
        return next();
    }
    return res.sendStatus(401);
};
