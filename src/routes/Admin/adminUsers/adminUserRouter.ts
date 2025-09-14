import express from 'express';
import { usePath } from '../../../utility/pathInterface';
import { adminUserOpRouter } from './adminUserOpRouter';
import { adminUserStatRouter } from './adminUserStatRouter';

const adminUserRouter = express.Router();

usePath(adminUserRouter, adminUserOpRouter, '/operations');
usePath(adminUserOpRouter, adminUserStatRouter, '/stats');
export { adminUserRouter };