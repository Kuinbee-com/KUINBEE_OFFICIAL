import { AdminPermissionOptions, adminPermissionOptions } from './../../constants/modelConstants';
import { prisma } from "../../client/prisma/getPrismaClient";

export const getAdminPermissions = async (id: string): Promise<AdminPermissionOptions[]> => {
    const admin = await prisma.admin.findUnique({ where: { id }, include: { permissions: { select: { permissions: true } } } });
    return admin?.permissions?.permissions as AdminPermissionOptions[] || [];
};