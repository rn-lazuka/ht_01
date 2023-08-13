import {AuthService} from '../domain/authService';
import {JwtService} from '../domain/jwtService';
import {Request, Response} from 'express';
import {DeviceService} from '../domain/deviceService';
import {UserService} from '../domain/userService';
import {inject, injectable} from 'inversify';

@injectable()
export class AuthController {
    constructor(
        @inject(AuthService) protected authService: AuthService,
        @inject(JwtService) protected jwtService: JwtService,
        @inject(DeviceService) protected deviceService: DeviceService,
        @inject(UserService) protected userService: UserService
    ) {
    }

    async loginUser(req: Request, res: Response) {
        const result = await this.authService.loginUser(req.body.loginOrEmail, req.body.password);
        if (result) {
            await this.deviceService.addDevice(req.socket.remoteAddress || 'unknown', req.headers['user-agent'] || 'unknown', result.userId, result.refreshToken);
            res.cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true});
            return res.status(200).json({accessToken: result.accessToken});
        }
        return res.sendStatus(401);
    }

    async deactivateRefreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.sendStatus(401);
        }
        const isTokenValid = await this.jwtService.checkIsTokenValid(refreshToken);
        if (isTokenValid) {
            const tokenPayload = await this.jwtService.getTokenPayload(refreshToken);
            if (tokenPayload) {
                const isDeviceDeleted = await this.deviceService.deleteDeviceById(tokenPayload.userId, tokenPayload.deviceId!);
                if (isDeviceDeleted) {
                    const result = await this.jwtService.deactivateRefreshToken(refreshToken);
                    return result ? res.sendStatus(204) : res.sendStatus(401);
                }
            }
            return res.sendStatus(500);
        }
        return res.sendStatus(401);
    }

    async updateDeviceInfo(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.sendStatus(401);
        }
        const result = await this.jwtService.changeTokensByRefreshToken(refreshToken);
        if (result) {
            const newTokenPayload = await this.jwtService.getTokenPayload(result?.refreshToken);
            if (newTokenPayload) {
                const isUpdated = await this.deviceService.updateDeviceInfo(newTokenPayload);
                if (isUpdated) {
                    res.cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true});
                    return res.status(200).json({accessToken: result.accessToken});
                }
            }
            return res.sendStatus(500);
        }
        return res.sendStatus(401);
    }

    async getMyInfo(req: Request, res: Response) {
        if (req.user) {
            return res.json({email: req.user.email, userId: req.user.id, login: req.user.login});
        }
        return res.sendStatus(401);
    }

    async registerUser(req: Request, res: Response) {
        const result = await this.userService.createUser({
            email: req.body.email,
            login: req.body.login,
            password: req.body.password
        });
        return result ? res.sendStatus(204) : res.sendStatus(400);
    }

    async confirmEmail(req: Request, res: Response) {
        const result = await this.authService.confirmEmail(req.body.code);
        return result ? res.sendStatus(204) : res.sendStatus(400);
    }

    async resendEmailConfirmation(req: Request, res: Response) {
        const result = await this.authService.resendEmailConfirmation(req.body.email);
        return result ? res.sendStatus(204) : res.sendStatus(400);
    }

    async passwordRecovery(req: Request, res: Response) {
        await this.authService.passwordRecovery(req.body.email);
        return res.sendStatus(204);
    }

    async confirmNewPassword(req: Request, res: Response) {
        const result = await this.userService.confirmNewPassword(req.body.recoveryCode, req.body.newPassword);
        return result ? res.sendStatus(204) : res.send('RecoveryCode is incorrect or expired').status(400);
    }
}
