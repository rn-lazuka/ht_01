import {UserEntity} from '../UserType';

declare global {
    namespace Express {
        export interface Request {
            user: UserEntity | null
        }
    }
}

declare module "jsonwebtoken" {
    export interface JwtPayload {
        userId: string
        deviceId?: string
    }
}
