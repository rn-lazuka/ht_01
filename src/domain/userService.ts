import {Pagination, Sorting, UserEntity} from '../types';
import bcrypt from 'bcrypt';
import {userRepository, UserSearchTerm} from '../repositories/userRepository';
import {ObjectId} from 'mongodb';

export const userService = {
    getUsers(pagination: Pagination, searchTerm: UserSearchTerm, sorting: Sorting) {
        return userRepository.getUsers(pagination, sorting, searchTerm);
    },
    async createUser(user: Omit<UserEntity, 'createdAt'>) {
        const passSalt = await bcrypt.genSalt(10);
        const passHash = await bcrypt.hash(user.password!, passSalt);
        const newUser: UserEntity = {
            login: user.login,
            email: user.email,
            passwordHash: passHash,
            passwordSalt: passSalt,
            createdAt: new Date().toISOString(),
        };
        return userRepository.createUser(newUser);
    },
    async findUserById(id: ObjectId) {
        return userRepository.findUserById(id)
    },
    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await userRepository.getUserByLoginAndPass(loginOrEmail);
        if (user && user?.passwordSalt) {
            const hash = await bcrypt.hash(password, user.passwordSalt);
            return hash === user?.passwordHash ? user : null
        }
        return null;
    },
    deleteUser(id: string) {
        return userRepository.deleteUser(id);
    }
};
