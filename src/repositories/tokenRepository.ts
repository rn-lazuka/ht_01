
export const tokenRepository = {
    async checkIsRefreshTokenValid(refreshToken: string) {
        const result = await tokenCollection.findOne({refreshToken});
        const UserDBType: UserDBType = {
            ...user, _id: result.insertedId
        };
        return UserDBType;
    },
    async deleteUser(id: string) {
        try {
            const result = await usersCollection.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (e) {
            return null;
        }
    },
};
