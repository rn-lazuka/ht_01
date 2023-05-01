import {Request, Response, Router} from 'express';
import {userService} from '../domain/userService';
import {authValidations} from '../validators/auth';
import {inputValidationMiddleware} from '../utils/validateErrors';

export const authRouter = Router();
authRouter.post('/', authValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
});
