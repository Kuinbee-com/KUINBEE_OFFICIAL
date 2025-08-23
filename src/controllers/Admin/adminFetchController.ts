import { fileFormatOptions, FileFormatOptions } from './../../constants/modelConstants';
import { ICustomAdminRequest } from "../../interfaces/custom/customeRequestInterface";
import { Response } from "express";
import { IUnifiedResponse } from "../../interfaces/custom/customeResponseInterface";
import { prisma } from "../../client/prisma/getPrismaClient";
import { handleCatchError } from "../../utility/common/handleCatchErrorHelper";
import { createProjectionSelect } from "../../utility/projectionTypes";
import { Prisma } from "@prisma/client";
import { createPresignedUploadUrl } from '../../client/aws/helpers/presignedUrls';
import { getDatasetS3Key } from '../../constants/awsConstants';
import { getAllUploadedDatasetHelper, getDatasetByIdHelper } from '../../helpers/datasets/datasetFetchHelper';
import { generateDatasetDownloadURLHelper } from '../../helpers/datasets/datasetOperationHelper';


// **************************** CATEGORY CONTROLLER ****************************
const getAllCategories = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};

// **************************** SOURCE CONTROLLER ****************************
const getAllSources = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const sources = await prisma.source.findMany();
        res.status(200).json({ success: true, data: sources });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};

// **************************** DATASETS CONTROLLER ****************************
const getAllDatasets = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const selectedFields = createProjectionSelect<Prisma.DatasetGetPayload<{ include: { aboutDatasetInfo: { include: { dataFormatInfo: true, features: true } }, locationInfo: true, birthInfo: true } }>>()([
            'id', 'title', 'primaryCategoryId', 'sourceId', 'price', 'isPaid', 'license', 'superType', 'uploaded', 'aboutDatasetInfo.overview',
            'aboutDatasetInfo.description', 'aboutDatasetInfo.dataQuality', 'aboutDatasetInfo.dataFormatInfo.rows', 'aboutDatasetInfo.dataFormatInfo.cols',
            'aboutDatasetInfo.dataFormatInfo.fileFormat', 'aboutDatasetInfo.features', 'locationInfo', 'birthInfo',
        ]);

        const datasets = await prisma.dataset.findMany({ select: selectedFields });
        res.status(200).json({ success: true, data: datasets });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};

const getDatasetById = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const dataset = await getDatasetByIdHelper(req.params.id);
        if (!dataset) return void res.status(404).json({ success: false, message: "Dataset not found" });
        res.status(200).json({ success: true, data: dataset });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};

const getAllNonUploadedDatasetsInfo = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const datasets = await prisma.dataset.findMany({ where: { uploaded: false }, select: { id: true, title: true, isPaid: true, aboutDatasetInfo: { select: { dataFormatInfo: { select: { fileFormat: true } } } } } });
        const response = datasets.map(dataset => ({
            id: dataset.id,
            title: dataset.title,
            isPaid: dataset.isPaid,
            fileFormat: dataset.aboutDatasetInfo?.dataFormatInfo?.fileFormat
        }));
        res.status(200).json({ success: true, data: response });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};

const getAllUploadedDatasets = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const datasets = await getAllUploadedDatasetHelper();

        res.status(200).json({
            success: true, data: datasets
        });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};

const generateDatasetDownloadURL = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const { id, fileFormat, isPaid } = req.body;
        const downloadURL = await generateDatasetDownloadURLHelper(id, fileFormat, isPaid);
        res.status(200).json({ success: true, data: { downloadURL } });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};

const generateDatasetUploadURL = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const { id, fileFormat, isPaid } = req.body;

        if (!id) return void res.status(400).json({ success: false, message: "Missing id fields" });
        if (!fileFormat) return void res.status(400).json({ success: false, message: "Missing File Format fields" });
        if (!fileFormatOptions.includes(fileFormat)) return void res.status(400).json({ success: false, message: "Available file formats are csv, xlsx, xls, xml", });
        if (isPaid === undefined && typeof isPaid !== "boolean") return void res.status(400).json({ success: false, message: "Missing isPaid fields" });
        const key = getDatasetS3Key(id, isPaid, fileFormat as FileFormatOptions);
        const uploadURL = await createPresignedUploadUrl(key);
        if (!uploadURL) return void res.status(500).json({ success: false, message: "Failed to create upload URL" });

        res.status(200).json({ success: true, data: uploadURL });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
}
export { getAllCategories, getAllSources, getAllDatasets, getDatasetById, getAllNonUploadedDatasetsInfo, generateDatasetUploadURL, getAllUploadedDatasets, generateDatasetDownloadURL };

