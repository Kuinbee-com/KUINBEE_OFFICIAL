import { Response } from "express";
import { prisma } from "../../../client/prisma/getPrismaClient";
import { ICustomAdminRequest } from "../../../interfaces/custom/customRequestInterface";
import { IUnifiedResponse } from "../../../interfaces/custom/customResponseInterface";
import { handleCatchError } from "../../../utility/common/handleCatchErrorHelper";


const getAllUsers = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>) => {
    try {
        const [users, totalUsers] = await Promise.all([
            prisma.user.findMany({ select: { id: true, name: true, email: true, phNo: true } }),
            prisma.user.count()
        ]);
        return res.status(200).json({ success: true, data: users, metadata: { totalUsers } });
    } catch (error) { return void handleCatchError(req, res, error); }
}


const getUser = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>) => {
    try {
        const { id } = req.params;
        if (!id) return void res.status(400).json({ success: false, message: 'User ID is required.' });
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true, name: true, email: true, phNo: true, createdAt: true,
                UserProfileInfo: { select: { userProfilePhotoURL: true, bio: true, gender: true, institution: true, occupation: true, city: true, country: true, } },
                datasets: { select: { dataset: { select: { id: true, title: true, isPaid: true, price: true } } } }
            }
        });

        if (!user) return void res.status(404).json({ success: false, message: 'User not found.' });

        return res.status(200).json({ success: true, data: user });
    } catch (error) { return void handleCatchError(req, res, error); }
};


export { getAllUsers, getUser };