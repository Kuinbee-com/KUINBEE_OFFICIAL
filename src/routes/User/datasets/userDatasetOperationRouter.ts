import express from "express";
import { getAllCategories, getAllSources, getAllUploadedDatasets, getDatasetById, getDownloadedDatasets } from "../../../controllers/User/userFetchControllers";
import { generateDatasetDownloadURL } from "../../../controllers/User/userOperationControllers";
const userDatasetOperationRouter = express.Router();

// ***************************** GET ********************************

userDatasetOperationRouter.get('/getDownloadedDatasets', getDownloadedDatasets);
userDatasetOperationRouter.get('/getDatasetById/:id', getDatasetById);
userDatasetOperationRouter.get('/getAllUploadedDatasets', getAllUploadedDatasets);
userDatasetOperationRouter.get('/getAllCategories', getAllCategories);
userDatasetOperationRouter.get('/getAllSources', getAllSources);

// ***************************** POST ********************************
userDatasetOperationRouter.post('/generateDatasetDownloadURL', generateDatasetDownloadURL);

export default userDatasetOperationRouter;