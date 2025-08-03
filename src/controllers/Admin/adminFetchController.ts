import { ICustomAdminRequest } from "../../interfaces/custom/customeRequestInterface";
import { Response } from "express";
import { IUnifiedResponse } from "../../interfaces/custom/customeResponseInterface";
import { prisma } from "../../client/prisma/getPrismaClient";


// **************************** CATEGORY CONTROLLER ****************************
const getAllCategories = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};




// **************************** SOURCE CONTROLLER ****************************
const getAllSources = async (req: ICustomAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const sources = await prisma.source.findMany();
        res.status(200).json({ success: true, data: sources });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export { getAllCategories, getAllSources };