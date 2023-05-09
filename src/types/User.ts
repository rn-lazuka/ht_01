import {ObjectId} from 'mongodb';

export interface UserEntity {
    login: string;
    email: string;
    password?: string;
    createdAt: string;
    passwordHash?: string;
    passwordSalt?: string;
}

export interface User extends UserEntity {
    id: string;
}

export interface UserDBType extends UserEntity {
    _id: ObjectId;
}
