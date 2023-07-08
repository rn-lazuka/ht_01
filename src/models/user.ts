import mongoose from 'mongoose';
import {UserDBType} from '../types';

export const userSchema = new mongoose.Schema<UserDBType>({
    login: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true},
    passwordHash: String,
    passwordSalt: String,
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: Date,
        isConfirmed: Boolean
    },
    recoveryData: {
        recoveryCode: String,
        expirationDate: Date,
        isValid: Boolean
    }
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

userSchema.set('toJSON', { virtuals: true })

export const User = mongoose.model('user', userSchema)
