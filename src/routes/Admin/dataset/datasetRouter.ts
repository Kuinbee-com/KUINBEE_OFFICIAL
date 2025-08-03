import express from 'express';
import { usePath } from '../../../utility/pathInterface';
import { datasetOpRouter } from './datasetOpRouter';
import { datasetStatRouter } from './datasetStatRouter';

const datasetRouter = express.Router();

usePath(datasetRouter, datasetOpRouter, '/operations');
// usePath(datasetRouter, datasetStatRouter, '/stats');

export { datasetRouter };