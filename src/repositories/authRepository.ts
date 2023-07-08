import {RefreshToken} from '../models/refreshToken';
import {RefreshTokenType} from '../types';

export const authRepository = {
    async deactivateRefreshToken(refreshObject: RefreshTokenType) {
        let newToken = new RefreshToken(refreshObject);
        newToken = await newToken.save();
        return newToken;
    },

    async isRefreshTokenActive(refreshToken: string): Promise<boolean> {
        const result = await RefreshToken.findOne({refreshToken: refreshToken});
        return !result;
    }
};
