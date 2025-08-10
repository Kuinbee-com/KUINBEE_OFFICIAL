import express from "express";
import { handleAddDatasetInfoValidation, handleAddMultipleDatasetInfoValidation, handleCreateCategoryValidation } from "../../../middlewares/admin/adminOpRouteaValidations";
import { addDataset, addMultipleDatasetInfo, createCategory, createSource, deleteCategory, deleteSource, editCategory, editSource } from "../../../controllers/Admin/adminOperationController";
import { getAllCategories, getAllDatasets, getAllNonUploadedDatasetsInfo, getAllSources, getAllUploadedDatasets, getDatasetById, getDatasetDownloadURL, generateDatasetUploadURL } from "../../../controllers/Admin/adminFetchController";
import { extractIdFromParams } from "../../../utility/auth/requestUtils";

const datasetOpRouter = express.Router();

// ************************** GET *************************** //
datasetOpRouter.get('/getAllCategories', getAllCategories);
datasetOpRouter.get('/getAllSources', getAllSources);
datasetOpRouter.get('/getAllDatasets', getAllDatasets);
datasetOpRouter.get('/getDatasetById/:id', extractIdFromParams, getDatasetById);
datasetOpRouter.get('/getAllNonUploadedDatasetsInfo', getAllNonUploadedDatasetsInfo);
datasetOpRouter.get('/getAllUploadedDatasets', getAllUploadedDatasets);
datasetOpRouter.get('/getDatasetDownloadURL', getDatasetDownloadURL);

// *************************** POST ************************** //
datasetOpRouter.post('/addDataset', handleAddDatasetInfoValidation, addDataset);
datasetOpRouter.post('/addMultipleDatasetInfo', handleAddMultipleDatasetInfoValidation, addMultipleDatasetInfo);
datasetOpRouter.post('/createCategory', handleCreateCategoryValidation, createCategory);
datasetOpRouter.post('/createSource', createSource);
datasetOpRouter.post('/generateDatasetUploadURL', generateDatasetUploadURL);

// ************************** PUT *************************** //
datasetOpRouter.put('/editCategory/:id', extractIdFromParams, editCategory)
datasetOpRouter.put('/editSource/:id', extractIdFromParams, editSource);

// ************************** DELETE *************************** //
datasetOpRouter.delete('/deleteCategory/:id', extractIdFromParams, deleteCategory);
datasetOpRouter.delete('/deleteSource/:id', extractIdFromParams, deleteSource);

export { datasetOpRouter };