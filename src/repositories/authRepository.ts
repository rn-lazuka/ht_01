import {refreshTokensCollection} from '../db';
import { RefreshToken } from '../types/Token';

export const authRepository = {
    async deactivateRefreshToken(refreshObject: RefreshToken) {
        return await refreshTokensCollection.insertOne(refreshObject);
    },

    async isRefreshTokenActive(refreshToken: string): Promise<boolean> {
        const token = await refreshTokensCollection.findOne({refreshToken: refreshToken});
        return !token;
    }
};
