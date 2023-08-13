import {ApiRequestInfo, ApiRequestInfoDBType} from '../types';
import {ApiRequestInfoRepository} from '../repositories/apiRequestInfoRepository';
import {inject, injectable} from 'inversify';

@injectable()
export class ApiRequestInfoService {
    constructor(@inject(ApiRequestInfoRepository) protected apiRequestInfoRepository: ApiRequestInfoRepository) {
    }

    async saveRequestInfo(requestInfo: ApiRequestInfoDBType) {
        return this.apiRequestInfoRepository.saveRequestInfo(requestInfo);
    }

    async getRequestsInfoByFilter(requestInfoFilter: ApiRequestInfo) {
        return this.apiRequestInfoRepository.getRequestsInfoByFilter(requestInfoFilter);
    }
};
