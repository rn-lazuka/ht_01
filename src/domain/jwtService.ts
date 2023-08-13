import jwt, {JwtPayload} from 'jsonwebtoken';
import {JWT_SECRET} from '../settings';
import {AuthRepository} from '../repositories/authRepository';
import {UserRepository} from '../repositories/userRepository';
import {inject, injectable} from 'inversify';

@injectable()
export class JwtService {
    constructor(
        @inject(AuthRepository) protected authRepository: AuthRepository,
        @inject(UserRepository) protected userRepository: UserRepository
    ) {
    }

    createJWT(userId: string, expirationTime: string, deviceId?: string) {
        return jwt.sign({userId, deviceId}, JWT_SECRET, {expiresIn: expirationTime});
    }

    async getUserIdByToken(token: string) {
        try {
            const result = jwt.verify(token, JWT_SECRET) as JwtPayload;
            return result.userId;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async getTokenPayload(token: string) {
        try {
            return jwt.verify(token, JWT_SECRET) as JwtPayload;
        } catch (e) {
            return null;
        }
    }

    async deactivateRefreshToken(refreshToken: string) {
        try {
            return await this.authRepository.deactivateRefreshToken({refreshToken});
        } catch (e) {
            return null;
        }
    }

    async checkIsTokenValid(refreshToken: string) {
        try {
            const jwtPayload = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload;
            const user = await this.userRepository.findUserById(jwtPayload.userId); //TODO лучше использовать репозиторий напрямую или сервис?
            const isTokenActive = await this.authRepository.isRefreshTokenActive(refreshToken);
            if (!user || !isTokenActive) return null;
            return jwtPayload;
        } catch (e) {
            return null;
        }
    }

    async changeTokensByRefreshToken(refreshToken: string) {
        try {
            const jwtPayload = await this.checkIsTokenValid(refreshToken);
            if (!jwtPayload) return null;
            await this.deactivateRefreshToken(refreshToken);
            const accessToken = this.createJWT(jwtPayload.userId!, '30m');
            const newRefreshToken = this.createJWT(jwtPayload.userId, '24h', jwtPayload.deviceId);
            return {accessToken, refreshToken: newRefreshToken};
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
