import {NextFunction,Request,Response} from 'express';

export function checkAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [login, password] = credentials.split(':');

    if (login !== 'admin' || password !== 'qwerty') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    return next();
}
