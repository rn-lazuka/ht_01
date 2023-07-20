import {ApiRequestInfo, ApiRequestInfoDBType} from '../types';
import {ApiRequestInfoRepository} from '../repositories/apiRequestInfoRepository';

export class ApiRequestInfoService {
    constructor(protected apiRequestInfoRepository: ApiRequestInfoRepository) {
    }

    async saveRequestInfo(requestInfo: ApiRequestInfoDBType) {
        return this.apiRequestInfoRepository.saveRequestInfo(requestInfo);
    }

    async getRequestsInfoByFilter(requestInfoFilter: ApiRequestInfo) {
        return this.apiRequestInfoRepository.getRequestsInfoByFilter(requestInfoFilter);
    }
};
