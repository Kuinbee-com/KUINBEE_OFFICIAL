import { UserProfileInfo } from './../../../node_modules/.prisma/client/index.d';
import { prisma } from "../../client/prisma/getPrismaClient";
import { Response } from "express";
import { IUnifiedResponse } from "../../interfaces/custom/customeResponseInterface";
import { ICustomRequest } from "../../interfaces/custom/customeRequestInterface";
import { IUserProfile } from "../../interfaces/custom/customeInterfaces";
import { handleCatchError } from '../../utility/common/handleCatchErrorHelper';

const upsertUserProfileInfo = async (req: ICustomRequest, res: Response<IUnifiedResponse>) => {
    try {
        const { bio, city, country, gender, occupation, institution } = req.body as IUserProfile;
        const userId = req.id;
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                UserProfileInfo: {
                    upsert: {
                        create: { bio, city, country, gender, occupation, institution },
                        update: { bio, city, country, gender, occupation, institution }
                    }
                }
            }
        });
        return res.status(200).json({ success: true });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};


export { upsertUserProfileInfo };