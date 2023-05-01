import {Request, Response, Router} from 'express';
import {authValidations} from '../validators/auth';
import {inputValidationMiddleware} from '../utils/validateErrors';
import {userService} from '../domain/userService';

export const authRouter = Router();
authRouter.post('/login', authValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    console.log({loginOrEmail:req.body.loginOrEmail});
    const data = await userService.getUserByLogin(req.body.loginOrEmail);
    let result = false;
    if (data) {
        console.log({password:req.body.password});
        result = await userService.checkUserPass({
            passwordSalt: data.passwordSalt!,
            passwordHash: data.passwordHash!,
            password: req.body.password
        });
    }
    if (!data || !result) return res.sendStatus(401);
    return res.sendStatus(204);
});
