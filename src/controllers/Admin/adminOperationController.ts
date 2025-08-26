import { FileFormatOptions } from './../../constants/modelConstants';
import { AdminPermission, Prisma } from "@prisma/client";
import { prisma } from "../../client/prisma/getPrismaClient";
import { IDatasetBaseInput } from "../../interfaces/custom/customeInterfaces";
import { ICustomAdminRequest } from "../../interfaces/custom/customeRequestInterface";
import { IUnifiedResponse } from "../../interfaces/custom/customeResponseInterface";
import { Response } from "express";
import { createPresignedUploadUrl } from "../../client/aws/helpers/presignedUrls";
import { getDatasetS3Key } from "../../constants/awsConstants";
import { handleCatchError } from '../../utility/common/handleCatchErrorHelper';



// **************************** CATEGORY CONTROLLER ****************************
const createCategory = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const { categoryName } = req.body;
        if (!req.AdminPermissions?.includes(AdminPermission['CREATE'])) return void res.status(403).json({ success: false, error: 'Forbidden you dont have permission to create category' });
        const createdCategory = await prisma.category.create({ data: { name: categoryName.trim(), createdBy: req?.id as string } });
        return void res.status(201).json({ success: true, data: { id: createdCategory.id, categoryName: createdCategory.name } });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};
const deleteCategory = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        if (!req.AdminPermissions?.includes(AdminPermission['DELETE'])) return void res.status(403).json({ success: false, error: 'Forbidden you dont have permission to delete category' });
        const deletedCategory = await prisma.category.delete({ where: { id: req.paramsId } });
        return void res.status(200).json({ success: true, data: { deleted: deletedCategory.name } });
    } catch (error) { return void handleCatchError(req, res, error); }
};

const editCategory = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const { categoryName } = req.body;
        if (!req.AdminPermissions?.includes(AdminPermission['UPDATE'])) return void res.status(403).json({ success: false, error: 'Forbidden you dont have permission to update category' });
        if (!categoryName) return void res.status(400).json({ success: false, message: 'categoryName is required.' });
        const updatedCategory = await prisma.category.update({ where: { id: req.paramsId }, data: { name: categoryName.trim() } });
        return void res.status(200).json({ success: true, data: { id: updatedCategory.id, name: updatedCategory.name } });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};

// **************************** SOURCE CONTROLLER ****************************
const createSource = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        if (!req.AdminPermissions?.includes(AdminPermission['CREATE'])) return void res.status(403).json({ success: false, error: 'Forbidden you dont have permission to create source' });
        if (!req.body || !req.body.sourceName) return void res.status(400).json({ success: false, message: 'sourceName is required.' });
        const { sourceName } = req.body;
        const createdSource = await prisma.source.create({ data: { name: sourceName.trim() } });
        return void res.status(200).json({ success: true, data: { id: createdSource.id } });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};

const deleteSource = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        if (!req.AdminPermissions?.includes(AdminPermission['DELETE'])) return void res.status(403).json({ success: false, error: 'Forbidden you dont have permission to delete source' });
        const deletedSource = await prisma.source.delete({ where: { id: req.paramsId } });
        return void res.status(200).json({ success: true, data: { deleted: deletedSource.name } });
    } catch (error) { return void handleCatchError(req, res, error); }
};

const editSource = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        if (!req.AdminPermissions?.includes(AdminPermission['UPDATE'])) return void res.status(403).json({ success: false, error: 'Forbidden you dont have permission to update source' });
        if (!req.body || !req.body.sourceName) return void res.status(400).json({ success: false, message: 'sourceName is required.' });
        const { sourceName } = req.body;
        const updatedSource = await prisma.source.update({ where: { id: req.paramsId }, data: { name: sourceName.trim() } });
        return void res.status(200).json({ success: true, data: { id: updatedSource.id, name: updatedSource.name } });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};

// **************************** DATASET CONTROLLER ******************************************
const addDataset = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        if (!req.AdminPermissions?.includes(AdminPermission['CREATE'])) return void res.status(403).json({ success: false, error: 'Forbidden you dont have permission to create dataset' });
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
                    superType: dataset.superTypes,
                    datasetUniqueId: dataset.datasetUniqueId,
                    aboutDatasetInfo: {
                        create: {
                            overview: dataset.aboutDatasetInfo?.overview as string, description: dataset.aboutDatasetInfo?.description as string, dataQuality: dataset.aboutDatasetInfo?.dataQuality as string,
                            dataFormatInfo: {
                                create: { rows: dataset.aboutDatasetInfo?.dataFormatInfo?.rows as number, cols: dataset.aboutDatasetInfo?.dataFormatInfo?.cols as number, fileFormat: dataset.aboutDatasetInfo?.dataFormatInfo?.fileFormat as keyof FileFormatOptions }
                            },
                            features: dataset.aboutDatasetInfo?.features ? { create: dataset.aboutDatasetInfo?.features?.map(feature => ({ content: feature.content as string })) ?? [] } : undefined
                        }
                    },
                    birthInfo: { create: { creatorAdminId: req.id as string, lastUpdaterAdminId: req.id as string } },
                    securityInfo: dataset.securityInfo ? { create: { masterSecret: dataset.securityInfo?.masterSecret as string, currentEncryptionSecret: dataset.securityInfo?.currentEncryptionSecret as string } } : undefined,
                    locationInfo: dataset.locationInfo ? {
                        create: {
                            region: dataset.locationInfo.region as string, country: dataset.locationInfo.country as string,
                            city: dataset.locationInfo.city as string, state: dataset.locationInfo.state as string
                        }
                    } : undefined,
                    CategoryLookup: dataset.categories ? { create: dataset.categories.map(cat => ({ category: { connect: { id: cat.id } } })) } : undefined
                } as Prisma.DatasetCreateInput
            });
        });

        if (!createdDataset) return void res.status(500).json({ success: false, message: 'Failed to create dataset' });
        const uploadUrl = await createPresignedUploadUrl(getDatasetS3Key(createdDataset.id, createdDataset.isPaid, dataset?.aboutDatasetInfo?.dataFormatInfo?.fileFormat as FileFormatOptions));
        return void res.status(201).json({ success: true, data: uploadUrl });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};

