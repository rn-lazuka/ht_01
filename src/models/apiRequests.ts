import mongoose from 'mongoose';
import {ApiRequestInfo} from '../types';

export const apiRequestsSchema = new mongoose.Schema<ApiRequestInfo>({
    IP: String,
    URL: String,
    date: Date
});

export const ApiRequest = mongoose.model('apiRequests', apiRequestsSchema);
