import { prisma } from "../../client/prisma/getPrismaClient";

const getAllUploadedDatasetHelper = async () => {
    try {
        const datasets = await prisma.dataset.findMany({
            where: { uploaded: true },
            select: {
                id: true, title: true, isPaid: true, price: true, _count: { select: { DatasetLookup: true } }, primaryCategory: { select: { name: true } }, source: { select: { name: true } },
                aboutDatasetInfo: { select: { overview: true, dataFormatInfo: { select: { fileFormat: true } } } }, locationInfo: true, birthInfo: { select: { lastUpdatedAt: true } }
            },
        });
        return datasets.map(dataset => ({
            id: dataset.id, title: dataset.title, isPaid: dataset.isPaid, price: dataset.price,
            fileFormat: dataset.aboutDatasetInfo?.dataFormatInfo?.fileFormat, category: dataset.primaryCategory?.name,
            source: dataset.source?.name, totalDownloads: dataset._count.DatasetLookup, locationInfo: dataset.locationInfo,
            lastUpdatedAt: dataset.birthInfo?.lastUpdatedAt
        }));
    } catch (error) { throw new Error("Error fetching uploaded datasets"); }
};

const getDatasetByIdHelper = async (id: string) => {
    try {
        return await prisma.dataset.findUnique({ where: { id }, include: { aboutDatasetInfo: { include: { dataFormatInfo: true, features: true } }, locationInfo: true, birthInfo: true } });
    } catch (error) { throw new Error("Error fetching dataset by ID"); }
};


export { getAllUploadedDatasetHelper, getDatasetByIdHelper };