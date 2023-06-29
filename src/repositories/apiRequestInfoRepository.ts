import {ApiRequestInfo} from '../types';
import {apiRequestsCollection} from '../db';

export const apiRequestInfoRepository = {
    async saveRequestInfo(apiRequest: ApiRequestInfo) {
        const result = await apiRequestsCollection.insertOne(apiRequest);
        return {...apiRequest, id: result.insertedId};
    },
    async getRequestsInfoByFilter({URL, IP, date}: ApiRequestInfo) {
        return await apiRequestsCollection.find({IP, URL, date: {$gte: date}}).toArray();
    }
};
