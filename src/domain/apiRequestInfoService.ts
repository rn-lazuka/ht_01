import {ApiRequestInfo} from '../types';
import {apiRequestInfoRepository} from '../repositories/apiRequestInfoRepository';

export const apiRequestInfoService = {
    async saveRequestInfo(requestInfo: ApiRequestInfo) {
        return apiRequestInfoRepository.saveRequestInfo(requestInfo);
    },
    async getRequestsInfoByFilter(requestInfoFilter: ApiRequestInfo) {
        return apiRequestInfoRepository.getRequestsInfoByFilter(requestInfoFilter);
    },
};
