import {UserService} from '../domain/userService';
import {Request, Response} from 'express';

export class UserController {
    constructor(protected userService: UserService) {
    }

    async getUsers(req: Request, res: Response) {
        const page = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
        const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
        const searchLoginTerm = req.query.searchLoginTerm ? req.query.searchLoginTerm.toString() : null;
        const searchEmailTerm = req.query.searchEmailTerm ? req.query.searchEmailTerm.toString() : null;
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt';
        const sortDirection = req.query.sortDirection === 'asc' ? 'asc' : 'desc';
        const users = await this.userService.getUsers({page, pageSize}, {searchLoginTerm, searchEmailTerm}, {
            sortBy,
            sortDirection
        });
        res.json(users);
    }

    async createUserByAdmin(req: Request, res: Response) {
        const user = await this.userService.createUserByAdmin(req.body);
        return res.status(201).json(user);
    }

    async deleteUser(req: Request, res: Response) {
        const isUserDeleted = await this.userService.deleteUser(req.params.id);
        isUserDeleted ? res.sendStatus(204) : res.sendStatus(404);
    }
}
