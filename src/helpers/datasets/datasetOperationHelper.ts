import { createPresignedDownloadUrl } from "../../client/aws/helpers/presignedUrls";
import { prisma } from "../../client/prisma/getPrismaClient";
import { getDatasetS3Key } from "../../constants/awsConstants";
import { FileFormatOptions } from "../../constants/modelConstants";

const generateDatasetDownloadURLHelper = async (id: string, fileFormat: FileFormatOptions, isPaid: boolean): Promise<string> => {
    const key = getDatasetS3Key(id, isPaid, fileFormat);
    const dataset = await prisma.dataset.findUnique({ where: { id, uploaded: true } });
    if (!dataset) throw new Error("Dataset not found or it's not uploaded yet");
    return await createPresignedDownloadUrl(key);
};

export { generateDatasetDownloadURLHelper };
