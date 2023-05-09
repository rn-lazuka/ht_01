import {User} from '../types';
import jwt from 'jsonwebtoken';
import {settings} from '../settings';
import {ObjectId} from 'mongodb';

export const jwtService = {
    async createJWT(user: User) {
        return jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: '1h'});
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET);
            return new ObjectId(result.userId);
        } catch (e) {
            return null;
        }
    }
};
