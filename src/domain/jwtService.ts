import jwt, {JwtPayload} from 'jsonwebtoken';
import {JWT_SECRET} from '../settings';
import {userService} from './userService';
import {authRepository} from '../repositories/authRepository';

export const jwtService = {
    createJWT(userId: string, expirationTime: string, deviceId?: string) {
        return jwt.sign({userId, deviceId}, JWT_SECRET, {expiresIn: expirationTime});
    },
    async getUserIdByToken(token: string) {
        try {
            const result = jwt.verify(token, JWT_SECRET) as JwtPayload;
            return result.userId;
        } catch (e) {
            return null;
        }
    },
    async getTokenPayload(token: string) {
        try {
            return jwt.verify(token, JWT_SECRET) as JwtPayload;
        } catch (e) {
            return null;
        }
    },
    async deactivateRefreshToken(refreshToken: string) {
        try {
            return await authRepository.deactivateRefreshToken({refreshToken});
        } catch (e) {
            return null;
        }
    },
    async checkIsTokenValid(refreshToken: string) {
        try {
            const jwtPayload = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload;
            const user = await userService.findUserById(jwtPayload.userId);
            const isTokenActive = await authRepository.isRefreshTokenActive(refreshToken);
            if (!user || !isTokenActive) return null;
            return jwtPayload;
        } catch (e) {
            console.log(e);
            return null;
        }
    },
    async changeTokensByRefreshToken(refreshToken: string) {
        try {
            const jwtPayload = await this.checkIsTokenValid(refreshToken);
            if (!jwtPayload) return null;
            await this.deactivateRefreshToken(refreshToken);
            const accessToken = jwtService.createJWT(jwtPayload.userId!, '10s');
            const newRefreshToken = jwtService.createJWT(jwtPayload.userId, '20s', jwtPayload.deviceId);
            return {accessToken, refreshToken: newRefreshToken};
        } catch (error) {
            console.error(error);
            return null;
        }
    }
};
