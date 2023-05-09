import {Request, Response, Router} from 'express';
import {authValidations} from '../validators/auth';
import {inputValidationMiddleware} from '../utils/validateErrors';
import {userService} from '../domain/userService';
import {jwtService} from '../application/jwtService';
import {authMiddleware} from '../middlewares/authMiddleware';

export const authRouter = Router();
authRouter.post('/login', authValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const user = await userService.checkCredentials(req.body.loginOrEmail, req.body.password);
    if (user) {
        const token = await jwtService.createJWT(user);
        return res.status(200).json({accessToken:token});
    }
    return res.sendStatus(401);
});

authRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {
    if (req.user) {
        return res.json({email: req.user.email, userId: req.user._id.toString(), login: req.user.login})
    }
    return res.sendStatus(401);
});
