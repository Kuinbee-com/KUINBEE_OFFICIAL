import { Response } from "express";
import { ICustomRequest } from "../../interfaces/custom/customeRequestInterface";
import { IUnifiedResponse } from "../../interfaces/custom/customeResponseInterface";
import { handleCatchError } from "../../utility/common/handleCatchErrorHelper";
import { prisma } from "../../client/prisma/getPrismaClient";

const getUserProfileInfo = async (req: ICustomRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const userId = req.id;
        const userProfile = await prisma.userProfileInfo.findUnique({
            where: { userId }, select: { bio: true, city: true, country: true, gender: true, occupation: true, institution: true }
        });
        if (!userProfile) return void res.status(404).json({ success: false, message: "User Profile not found" });
        return void res.status(200).json({ success: true, data: userProfile });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};


export { getUserProfileInfo };