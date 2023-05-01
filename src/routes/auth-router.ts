import {Request, Response, Router} from 'express';
import {authValidations} from '../validators/auth';
import {inputValidationMiddleware} from '../utils/validateErrors';

export const authRouter = Router();
authRouter.post('/login', authValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    return res.sendStatus(204)
});
