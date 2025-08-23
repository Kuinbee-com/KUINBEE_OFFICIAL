import { prisma } from "../../client/prisma/getPrismaClient";

const getAllUploadedDatasetHelper = async () => {
    try {
        // const selectedFields = createProjectionSelect<Prisma.DatasetGetPayload<{ select: { _count: { select: { DatasetLookup: true } } }, include: { aboutDatasetInfo: { include: { dataFormatInfo: true, features: true } }, primaryCategory: true, source: true, locationInfo: true, birthInfo: true } }>>()([
        //     'id', 'title', 'isPaid', 'price', 'aboutDatasetInfo.overview', 'aboutDatasetInfo.dataFormatInfo.fileFormat', 'primaryCategory.name', 'source.name', 'locationInfo', 'birthInfo.lastUpdatedAt'
        // ])
        const datasets = await prisma.dataset.findMany({
            where: { uploaded: true },
            select: {
                id: true, title: true, isPaid: true, price: true, _count: { select: { DatasetLookup: true } }, primaryCategory: { select: { name: true } }, source: { select: { name: true } },
                aboutDatasetInfo: { select: { overview: true, dataFormatInfo: { select: { fileFormat: true } } } }, locationInfo: true, birthInfo: { select: { lastUpdatedAt: true } }
            },
        });
        return datasets.map(dataset => ({
            id: dataset.id, title: dataset.title, isPaid: dataset.isPaid, price: dataset.price, overview: dataset.aboutDatasetInfo?.overview,
            fileFormat: dataset.aboutDatasetInfo?.dataFormatInfo?.fileFormat, category: dataset.primaryCategory?.name,
            source: dataset.source?.name, totalDownloads: dataset._count.DatasetLookup, locationInfo: dataset.locationInfo,
            lastUpdatedAt: dataset.birthInfo?.lastUpdatedAt
        }));
    } catch (error) { throw new Error(`Error fetching uploaded datasets: ${error}`); }
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