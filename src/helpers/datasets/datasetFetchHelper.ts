import { Prisma } from "@prisma/client";
import { prisma } from "../../client/prisma/getPrismaClient";
import { IGetUploadedDatasetQuery } from "../../interfaces/custom/customeInterfaces";
const getAllUploadedDatasetHelper = async (query?: IGetUploadedDatasetQuery) => {
    try {
        const { limit, offset, filter, search } = query || {};
        if (!limit || !offset) throw new Error("Limit and offset are required");

        const where: Prisma.DatasetWhereInput = {
            uploaded: true,
            isPaid: filter?.isPaid !== undefined ? filter.isPaid : undefined,
            primaryCategoryId: filter?.category !== undefined ? filter.category : undefined,
            sourceId: filter?.source !== undefined ? filter.source : undefined,
            superType: filter?.superType !== undefined ? filter.superType : undefined,
            title: search ? { contains: search, mode: "insensitive" } : undefined
        };

        const datasets = await prisma.dataset.findMany({
            where, orderBy: { DatasetLookup: { _count: 'desc' } }, skip: offset, take: limit,
            select: {
                id: true, title: true, isPaid: true, price: true, _count: { select: { DatasetLookup: true } }, primaryCategory: { select: { name: true } },
                source: { select: { name: true } }, aboutDatasetInfo: { select: { overview: true, dataFormatInfo: { select: { fileFormat: true } } } },
                birthInfo: { select: { lastUpdatedAt: true } }
            }
        });
        return datasets.map(dataset => ({
            id: dataset.id, title: dataset.title, isPaid: dataset.isPaid, price: dataset.price, overview: dataset.aboutDatasetInfo?.overview,
            fileFormat: dataset.aboutDatasetInfo?.dataFormatInfo?.fileFormat, category: dataset.primaryCategory?.name,
            source: dataset.source?.name, totalDownloads: dataset._count.DatasetLookup, lastUpdatedAt: dataset.birthInfo?.lastUpdatedAt
        }));
    } catch (error) {
        throw new Error(`Error fetching uploaded datasets: ${error}`);
    }
};


const getDatasetByIdHelper = async (id: string) => {
    try {
        return await prisma.dataset.findUnique({
            where: { id }, include: {
                aboutDatasetInfo: { include: { dataFormatInfo: true, features: true } },
                primaryCategory: { select: { name: true } }, source: { select: { name: true } }, locationInfo: true, birthInfo: true
            }
        });
    } catch (error) { throw new Error(`Error fetching dataset by ID: ${error}`); }
};


export { getAllUploadedDatasetHelper, getDatasetByIdHelper };