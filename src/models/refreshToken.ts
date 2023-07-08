import mongoose from 'mongoose';
import { RefreshTokenType } from '../types';

export const refreshTokenSchema = new mongoose.Schema<RefreshTokenType>({
    refreshToken: String
});

export const RefreshToken = mongoose.model('refreshTokens', refreshTokenSchema);
