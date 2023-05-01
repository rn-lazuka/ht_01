import {Request, Response, Router} from 'express';
import {checkAuth} from '../utils';
import {inputValidationMiddleware} from '../utils/validateErrors';
import {userService} from '../domain/userService';
import {userValidations} from '../validators/users';

export const userRouter = Router();

userRouter.get('/', checkAuth, inputValidationMiddleware, async (req, res) => {
    const page = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
    const searchLoginTerm = req.query.searchLoginTerm ? req.query.searchLoginTerm.toString() : null;
    const searchEmailTerm = req.query.searchEmailTerm ? req.query.searchEmailTerm.toString() : null;
    const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt';
    const sortDirection = req.query.sortDirection === 'asc' ? 'asc' : 'desc';
    const users = await userService.getUsers({page, pageSize}, {searchLoginTerm, searchEmailTerm}, {
        sortBy,
        sortDirection
    });
    res.json(users);
});

userRouter.post('/', checkAuth, userValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
});
userRouter.delete('/:id', checkAuth, inputValidationMiddleware, async (req: Request, res: Response) => {
    const isUserDeleted = await userService.deleteUser(req.params.id);
    isUserDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
