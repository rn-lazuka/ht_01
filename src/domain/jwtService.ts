import {User} from '../types';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {JWT_SECRET} from '../settings';
import {ObjectId} from 'mongodb';
import {userService} from './userService';
import {authRepository} from '../repositories/authRepository';

export const jwtService = {
    createJWT(user: User, expirationTime: string) {
        return jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: expirationTime});
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, JWT_SECRET);
            return new ObjectId(result.userId);
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
            const user = await userService.findUserById(new ObjectId(jwtPayload.userId));
            const isTokenActive = await authRepository.isRefreshTokenActive(refreshToken);
            if (!user || !isTokenActive) return null;
            return user;
        } catch (e) {
            console.log(e);
            return null;
        }
    },
    async changeTokensByRefreshToken(refreshToken: string) {
        try {
            const user = await this.checkIsTokenValid(refreshToken);
            if (!user) return null;
            await this.deactivateRefreshToken(refreshToken);
            const accessToken = jwtService.createJWT(user, '10s');
            const newRefreshToken = jwtService.createJWT(user, '20s');
            return {accessToken, refreshToken: newRefreshToken};
        } catch (error) {
            console.error(error);
            return null;
        }
    }
};
