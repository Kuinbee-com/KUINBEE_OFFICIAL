import { Prisma } from "@prisma/client";
import { prisma } from "../../client/getPrismaClient";
import { Response } from "express";
import { createProjectionSelect } from "../../utility/projectionTypes";
import { ICustomeSuperAdminRequest } from "../../utility/common/interfaces/customeRequestInterface";
import { IUnifiedResponse } from "../../utility/common/interfaces/customeResponseInterface";

const getAllAdmins = async (req: ICustomeSuperAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    const selectFields = createProjectionSelect<Prisma.AdminGetPayload<{ include: { personalInfo: true; permissions: true, createdBy: true } }>>()(
        ['id', 'title', 'firstName', 'middleName', 'lastName', 'officialEmailId', 'personalEmailId', 'permissions.permissions', 'phNo', 'createdBy.firstName', 'createdBy.middleName', 'createdBy.lastName']);
    try {
        const allAdmins = await prisma.admin.findMany({ select: selectFields });

        return void res.status(200).json({ success: true, data: { allAdmins } })

    } catch (error) {
        console.log(error)
        return void res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getAdmin = async (req: ICustomeSuperAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const admin = await prisma.admin.findUnique({ where: { id: req.inputAdminId }, include: { personalInfo: true, permissions: true, createdBy: true } });
        return void res.status(200).json({ success: true, data: { admin } });
    } catch (error) {
        return void res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


export { getAllAdmins, getAdmin };