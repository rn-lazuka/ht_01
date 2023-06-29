import {User} from '../User';

declare global {
    namespace Express {
        export interface Request {
            user: User | null
        }
    }
}

declare module "jsonwebtoken" {
    export interface JwtPayload {
        userId: string
        deviceId?: string
    }
}
