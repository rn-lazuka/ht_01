import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';
import {TestingRepository} from '../repositories/testingRepository';

@injectable()
export class TestingController {
    constructor(@inject(TestingRepository) protected testingRepository: TestingRepository) {}

    async deleteAllData(req: Request, res: Response) {
        await this.testingRepository.deleteAllData();
        return res.sendStatus(204);
    }
}

