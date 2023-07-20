import {Router} from 'express';
import {deviceController} from '../compositionRoot';

export const securityRouter = Router();

securityRouter.get('/devices', deviceController.getAllDevicesByUserId.bind(deviceController));
securityRouter.delete('/devices', deviceController.deleteAllOtherDevices.bind(deviceController));
securityRouter.delete('/devices/:deviceId', deviceController.deleteDeviceById.bind(deviceController));
