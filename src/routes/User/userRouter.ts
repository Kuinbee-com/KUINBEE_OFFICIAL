import express from 'express';
import { usePath } from '../../utility/pathInterface';
import { handleUserRegistrationValidation } from '../../middlewares/user/userRouteMiddleware';
import { userRegistration } from '../../controllers/User/userRegistration';
import { requireAuth } from '../../middlewares/auth/common/requireAuth';
import userProfileRouter from './profile/userProfileRouter';
import userDatasetRouter from './datasets/userDatasetRouter';
const userRouter = express.Router();

userRouter.post('/userRegistration', handleUserRegistrationValidation, userRegistration);

userRouter.use(requireAuth);

usePath(userRouter, userProfileRouter, '/profile')
usePath(userRouter, userDatasetRouter, '/datasets');

export default userRouter;