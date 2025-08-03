import { FileFormatOptions, fileFormatOptions } from './../../constants/modelConstants';
import { Prisma } from "@prisma/client";
import { prisma } from "../../client/prisma/getPrismaClient";
import { IDatasetBaseInput } from "../../interfaces/custom/customeInterfaces";
import { ICustomAdminRequest } from "../../interfaces/custom/customeRequestInterface";
import { IUnifiedResponse } from "../../interfaces/custom/customeResponseInterface";
import { Response } from "express";
import { createPresignedUploadUrl } from "../../client/aws/helpers/presignedUrls";
import { getDatasetS3Key } from "../../constants/awsConstants";



// **************************** CATEGORY CONTROLLER ****************************
const createCategory = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const { categoryName } = req.body;
        const createdCategory = await prisma.category.create({ data: { name: categoryName.trim(), createdBy: req?.id as string } });
        return void res.status(201).json({ success: true, data: { id: createdCategory.id, categoryName: createdCategory.name } });
    } catch (error) {
        return void res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
const deleteCategory = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const deletedCategory = await prisma.category.delete({ where: { id: req.paramsId } });
        return void res.status(200).json({ success: true, data: { deleted: deletedCategory.name } });
    } catch (error) { return void res.status(500).json({ success: false, message: 'Internal server error' }); }
};

const editCategory = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const { categoryName } = req.body;
        if (!categoryName) return void res.status(400).json({ success: false, message: 'categoryName is required.' });
        const updatedCategory = await prisma.category.update({ where: { id: req.paramsId }, data: { name: categoryName.trim() } });
        return void res.status(200).json({ success: true, data: { id: updatedCategory.id, name: updatedCategory.name } });
    } catch (error) {
        return void res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


// **************************** SOURCE CONTROLLER ****************************
const createSource = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        if (!req.body || !req.body.sourceName) return void res.status(400).json({ success: false, message: 'sourceName is required.' });
        const { sourceName } = req.body;
        const createdSource = await prisma.source.create({ data: { name: sourceName.trim() } });
        return void res.status(200).json({ success: true, data: { id: createdSource.id } });
    } catch (error) {
        return void res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const deleteSource = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const deletedSource = await prisma.source.delete({ where: { id: req.paramsId } });
        return void res.status(200).json({ success: true, data: { deleted: deletedSource.name } });
    } catch (error) { return void res.status(500).json({ success: false, message: 'Internal server error' }); }
};


const editSource = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        if (!req.body || !req.body.sourceName) return void res.status(400).json({ success: false, message: 'sourceName is required.' });
        const { sourceName } = req.body;
        const updatedSource = await prisma.source.update({ where: { id: req.paramsId }, data: { name: sourceName.trim() } });
        return void res.status(200).json({ success: true, data: { id: updatedSource.id, name: updatedSource.name } });
    } catch (error) {
        return void res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// **************************** DATASET CONTROLLER ******************************************
const addDataset = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const dataset = req.body as IDatasetBaseInput;
        const createdDataset = await prisma.$transaction(async (tx) => {
            return await tx.dataset.create({
                data: {
                    title: dataset.title,
                    primaryCategory: { connect: { id: dataset.primaryCategoryId } },
                    source: { connect: { id: dataset.sourceId } },
                    price: dataset.price,
                    isPaid: dataset.isPaid,
                    license: dataset.license,
                    superTypes: dataset.superTypes,
                    aboutDataset: {
                        create: {
                            overview: dataset.aboutDataset?.overview as string, description: dataset.aboutDataset?.description as string, dataQuality: dataset.aboutDataset?.dataQuality as string,
                            dataFormat: {
                                create: { rows: dataset.aboutDataset?.dataFormat?.rows as number, cols: dataset.aboutDataset?.dataFormat?.cols as number, fileFormat: dataset.aboutDataset?.dataFormat?.fileFormat as keyof FileFormatOptions }
                            },
                            features: dataset.aboutDataset?.features ? { create: dataset.aboutDataset?.features?.map(feature => ({ content: feature.content as string })) ?? [] } : undefined
                        }
                    },
                    birthInfo: { create: { creatorAdminId: req.id as string, lastUpdaterAdminId: req.id as string } },
                    security: dataset.security ? { create: { masterSecret: dataset.security?.masterSecret as string, currentEncryptionSecret: dataset.security?.currentEncryptionSecret as string } } : undefined,
                    location: dataset.location ? {
                        create: {
                            region: dataset.location.region as string, country: dataset.location.country as string,
                            city: dataset.location.city as string, state: dataset.location.state as string
                        }
                    } : undefined,
                    categories: dataset.categories ? { create: dataset.categories.map(categoryId => ({ category: { connect: { id: categoryId } } })) } : undefined
                } as Prisma.DatasetCreateInput
            });
        });

        if (!createdDataset) return void res.status(500).json({ success: false, message: 'Failed to create dataset' });
        const uploadUrl = await createPresignedUploadUrl(getDatasetS3Key(createdDataset.id, createdDataset.isPaid, dataset?.aboutDataset?.dataFormat?.fileFormat as FileFormatOptions));
        return void res.status(201).json({ success: true, data: uploadUrl });
    } catch (error) {
        return void res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export { createCategory, deleteCategory, addDataset, createSource, deleteSource, editSource, editCategory };