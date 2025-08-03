import { IDatasetBaseInput } from "../../interfaces/custom/customeInterfaces";
import { ICustomAdminRequest } from "../../interfaces/custom/customeRequestInterface";
import { IUnifiedResponse } from "../../interfaces/custom/customeResponseInterface";
import { NextFunction, Response } from "express";
import { datasetInputValidation } from "../../validations/personalInfoValidation";

export const handleAddDatasetValidation = (req: ICustomAdminRequest, res: Response<IUnifiedResponse>, next: NextFunction) => {
  try {
    const dataset: IDatasetBaseInput = req.body;
    if (!dataset) return void res.status(400).json({ success: false, message: 'Dataset body is missing' });

    const missingFields = datasetInputValidation(dataset);
    if (missingFields) return void res.status(400).json({ success: false, message: `Missing field: ${missingFields}` });

    return next();
  } catch (error) {
    console.error('Validation error:', error);
    return void res.status(500).json({ success: false, error: 'Internal server error' });
  }
};


export const handleCreateCategoryValidation = (req: ICustomAdminRequest, res: Response<IUnifiedResponse>, next: NextFunction) => {
  try {
    if (!req.body) return void res.status(400).json({ success: false, error: 'body is missing' });
    const { categoryName } = req.body;
    if (!categoryName) return void res.status(400).json({ success: false, message: 'categoryName is required.' });
    return next();
  } catch (error) {
    return void res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

