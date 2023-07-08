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

export interface UserDBType extends UserEntity {
    _id: ObjectId;
}
