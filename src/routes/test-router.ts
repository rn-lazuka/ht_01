import {Router} from 'express';
import {container} from '../compositionRoot';
import {TestingController} from '../controllers/testingController';

export const testRouter = Router();
const testingController = container.resolve(TestingController);

testRouter.delete('/',  testingController.deleteAllData.bind(testingController));
