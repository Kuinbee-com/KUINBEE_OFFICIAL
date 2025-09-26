import express from 'express';
import { getAllUsers, getUser } from '../../../controllers/Admin/user/userOperationController';

const adminUserOpRouter = express.Router();


adminUserOpRouter.get('/getAllUsers', getAllUsers);
adminUserOpRouter.get('/getUser/:id', getUser);

export { adminUserOpRouter };