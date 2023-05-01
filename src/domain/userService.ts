import {Pagination, Sorting, UserEntity} from '../types';
import bcrypt from 'bcrypt';
import {userRepository, UserSearchTerm} from '../repositories/userRepository';

interface CheckPassProps {
    passwordHash: string;
    passwordSalt: string;
    password: string;
}

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
    async getUserByLogin(loginOrEmail: string) {
        return await userRepository.getUserByLoginAndPass(loginOrEmail);
    },
    async checkUserPass({passwordSalt,passwordHash,password}: CheckPassProps) {
        const hash = await bcrypt.hash(password, passwordSalt);
        return hash === passwordHash;
    },
    deleteUser(id: string) {
        return userRepository.deleteUser(id);
    }
};
