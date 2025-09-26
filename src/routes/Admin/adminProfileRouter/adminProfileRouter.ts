import express from 'express';
import { usePath } from '../../../utility/pathInterface';
import adminProfileOpRouter from './adminProfileOpRouter';
const adminProfileRouter = express.Router();

usePath(adminProfileRouter, adminProfileOpRouter, '/operations');

export default adminProfileRouter;
