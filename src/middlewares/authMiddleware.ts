import {NextFunction, Request, Response} from 'express';
import {jwtService} from '../application/jwtService';
import {userService} from '../domain/userService';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.sendStatus(401);
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = await jwtService.getUserIdByToken(token);
    if (userId) {
        req.user = await userService.findUserById(userId);
        return next();
    }
    return res.sendStatus(401)
};
