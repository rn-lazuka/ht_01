import {Router} from 'express';
import {container} from '../compositionRoot';
import {DeviceController} from '../controllers/deviceController';

export const securityRouter = Router();
const deviceController = container.resolve(DeviceController);

securityRouter.get('/devices', deviceController.getAllDevicesByUserId.bind(deviceController));
securityRouter.delete('/devices', deviceController.deleteAllOtherDevices.bind(deviceController));
securityRouter.delete('/devices/:deviceId', deviceController.deleteDeviceById.bind(deviceController));
