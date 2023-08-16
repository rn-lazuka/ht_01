import {RefreshToken} from '../models/refreshToken';
import {RefreshTokenType} from '../types';
import {injectable} from 'inversify';

@injectable()
export class AuthRepository {
    async deactivateRefreshToken(refreshObject: RefreshTokenType) {
        let newToken = new RefreshToken(refreshObject);
        newToken = await newToken.save();
        return newToken;
    }

    async isRefreshTokenActive(refreshToken: string): Promise<boolean> {
        const result = await RefreshToken.findOne({refreshToken: refreshToken});
        return !result;
    }
}
