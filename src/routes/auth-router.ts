import {Request, Response, Router} from 'express';
import {
    authValidations,
    refreshValidation,
    registrationConfirmationValidations,
    registrationValidations,
    resendingEmailValidations
} from '../validators/auth';
import {inputValidationMiddleware} from '../utils/validateErrors';
import {userService} from '../domain/userService';
import {jwtService} from '../domain/jwtService';
import {authMiddleware} from '../middlewares/authMiddleware';
import {authService} from '../domain/authService';

export const authRouter = Router();
authRouter.post('/login', authValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const result = await authService.loginUser(req.body.loginOrEmail, req.body.password);
    if (result) {
        debugger
        res.cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true});
        return res.status(200).json({accessToken: result.accessToken});
    }
    return res.sendStatus(401);
});
authRouter.post('/logout', authValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    const isTokenValid = await jwtService.checkIsTokenValid(refreshToken)
    if(isTokenValid) {
        const result = await jwtService.deactivateRefreshToken(refreshToken)
        return result ? res.sendStatus(204) : res.sendStatus(401)
    }
    return res.sendStatus(401)
});

authRouter.post('/refresh-token', refreshValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    const result = await jwtService.changeTokensByRefreshToken(refreshToken);
    if (result) {
        res.cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true});
        return res.status(200).json({accessToken: result.accessToken});
    }
    return res.sendStatus(401);
});

authRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {
    if (req.user) {
        return res.json({email: req.user.email, userId: req.user.id, login: req.user.login});
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
    const result = await authService.resendEmailConfirmation(req.body.email);
    return result ? res.sendStatus(204) : res.sendStatus(400);
});
