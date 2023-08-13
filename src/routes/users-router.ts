import {Router} from 'express';
import {checkAuth, inputValidationMiddleware} from '../utils';
import {userValidations} from '../validators/users';
import {container} from '../compositionRoot';
import {UserController} from '../controllers/userController';

export const userRouter = Router();
const userController = container.resolve(UserController);


userRouter.get('/', checkAuth, inputValidationMiddleware, userController.getUsers.bind(userController));
userRouter.post('/', checkAuth, userValidations, inputValidationMiddleware, userController.createUserByAdmin.bind(userController));
userRouter.delete('/:id', checkAuth, inputValidationMiddleware, userController.deleteUser.bind(userController));