const addMultipleDatasetInfo = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        if (!req.AdminPermissions?.includes(AdminPermission['CREATE'])) return void res.status(403).json({ success: false, error: 'Forbidden you dont have permission to create dataset' });
        const datasets = req.body as IDatasetBaseInput[];
        if (datasets.length === 0) return void res.status(400).json({ success: false, message: 'No datasets provided' });
        if (datasets.length > 10) return void res.status(400).json({ success: false, message: 'Too many datasets provided, limit is 10' });

        await Promise.all(datasets.map(d => { prisma.dataset.findUnique({ where: { datasetUniqueId: d.datasetUniqueId } }).then(existing => { if (existing) return void res.status(404).json({ success: false, message: `Dataset with unique ID ${d.datasetUniqueId} not found` }); }); }));
        const datasetData = datasets.map(dataset => ({
            title: dataset.title, primaryCategoryId: dataset.primaryCategoryId, sourceId: dataset.sourceId, price: dataset.price, isPaid: dataset.isPaid,
            license: dataset.license, superType: dataset.superTypes, datasetUniqueId: dataset.datasetUniqueId
        }) as Partial<Prisma.DatasetCreateManyInput>) as Prisma.DatasetCreateManyInput[];

        const [, createdDatasets] = await prisma.$transaction([
            prisma.dataset.createMany({ data: datasetData, skipDuplicates: true }),
            prisma.dataset.findMany({
                where: { datasetUniqueId: { in: datasets.map(d => d.datasetUniqueId) } },
                select: { id: true, isPaid: true, datasetUniqueId: true }
            })
        ]);
        const datasetLookup = new Map(datasets.map(d => [d.datasetUniqueId, d]));
        const results: { id: string; dataFormat: string }[] = [];
        await prisma.$transaction(async (tx) => {
            await Promise.all(createdDatasets.map((created) => {
                const dataset = datasetLookup.get(created.datasetUniqueId);
                if (!dataset) return void res.status(404).json({ success: false, message: `Dataset with unique ID ${created.datasetUniqueId} not found in input` });
                results.push({ id: created.id, dataFormat: dataset.aboutDatasetInfo?.dataFormatInfo?.fileFormat ?? 'csv' });
                return Promise.all([
                    tx.aboutDatasetInfo.create({
                        data: {
                            overview: dataset.aboutDatasetInfo?.overview as string,
                            description: dataset.aboutDatasetInfo?.description as string,
                            dataQuality: dataset.aboutDatasetInfo?.dataQuality as string,
                            dataset: { connect: { id: created.id } },
                            dataFormatInfo: {
                                create: { rows: dataset.aboutDatasetInfo?.dataFormatInfo?.rows as number, cols: dataset.aboutDatasetInfo?.dataFormatInfo?.cols as number, fileFormat: dataset.aboutDatasetInfo?.dataFormatInfo?.fileFormat as string, }
                            }, features: dataset.aboutDatasetInfo?.features ? { create: dataset.aboutDatasetInfo.features.map(f => ({ content: f.content })) } : undefined
                        }
                    }),
                    tx.birthInfo.create({ data: { datasetId: created.id, creatorAdminId: req.id as string, lastUpdaterAdminId: req.id as string } }),
                    dataset.securityInfo ? tx.securityInfo.create({ data: { dataset: { connect: { id: created.id } }, masterSecret: dataset.securityInfo.masterSecret, currentEncryptionSecret: dataset.securityInfo.currentEncryptionSecret } }) : Promise.resolve(),
                    dataset.locationInfo ? tx.locationInfo.create({ data: { dataset: { connect: { id: created.id } }, region: dataset.locationInfo.region, country: dataset.locationInfo.country, city: dataset.locationInfo.city, state: dataset.locationInfo.state } }) : Promise.resolve(),
                    dataset.categories ? tx.categoryLookup.createMany({ data: dataset.categories.map(cat => ({ datasetId: created.id, categoryId: cat.id })), skipDuplicates: true }) : Promise.resolve()
                ]);
            }));
        });

        return void res.status(201).json({ success: true, data: results });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};

export { createCategory, deleteCategory, addDataset, createSource, deleteSource, editSource, editCategory, addMultipleDatasetInfo };