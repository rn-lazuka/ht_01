import {Request, Response, Router} from 'express';
import {
    authValidations,
    registrationConfirmationValidations,
    registrationValidations,
    resendingEmailValidations
} from '../validators/auth';
import {inputValidationMiddleware} from '../utils/validateErrors';
import {userService} from '../domain/userService';
import {jwtService} from '../domain/jwtService';
import {authMiddleware} from '../middlewares/authMiddleware';
import {authService} from '../domain/authService';
import {deviceService} from '../domain/deviceService';
import {apiRequestsInfoMiddleware} from '../middlewares/apiRequestsInfoMiddleware';
import {apiRequestsRateMiddleware} from '../middlewares/apiRequestsRateMiddleware';

export const authRouter = Router();
authRouter.post('/login', apiRequestsInfoMiddleware, apiRequestsRateMiddleware, authValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const result = await authService.loginUser(req.body.loginOrEmail, req.body.password);
    if (result) {
        await deviceService.addDevice(req.socket.remoteAddress || 'unknown', req.headers['user-agent'] || 'unknown', result.userId, result.refreshToken);
        res.cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true});
        return res.status(200).json({accessToken: result.accessToken});
    }
    return res.sendStatus(401);
});
authRouter.post('/logout', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.sendStatus(401);
    }
    const isTokenValid = await jwtService.checkIsTokenValid(refreshToken);
    if (isTokenValid) {
        const tokenPayload = await jwtService.getTokenPayload(refreshToken);
        if (tokenPayload) {
            const isDeviceDeleted = await deviceService.deleteDeviceById(tokenPayload.userId, tokenPayload.deviceId!);
            if (isDeviceDeleted) {
                const result = await jwtService.deactivateRefreshToken(refreshToken);
                return result ? res.sendStatus(204) : res.sendStatus(401);
            }
        }
        return res.sendStatus(500);
    }
    return res.sendStatus(401);
});

authRouter.post('/refresh-token', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    const result = await jwtService.changeTokensByRefreshToken(refreshToken);
    if (result) {
        const newTokenPayload = await jwtService.getTokenPayload(result?.refreshToken);
        if (newTokenPayload) {
            const isUpdated = await deviceService.updateDeviceInfo(newTokenPayload);
            if (isUpdated) {
                res.cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true});
                return res.status(200).json({accessToken: result.accessToken});
            }
        }
        return res.sendStatus(500);
    }
    return res.sendStatus(401);
});

authRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {
    if (req.user) {
        return res.json({email: req.user.email, userId: req.user.id, login: req.user.login});
    }
    return res.sendStatus(401);
});

authRouter.post('/registration', apiRequestsInfoMiddleware, apiRequestsRateMiddleware, registrationValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const result = await userService.createUser({
        email: req.body.email,
        login: req.body.login,
        password: req.body.password
    });
    return result ? res.sendStatus(204) : res.sendStatus(400);
});

authRouter.post('/registration-confirmation',apiRequestsInfoMiddleware, apiRequestsRateMiddleware, registrationConfirmationValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const result = await authService.confirmEmail(req.body.code);
    return result ? res.sendStatus(204) : res.sendStatus(400);
});

authRouter.post('/registration-email-resending', apiRequestsInfoMiddleware, apiRequestsRateMiddleware, resendingEmailValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const result = await authService.resendEmailConfirmation(req.body.email);
    return result ? res.sendStatus(204) : res.sendStatus(400);
});
