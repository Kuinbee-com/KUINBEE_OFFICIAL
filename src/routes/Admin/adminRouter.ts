import express from 'express';
import { usePath } from '../../utility/pathInterface';
import { requireAuth } from '../../middlewares/auth/common/requireAuth';
import { datasetRouter } from './dataset/datasetRouter';
import { adminUserRouter } from './adminUsers/adminUserRouter';
import { requireAdminAuth } from '../../middlewares/auth/exclusive/requireAdminAuth';

const adminRouter = express.Router();

adminRouter.use(requireAuth, requireAdminAuth);


usePath(adminRouter, datasetRouter, '/datasets');
// usePath(adminRouter, adminUserRouter, '/users');

export default adminRouter;

