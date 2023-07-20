import {Router} from 'express';
import {inputValidationMiddleware} from '../utils/validateErrors';
import {userValidations} from '../validators/users';
import {checkAuth} from '../utils';
import {userController} from '../compositionRoot';

export const userRouter = Router();

userRouter.get('/', checkAuth, inputValidationMiddleware, userController.getUsers.bind(userController));
userRouter.post('/', checkAuth, userValidations, inputValidationMiddleware, userController.createUserByAdmin.bind(userController));
userRouter.delete('/:id', checkAuth, inputValidationMiddleware, userController.deleteUser.bind(userController));
