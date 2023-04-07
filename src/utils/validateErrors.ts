import {NextFunction,Response,Request} from 'express';
import {validationResult} from 'express-validator';

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsMessages = errors.array({onlyFirstError:true}).map(error => ({
            message: error.msg,
            field: error.param,
        }));
        return res.status(400).json({errorsMessages});
    }else {
      return next()
    }
}
