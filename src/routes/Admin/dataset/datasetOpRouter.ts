import express from "express";
import { handleAddDatasetValidation, handleCreateCategoryValidation } from "../../../middlewares/admin/adminOpRouteaValidations";
import { addDataset, createCategory, createSource, deleteCategory, deleteSource, editCategory, editSource } from "../../../controllers/Admin/adminOperationController";
import { getAllCategories, getAllSources } from "../../../controllers/Admin/adminFetchController";
import { extractIdFromParams } from "../../../utility/auth/requestUtils";

const datasetOpRouter = express.Router();

// ************************** GET *************************** //
datasetOpRouter.get('/getAllCategories', getAllCategories);
datasetOpRouter.get('/getAllSources', getAllSources);


// *************************** POST ************************** //
datasetOpRouter.post('/addDataset', handleAddDatasetValidation, addDataset);
datasetOpRouter.post('/createCategory', handleCreateCategoryValidation, createCategory);
datasetOpRouter.post('/createSource', createSource);


// ************************** PUT *************************** //
datasetOpRouter.put('/editCategory/:id', extractIdFromParams, editCategory)
datasetOpRouter.put('/editSource/:id', extractIdFromParams, editSource);

// ************************** DELETE *************************** //
datasetOpRouter.delete('/deleteCategory/:id', extractIdFromParams, deleteCategory);
datasetOpRouter.delete('/deleteSource/:id', extractIdFromParams, deleteSource);

export { datasetOpRouter };