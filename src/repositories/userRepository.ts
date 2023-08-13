import {EmailConfirmation, Pagination, RecoveryData, Sorting, UserDBType, UserEntity} from '../types';
import {User} from '../models/user';

export interface UserSearchTerm {
    searchLoginTerm: string | null;
    searchEmailTerm: string | null;
}

export interface PassDataForUpdate {
    passwordHash?: string;
    recoveryData: {
        recoveryCode?: string;
        isValid: boolean;
    }
}

export class UserRepository {
    async getUsers(pagination: Pagination, sorting: Sorting, searchTerm: UserSearchTerm): Promise<{
        pagesCount: number;
        page: number;
        pageSize: number;
        totalCount: number;
        items: UserEntity[]
    }> {
        const {pageSize, page} = pagination;

        const filter = {} as any;

        if (searchTerm.searchEmailTerm && searchTerm.searchEmailTerm !== '') {
            filter.email = {$regex: new RegExp(searchTerm.searchEmailTerm, 'i')};
        }

        if (searchTerm.searchLoginTerm && searchTerm.searchLoginTerm !== '') {
            filter.login = {$regex: new RegExp(searchTerm.searchLoginTerm, 'i')};
        }

        const usersQuery = User.find(filter);
        const totalCount = await User.countDocuments(filter);
        const pagesCount = Math.ceil(totalCount / pageSize);

        const users = await usersQuery
            .sort({[sorting.sortBy]: sorting.sortDirection === 'asc' ? 1 : -1})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean()

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: users.map(user=>this._mapDbUserToOutputModel(user)),
        };
    }
    async findUserById(id: string): Promise<UserEntity | null> {
        const result = await User.findById(id);
        return result ? result.toObject({virtuals: true}) : null;
    }
    async updateUserConfirmStatus(id: string): Promise<UserEntity | null> {
        const result = await User.findByIdAndUpdate(id, {'emailConfirmation.isConfirmed': true}, {new: true});
        return result;
    }
    async updateUserConfirmationData(id: string, data: EmailConfirmation) {
        const result = await User.findByIdAndUpdate(id, {emailConfirmation: data}, {new: true});
        return result;
    }
    async updateUserPasswordData(id: string, data: PassDataForUpdate) {
        const result = await User.findByIdAndUpdate(id, data, {new: true});
        return result;
    }
    async updateUserRecoveryData(id: string, data: RecoveryData) {
        const result = await User.findByIdAndUpdate(id, {recoveryData: data}, {new: true});
        return result;
    }
    async findUserByConfirmationCode(code: string) {
        const result = await User.findOne({'emailConfirmation.confirmationCode': code});
        return result;
    }
    async createUser(user: UserDBType) {
        let newUser = new User(user);
        newUser = await newUser.save();
        return newUser;
    }
    async deleteUser(id: string) {
        const result = await User.findByIdAndDelete(id);
        return result;
    }
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserEntity | null> {
        const result = await User.findOne()
            .or([{login: loginOrEmail}, {email: loginOrEmail}]);
        return result;
    }
    async findUserByPasswordRecoveryCode(recoveryCode: string): Promise<UserEntity | null> {
        const result = await User.findOne({'recoveryData.recoveryCode':recoveryCode})
        return result;
    }
    async clearAllUsers() {
        await User.deleteMany({});
    }
    _mapDbUserToOutputModel(user: UserDBType): UserEntity {
        return {
            id: user._id.toString(),
            createdAt: user.createdAt,
            login: user.login,
            email: user.email
        };
    }
}
