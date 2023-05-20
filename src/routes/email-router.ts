import {Request, Response, Router} from 'express';
import {authValidations} from '../validators/auth';
import {inputValidationMiddleware} from '../utils/validateErrors';
import {userService} from '../domain/userService';
import {jwtService} from '../application/jwtService';
import {authMiddleware} from '../middlewares/authMiddleware';
import {emailAdapter} from '../adapters/emailAdapter';

export const registrationRouter = Router();
registrationRouter.post('/send', inputValidationMiddleware, async (req: Request, res: Response) => {
    await emailAdapter.sendMail(req.body.email, req.body.subject, req.body.message);
});
