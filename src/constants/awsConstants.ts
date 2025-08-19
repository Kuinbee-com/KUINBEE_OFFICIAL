import { FileFormatOptions } from "./modelConstants";

const getFreeDatasetS3Key = (datasetId: string, fileFormat: FileFormatOptions): string => `datasets/free/${datasetId}.${fileFormat}`;
const getPaidDatasetS3Key = (datasetId: string, fileFormat: FileFormatOptions): string => `datasets/paid/${datasetId}.${fileFormat}`;
export const getDatasetS3Key = (datasetId: string, isPaid: boolean, fileFormat: FileFormatOptions): string => isPaid ? getPaidDatasetS3Key(datasetId, fileFormat) : getFreeDatasetS3Key(datasetId, fileFormat);