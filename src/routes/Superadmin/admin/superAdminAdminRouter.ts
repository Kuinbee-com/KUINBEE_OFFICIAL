import express from 'express';
import { usePath } from '../../../utility/pathInterface';
import superAdminAdminOpRouter from './superAdminAdminOpRouter';
import superAdminAdminStatsRouter from './superAdminAdminStatsRouter';

const superAdminAdminRouter = express.Router();

usePath(superAdminAdminRouter, superAdminAdminOpRouter, '/operations');
usePath(superAdminAdminRouter, superAdminAdminStatsRouter, '/stats');


export default superAdminAdminRouter;