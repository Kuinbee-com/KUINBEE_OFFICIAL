import { Prisma } from "@prisma/client";

import { Response } from "express";
import { createProjectionSelect } from "../../utility/projectionTypes";
import { ICustomeSuperAdminRequest } from "../../interfaces/custom/customeRequestInterface";
import { IUnifiedResponse } from "../../interfaces/custom/customeResponseInterface";
import { prisma } from "../../client/prisma/getPrismaClient";
import { handleCatchError } from "../../utility/common/handleCatchErrorHelper";

const getAllAdmins = async (req: ICustomeSuperAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    const selectFields = createProjectionSelect<Prisma.AdminGetPayload<{ include: { personalInfo: true; permissions: true, createdBy: true } }>>()(
        ['id', 'title', 'firstName', 'middleName', 'lastName', 'officialEmailId', 'personalEmailId', 'permissions.permissions', 'phNo', 'createdBy.firstName', 'createdBy.middleName', 'createdBy.lastName']);
    try {
        const allAdmins = await prisma.admin.findMany({ select: selectFields });
        return void res.status(200).json({ success: true, data: { allAdmins } })

    } catch (error) {
        return void handleCatchError(req, res, error);
    }
};

const getAdmin = async (req: ICustomeSuperAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const admin = await prisma.admin.findUnique({ where: { id: req.paramsId }, include: { personalInfo: true, permissions: true, createdBy: true } });
        return void res.status(200).json({ success: true, data: { admin } });
    } catch (error) {
        return void handleCatchError(req, res, error);
    }
}


export { getAllAdmins, getAdmin };