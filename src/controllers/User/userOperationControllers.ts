import { prisma } from "../../client/prisma/getPrismaClient";
import { Response } from "express";
import { IUnifiedResponse } from "../../interfaces/custom/customeResponseInterface";
import { ICustomRequest } from "../../interfaces/custom/customeRequestInterface";
import { IUserProfile } from "../../interfaces/custom/customeInterfaces";
import { handleCatchError } from '../../utility/common/handleCatchErrorHelper';
import { generateDatasetDownloadURLHelper } from '../../helpers/datasets/datasetOperationHelper';

const upsertUserProfileInfo = async (req: ICustomRequest, res: Response<IUnifiedResponse>) => {
    try {
        const { bio, city, country, gender, occupation, institution } = req.body as IUserProfile;
        const userId = req.id;
        await prisma.user.update({
            where: { id: userId },
            data: {
                UserProfileInfo: {
                    upsert: {
                        create: { bio, city, country, gender, occupation, institution }, update: { bio, city, country, gender, occupation, institution }
                    }
                }
            }
        }); return res.status(200).json({ success: true });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};

const generateDatasetDownloadURL = async (req: ICustomRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const { datasetId, fileFormat, isPaid, userId, isAgreedToLicense } = req.body;
        if (!isAgreedToLicense) return void res.status(403).json({ success: false, message: "You must agree to the license terms to download this dataset." });
        const [downloadURL] = await Promise.all([
            generateDatasetDownloadURLHelper(datasetId, fileFormat, isPaid),
            await prisma.datasetLookup.upsert({ where: { userId_datasetId: { userId, datasetId, }, }, update: {}, create: { user: { connect: { id: userId } }, dataset: { connect: { id: datasetId } }, }, })]);
        return void res.status(200).json({ success: true, data: { downloadURL } });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};

export { upsertUserProfileInfo, generateDatasetDownloadURL };