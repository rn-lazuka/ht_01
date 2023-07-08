import mongoose from 'mongoose';
import {DeviceType} from '../types';

export const deviceSchema = new mongoose.Schema<DeviceType>({
    ip: String,
    title: String,
    lastActiveDate: String,
    deviceId: String,
    expDate: String,
    userId: String
});

deviceSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

deviceSchema.set('toJSON', { virtuals: true })

export const Device = mongoose.model('devices', deviceSchema);
