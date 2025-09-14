import express from 'express';
import { usePath } from '../../utility/pathInterface';
import { requireAuth } from '../../middlewares/auth/common/requireAuth';
import { requireAdminAuth } from '../../middlewares/auth/exclusive/requireAdminAuth';
import adminProfileRouter from './adminProfileRouter/adminProfileRouter';
import { datasetRouter } from './dataset/datasetRouter';
import { adminUserRouter } from './adminUsers/adminUserRouter';


const adminRouter = express.Router();

adminRouter.use(requireAuth, requireAdminAuth);

// TODO : ADMIN PROFILE ROUTE IS NEEDED
usePath(adminRouter, adminProfileRouter, '/profile');
usePath(adminRouter, datasetRouter, '/datasets');
usePath(adminRouter, adminUserRouter, '/users');

export default adminRouter;

