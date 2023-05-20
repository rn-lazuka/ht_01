import {ObjectId} from 'mongodb';

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
export interface UserEntity {
    login: string;
    email: string;
    password?: string;
    createdAt: string;
    passwordHash?: string;
    passwordSalt?: string;
    emailConfirmation?:EmailConfirmation
}

export interface User extends UserEntity {
    id: string;
}

export interface UserDBType extends UserEntity {
    _id: ObjectId;
}
