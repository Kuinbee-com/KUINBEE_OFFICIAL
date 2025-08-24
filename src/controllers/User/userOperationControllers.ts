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
        const { id, fileFormat, isPaid, isAgreedToLicense } = req.body;
        if (!id) return void res.status(400).json({ success: false, message: "Missing datasetId fields" });
        if (!fileFormat) return void res.status(400).json({ success: false, message: "Missing fileFormat fields" });
        if (isPaid === undefined && typeof isPaid !== "boolean") return void res.status(400).json({ success: false, message: "Missing isPaid fields" });
        if (!isAgreedToLicense) return void res.status(403).json({ success: false, message: "You must agree to the license terms to download this dataset." });

        const [downloadURL] = await Promise.all([
            generateDatasetDownloadURLHelper(id, fileFormat, isPaid),
            await prisma.datasetLookup.upsert({ where: { userId_datasetId: { userId: req.id as string, datasetId: id, }, }, update: {}, create: { user: { connect: { id: req.id as string } }, dataset: { connect: { id } }, }, })]);
        return void res.status(200).json({ success: true, data: { downloadURL } });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};

export { upsertUserProfileInfo, generateDatasetDownloadURL };