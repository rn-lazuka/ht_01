import {ApiRequestInfo} from '../types';
import {ApiRequest} from '../models/apiRequests';


export const apiRequestInfoRepository = {
    async saveRequestInfo(apiRequest: ApiRequestInfo) {
        let newRequest = new ApiRequest(apiRequest);
        newRequest = await newRequest.save()
        return newRequest
    },
    async getRequestsInfoByFilter({URL, IP, date}: ApiRequestInfo) {
        const result = await ApiRequest.find({IP, URL, date: {$gte: date}})
        return result
    },
    async clearRequestsInfo() {
        const result = await ApiRequest.deleteMany({})
        return result.deletedCount > 0
    }
};
