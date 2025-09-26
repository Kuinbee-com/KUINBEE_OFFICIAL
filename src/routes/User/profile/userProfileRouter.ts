import express from 'express';
import { handleProfileInputValidation } from '../../../middlewares/user/userRouteMiddleware';
import { upsertUserProfileInfo } from '../../../controllers/User/userOperationControllers';
import { getUserProfileInfo } from '../../../controllers/User/userFetchControllers';
const userProfileRouter = express.Router();

// ****************************** OPERATIONAL ROUTES ******************************
userProfileRouter.post('/upsertUserProfileInfo', handleProfileInputValidation, upsertUserProfileInfo);

// ***************************** FETCH ROUTES *****************************
userProfileRouter.get('/getUserProfileInfo', getUserProfileInfo);


export default userProfileRouter;
