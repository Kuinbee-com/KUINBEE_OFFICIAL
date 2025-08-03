import express, { Router } from 'express';
import { usePath } from '../../utility/pathInterface';
import { requireAuth } from '../../middlewares/auth/common/requireAuth';
import { requireSuperAdminAuth } from '../../middlewares/auth/exclusive/requireSuperAdminAuth';
import superAdminAdminRouter from './admin/superAdminAdminRouter';
const superAdminRouter: Router = express.Router();


superAdminRouter.use(requireAuth, requireSuperAdminAuth);

usePath(superAdminRouter, superAdminAdminRouter, '/admin');


export default superAdminRouter;