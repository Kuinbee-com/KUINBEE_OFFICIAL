import express from 'express';
import { loginInputValidation } from '../../middlewares/auth/common/handleLoginValidation';
import { loginPassword } from '../../controllers/auth/authControllers';
const authRouter = express.Router();


// authRouter.post('/signup', registrationInputValidation, registrationController);



authRouter.post('/loginPassword', loginInputValidation, loginPassword);



export default authRouter;