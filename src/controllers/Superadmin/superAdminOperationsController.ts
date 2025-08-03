import { hashPassword } from '../../utility/common/security/crypto';
import { Response } from "express";
import { Prisma, Role } from "@prisma/client";
import { checkAdminConflicts, checkAuthEmailConflict } from "../../helpers/Superadmin/conflictCheckHelper";
import { createDefaultPassword } from "../../utility/common/security/crypto";
import { IUnifiedResponse } from "../../utility/common/interfaces/customeResponseInterface";
import { ICustomeSuperAdminRequest } from "../../utility/common/interfaces/customeRequestInterface";
import { prisma } from '../../client/prisma/getPrismaClient';

const addAdmin = async (req: ICustomeSuperAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    const { personalEmailId, officialEmailId, phNo, alternativePhNo, title, firstName, middleName, lastName, personalInfo, permissions } = req.body;
    try {
        if (!req.id) return void res.status(400).json({ success: false, message: 'superadmin id, error something went wrong' });

        const [authConflict, adminConflict] = await Promise.all([checkAuthEmailConflict({ personalEmailId, officialEmailId }), checkAdminConflicts({ personalEmailId, officialEmailId, phNo })]);

        if (authConflict) return void res.status(400).json({ success: false, message: `${authConflict.field} already exists with value: ${authConflict.value}` });
        if (adminConflict) return void res.status(400).json({ success: false, message: `${adminConflict.field} already exists with value: ${adminConflict.value}` });


        const defaultPassword = createDefaultPassword(firstName);
        const hashedPassword = await hashPassword(defaultPassword);

        const result = await prisma.$transaction(async (tx) => {
            return await tx.admin.create({
                data: {
                    title, firstName, middleName, lastName, officialEmailId, personalEmailId, phNo, alternativePhNo,
                    createdBy: { connect: { id: req.id } },
                    personalInfo: { create: { ...personalInfo, dob: new Date(personalInfo.dob) } },
                    permissions: { create: { permissions: permissions, updatedBySuperAdminId: req.id } },
                    Auth: { create: { emailId: officialEmailId, password: hashedPassword, role: Role.ADMIN } }
                }
            });
        });
        return void res.status(201).json({ success: true, data: { defaultPassword, adminId: result.id } });
    } catch (error) {
        console.error('Error creating admin:', error);
        return void res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
const deleteAdmin = async (req: ICustomeSuperAdminRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const deletedAdmin = await prisma.admin.delete({ where: { id: req.inputAdminId }, include: { personalInfo: true, permissions: true, Auth: true } });
        return void res.status(200).json({ success: true, data: { deletedAdmin } });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') return void res.status(404).json({ success: false, message: 'Admin not found' });
        }
        console.error('Error deleting admin:', error);
        return void res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export { addAdmin, deleteAdmin };
