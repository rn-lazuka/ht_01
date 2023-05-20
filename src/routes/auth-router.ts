import {Request, Response, Router} from 'express';
import {
    authValidations,
    registrationConfirmationValidations,
    registrationValidations,
    resendingEmailValidations
} from '../validators/auth';
import {inputValidationMiddleware} from '../utils/validateErrors';
import {userService} from '../domain/userService';
import {jwtService} from '../application/jwtService';
import {authMiddleware} from '../middlewares/authMiddleware';
import {emailAdapter} from '../adapters/emailAdapter';
import {authService} from '../domain/authService';

export const authRouter = Router();
authRouter.post('/login', authValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const user = await userService.checkCredentials(req.body.loginOrEmail, req.body.password);
    if (user) {
        const token = await jwtService.createJWT(user);
        return res.status(200).json({accessToken: token});
    }
    return res.sendStatus(401);
});

authRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {
    if (req.user) {
        return res.json({email: req.user.email, userId: req.user._id.toString(), login: req.user.login});
    }
    return res.sendStatus(401);
});

authRouter.post('/registration', registrationValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const result = await userService.createUser({
        email: req.body.email,
        login: req.body.login,
        password: req.body.password
    });
    return result ? res.sendStatus(204) : res.sendStatus(400);
});

authRouter.post('/registration-confirmation', registrationConfirmationValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const result = await authService.confirmEmail(req.body.code);
    return result ? res.sendStatus(204) : res.sendStatus(400);
});

authRouter.post('/registration-email-resending', resendingEmailValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const result =  await authService.resendEmailConfirmation(req.body.email);
    return result ? res.sendStatus(204) : res.sendStatus(400);
});
