import express from 'express';
import { usePath } from '../../utility/pathInterface';
import { handleUserRegistrationValidation } from '../../middlewares/user/userRouteMiddleware';
import { userRegistration } from '../../controllers/User/userRegistration';
import { requireAuth } from '../../middlewares/auth/common/requireAuth';
import userProfileRouter from './profile/userProfileRouter';
import userDatasetRouter from './datasets/userDatasetRouter';
import { getAllCategories, getAllSources, getAllUploadedDatasets, getDatasetById } from '../../controllers/User/userFetchControllers';
const userRouter = express.Router();
// ****************************** UN AUTH ROUTES ******************************

userRouter.post('/userRegistration', handleUserRegistrationValidation, userRegistration);
userRouter.get('/datasets/getDatasetById/:id', getDatasetById);
userRouter.get('/datasets/getAllUploadedDatasets', getAllUploadedDatasets);
userRouter.get('/categories/getAllCategories', getAllCategories);
userRouter.get('/sources/getAllSources', getAllSources);

userRouter.use(requireAuth);

// ****************************** AUTH ROUTES ******************************
usePath(userRouter, userProfileRouter, '/profile')
usePath(userRouter, userDatasetRouter, '/datasets');

export default userRouter;