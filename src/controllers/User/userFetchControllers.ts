import { Response } from "express";
import { ICustomRequest } from "../../interfaces/custom/customeRequestInterface";
import { IUnifiedResponse } from "../../interfaces/custom/customeResponseInterface";
import { handleCatchError } from "../../utility/common/handleCatchErrorHelper";
import { prisma } from "../../client/prisma/getPrismaClient";
import { getAllUploadedDatasetHelper, getDatasetByIdHelper } from "../../helpers/datasets/datasetFetchHelper";
import { IGetUploadedDatasetQuery } from "../../interfaces/custom/customeInterfaces";

const getUserProfileInfo = async (req: ICustomRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const userId = req.id;
        const userProfile = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true, phNo: true, UserProfileInfo: { select: { bio: true, city: true, country: true, gender: true, occupation: true, institution: true } } } });
        if (!userProfile) return void res.status(404).json({ success: false, message: "User Profile not found" });
        return void res.status(200).json({ success: true, data: userProfile });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};
const getDownloadedDatasets = async (req: ICustomRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const userId = req.id;
        const datasets = await prisma.datasetLookup.findMany({ where: { userId }, select: { dataset: { select: { id: true, isPaid: true, title: true, datasetUniqueId: true, primaryCategory: { select: { name: true } }, DatasetLookup: { select: { purchaseDate: true } } } } } });
        const formatedDatasets = datasets.map(d => {
            return {
                id: d.dataset.id, title: d.dataset.title, isPaid: d.dataset.isPaid, datasetUniqueId: d.dataset.datasetUniqueId,
                primaryCategoryName: d.dataset.primaryCategory.name, purchaseDate: d.dataset.DatasetLookup[0]?.purchaseDate || null
            }
        })
        return void res.status(200).json({ success: true, data: formatedDatasets });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};
const getDatasetById = async (req: ICustomRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const dataset = await getDatasetByIdHelper(req.params.id);
        if (!dataset) return void res.status(404).json({ success: false, message: "Dataset not found" });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { primaryCategoryId, sourceId, ...datasetWithoutIds } = dataset;
        return void res.status(200).json({ success: true, data: { ...datasetWithoutIds, primaryCategoryName: dataset.primaryCategory.name, sourceName: dataset.source.name } });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};
const getAllUploadedDatasets = async (req: ICustomRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const datasets = await getAllUploadedDatasetHelper(req?.query as unknown as IGetUploadedDatasetQuery);
        return void res.status(200).json({ success: true, data: datasets });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};
const getAllCategories = async (req: ICustomRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const categories = await prisma.category.findMany();
        return void res.status(200).json({ success: true, data: categories });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};
const getAllSources = async (req: ICustomRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const sources = await prisma.source.findMany();
        return void res.status(200).json({ success: true, data: sources });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};
export { getUserProfileInfo, getDownloadedDatasets, getDatasetById, getAllUploadedDatasets, getAllCategories, getAllSources };