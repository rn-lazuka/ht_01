import {ObjectId} from 'mongodb';
import {v4 as uuid} from 'uuid';
import {add} from 'date-fns';

export interface NewUserData {
    login: string;
    email: string;
    password: string;
}

export interface EmailConfirmation {
    confirmationCode?: string;
    expirationDate?: Date;
    isConfirmed: boolean;
}

export interface RecoveryData {
    recoveryCode: string;
    isValid: boolean;
    expirationDate: Date;
}

export interface UserEntity {
    id?: string;
    login: string;
    email: string;
    createdAt: string;
    passwordHash?: string;
    passwordSalt?: string;
    emailConfirmation?: EmailConfirmation;
    recoveryData?: RecoveryData;
}

// export interface UserDBType extends UserEntity {
//     _id: ObjectId;
// }

export class UserDBType {
    constructor(public _id: ObjectId,
                public login: string,
                public email: string,
                public createdAt: string,
                public passwordHash?: string,
                public passwordSalt?: string,
                public emailConfirmation?: EmailConfirmation,
                public recoveryData?: RecoveryData) {
    }
}
