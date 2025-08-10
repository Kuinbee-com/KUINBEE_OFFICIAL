import express from 'express';
import { usePath } from '../../utility/pathInterface';
import { handleUserRegistrationValidation } from '../../middlewares/user/userRegistrationValidation';
import { userRegistration } from '../../controllers/User/userRegistration';
import { requireAuth } from '../../middlewares/auth/common/requireAuth';
const userRouter = express.Router();

userRouter.post('/userRegistration', handleUserRegistrationValidation, userRegistration);

userRouter.use(requireAuth);


export default userRouter;