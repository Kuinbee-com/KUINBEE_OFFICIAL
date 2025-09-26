import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AWS_S3_BUCKET_NAME } from "../../../env";
import { s3Client } from "../connections/awsConfig";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

export const createPresignedDownloadUrl = async (key: string): Promise<string> => {
    const command = new GetObjectCommand({ Bucket: AWS_S3_BUCKET_NAME, Key: key });
    return await getSignedUrl(s3Client, command, { expiresIn: 600 });
};

export const createPresignedUploadUrl = async (key: string): Promise<string> => {
    const contentType =
        (key.endsWith(".csv")) ? "text/csv" : (key.endsWith(".xlsx")) ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" :
            (key.endsWith('.xml') ? "application/xml" : (key.endsWith('.xls') ? "application/vnd.ms-excel" : undefined));
    const command = new PutObjectCommand({ Bucket: AWS_S3_BUCKET_NAME, Key: key, ...(contentType && { ContentType: contentType }) });
    return await getSignedUrl(s3Client, command, { expiresIn: 600 });
};
