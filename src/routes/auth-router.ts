import {Router} from 'express';
import {
    authValidations,
    newPasswordValidations,
    passwordRecoveryValidations,
    registrationConfirmationValidations,
    registrationValidations,
    resendingEmailValidations
} from '../validators/auth';
import {inputValidationMiddleware} from '../utils';
import {authMiddleware} from '../middlewares/authMiddleware';
import {apiRequestsInfoMiddleware} from '../middlewares/apiRequestsInfoMiddleware';
import {apiRequestsRateMiddleware} from '../middlewares/apiRequestsRateMiddleware';
import {container} from '../compositionRoot';
import {AuthController} from '../controllers/authController';

export const authRouter = Router();
const authController = container.resolve(AuthController);

authRouter.post('/login', apiRequestsInfoMiddleware, apiRequestsRateMiddleware, authValidations, inputValidationMiddleware, authController.loginUser.bind(authController));
authRouter.post('/logout', authController.deactivateRefreshToken.bind(authController));
authRouter.post('/refresh-token', authController.updateDeviceInfo.bind(authController));
authRouter.get('/me', authMiddleware, authController.getMyInfo.bind(authController));
authRouter.post('/registration', apiRequestsInfoMiddleware, apiRequestsRateMiddleware, registrationValidations, inputValidationMiddleware, authController.registerUser.bind(authController));
authRouter.post('/registration-confirmation', apiRequestsInfoMiddleware, apiRequestsRateMiddleware, registrationConfirmationValidations, inputValidationMiddleware, authController.confirmEmail.bind(authController));
authRouter.post('/registration-email-resending', apiRequestsInfoMiddleware, apiRequestsRateMiddleware, resendingEmailValidations, inputValidationMiddleware, authController.resendEmailConfirmation.bind(authController));
authRouter.post('/password-recovery', apiRequestsInfoMiddleware, apiRequestsRateMiddleware, passwordRecoveryValidations, inputValidationMiddleware, authController.passwordRecovery.bind(authController));
authRouter.post('/new-password', apiRequestsInfoMiddleware, apiRequestsRateMiddleware, newPasswordValidations, inputValidationMiddleware, authController.confirmNewPassword.bind(authController));
