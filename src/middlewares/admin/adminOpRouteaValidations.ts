import { IDatasetBaseInput } from "../../interfaces/custom/customInterfaces";
import { ICustomAdminRequest } from "../../interfaces/custom/customRequestInterface";
import { IUnifiedResponse } from "../../interfaces/custom/customResponseInterface";
import { NextFunction, Response } from "express";
import { datasetInputValidation } from "../../validations/personalInfoValidation";
import { handleCatchError } from "../../utility/common/handleCatchErrorHelper";
import { FileFormatOptions, fileFormatOptions } from "../../constants/modelConstants";

export const handleCreateCategoryValidation = (req: ICustomAdminRequest, res: Response<IUnifiedResponse>, next: NextFunction) => {
  try {
    if (!req.body) return void res.status(400).json({ success: false, error: 'body is missing' });
    const { categoryName } = req.body;
    if (!categoryName) return void res.status(400).json({ success: false, message: 'categoryName is required.' });
    return next();
  } catch (error) {
    return void handleCatchError(req, res, error);
  }
}

export const handleAddDatasetInfoValidation = (req: ICustomAdminRequest, res: Response<IUnifiedResponse>, next: NextFunction) => {
  try {
    const dataset: IDatasetBaseInput = req.body;
    if (!dataset) return void res.status(400).json({ success: false, message: 'Dataset body is missing' });

    const missingFields = datasetInputValidation(dataset);
    if (missingFields) return void res.status(400).json({ success: false, message: `Missing field: ${missingFields}` });
    const { isPaid, price } = req.body as IDatasetBaseInput;

    if (isPaid && !price) return void res.status(400).json({ success: false, message: 'Price is required when dataset is paid.' });
    if (isPaid && (typeof price !== 'number' || price < 0)) return void res.status(400).json({ success: false, message: 'Price must be a positive  number when dataset is paid.' });

    return next();
  } catch (error) {
    return void handleCatchError(req, res, error);
  }
};

export const handleAddMultipleDatasetInfoValidation = (req: ICustomAdminRequest, res: Response<IUnifiedResponse>, next: NextFunction) => {
  try {
    const datasets: IDatasetBaseInput[] = req.body;
    if (!datasets || !Array.isArray(datasets)) return void res.status(400).json({ success: false, message: 'Datasets body is missing or invalid' });

    datasets.forEach(dataset => {
      const missingFields = datasetInputValidation(dataset);
      if (missingFields) return void res.status(400).json({ success: false, message: `Missing field in dataset: ${missingFields}` });

      const { overview, description, dataQuality, dataFormatInfo } = dataset.aboutDatasetInfo || {};
      if (!overview) return void res.status(400).json({ success: false, message: 'Overview is required in aboutDatasetInfo.' });
      if (!description) return void res.status(400).json({ success: false, message: 'Description is required in aboutDatasetInfo.' });
      if (!dataQuality) return void res.status(400).json({ success: false, message: 'Data quality is required in aboutDatasetInfo.' });
      if (!dataFormatInfo) return void res.status(400).json({ success: false, message: 'Data format info is required in aboutDatasetInfo.' });

      const { rows, cols, fileFormat } = dataFormatInfo || {};
      if (!rows) return void res.status(400).json({ success: false, message: 'Rows are required in dataFormatInfo.' });
      if (!cols) return void res.status(400).json({ success: false, message: 'Cols are required in dataFormatInfo.' });
      if (!fileFormat) return void res.status(400).json({ success: false, message: 'File format is required in dataFormatInfo.' });
      if (!fileFormatOptions.includes(fileFormat as FileFormatOptions)) return void res.status(400).json({ success: false, message: `Invalid file format in dataFormatInfo. ${fileFormat}` });

      const { isPaid, price } = dataset;
      if (isPaid && !price) return void res.status(400).json({ success: false, message: 'Price is required when dataset is paid.' });
      if (isPaid && (typeof price !== 'number' || price < 0)) return void res.status(400).json({ success: false, message: 'Price must be a positive number when dataset is paid.' });
    });
    return next();
  } catch (error) {
    return void handleCatchError(req, res, error);
  }
};
