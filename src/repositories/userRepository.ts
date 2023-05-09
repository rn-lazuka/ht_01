import {Pagination, Sorting, User, UserEntity, UserDBType} from '../types';
import {usersCollection} from '../db';
import {ObjectId} from 'mongodb';

export interface UserSearchTerm {
    searchLoginTerm: string | null;
    searchEmailTerm: string | null;
}

export const userRepository = {
    async getUsers(pagination: Pagination, sorting: Sorting, searchTerm: UserSearchTerm) {
        const {pageSize, page} = pagination;
        const filter: any = {};
        if (searchTerm.searchEmailTerm || searchTerm.searchLoginTerm) {
            filter.$or = [];
            if (searchTerm.searchEmailTerm) {
                filter.$or.push({email: {$regex: searchTerm.searchEmailTerm, $options: 'i'}});
            }
            if (searchTerm.searchLoginTerm) {
                filter.$or.push({login: {$regex: searchTerm.searchLoginTerm, $options: 'i'}});
            }
        }

        const sortOptions: any = {};
        sortOptions[sorting.sortBy] = sorting.sortDirection === 'asc' ? 1 : -1;
        const totalCount = await usersCollection.countDocuments(filter);
        const pagesCount = Math.ceil(totalCount / pageSize);
        const skip = (page - 1) * pageSize;
        const users = await usersCollection.find(filter).sort(sortOptions).limit(pageSize).skip(skip).toArray();
        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: users.map((user) => this._mapDbUserToOutputModel(user))
        };
    },
    async findUserById(id: ObjectId) {
        return await usersCollection.findOne({_id: id});
    },
    async createUser(user: UserEntity) {
        const result = await usersCollection.insertOne(user);
        const UserDBType: UserDBType = {
            ...user, _id: result.insertedId
        };
        return this._mapDbUserToOutputModel(UserDBType);
    },
    async deleteUser(id: string) {
        try {
            const result = await usersCollection.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (e) {
            return null;
        }
    },
    async getUserByLoginAndPass(loginOrEmail: string): Promise<User | null> {
        try {
            const result = await usersCollection.findOne({login: loginOrEmail});
            return result ? {
                id: result._id.toString(),
                createdAt: result.createdAt,
                login: result.login,
                email: result.email,
                passwordHash: result.passwordHash,
                passwordSalt: result.passwordSalt
            } : null;
        } catch (e) {
            return null;
        }
    },
    async clearAllUsers() {
        await usersCollection.deleteMany({});
    },
    _mapDbUserToOutputModel(user: UserDBType): User {
        return {
            id: user._id.toString(),
            createdAt: user.createdAt,
            login: user.login,
            email: user.email
        };
    }
};
