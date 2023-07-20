import mongoose from 'mongoose';
import {ApiRequestInfoDBType} from '../types';

export const apiRequestsSchema = new mongoose.Schema<ApiRequestInfoDBType>({
    IP: String,
    URL: String,
    date: Date
});

export const ApiRequest = mongoose.model('apiRequests', apiRequestsSchema);
