import express, { Router } from 'express';
import { usePath } from '../../utility/pathInterface';
import { requireAuth } from '../../middlewares/auth/requireAuth';
import { requireAdminAuth } from '../../middlewares/auth/requireSuperAdminAuth';
import superAdminAdminRouter from './admin/superAdminAdminRouter';
const superAdminRouter: Router = express.Router();


superAdminRouter.use(requireAuth, requireAdminAuth);

usePath(superAdminRouter, superAdminAdminRouter, '/admin');


export default superAdminRouter;