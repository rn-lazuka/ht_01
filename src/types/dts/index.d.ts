import {UserDBType} from '../User';

declare global {
    namespace Express {
        export interface Request {
            user: UserDBType | null
        }
    }
}
