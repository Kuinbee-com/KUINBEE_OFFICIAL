import { Prisma } from "@prisma/client";
import { prisma } from "../../client/prisma/getPrismaClient";
import { IGetUploadedDatasetQuery } from "../../interfaces/custom/customInterfaces";
const getAllUploadedDatasetHelper = async (query?: IGetUploadedDatasetQuery) => {
    try {
        const { limit, offset, filter, search } = query || {};
        const parsedFilter = filter ? JSON.parse(filter as unknown as string) : {};
        const numLimit = limit ? parseInt(limit as unknown as string, 10) : 10;
        const numOffset = offset ? parseInt(offset as unknown as string, 10) : 0;
        const where: Prisma.DatasetWhereInput = {
            uploaded: true,
            isPaid: parsedFilter?.isPaid !== undefined ? parsedFilter.isPaid : undefined,
            primaryCategoryId: parsedFilter?.category !== undefined ? parsedFilter.category : undefined,
            sourceId: parsedFilter?.source !== undefined ? parsedFilter.source : undefined,
            superType: parsedFilter?.superType !== undefined ? parsedFilter.superType : undefined,
            title: search ? { contains: search, mode: "insensitive" } : undefined
        };
        console.log(where);

        const datasets = await prisma.dataset.findMany({
            where, orderBy: { DatasetLookup: { _count: 'desc' } }, skip: numOffset, take: numLimit,
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