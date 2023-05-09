import {User} from '../types';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../settings';
import {ObjectId} from 'mongodb';

export const jwtService = {
    async createJWT(user: User) {
        return jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: '1h'});
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, JWT_SECRET);
            return new ObjectId(result.userId);
        } catch (e) {
            return null;
        }
    }
};
