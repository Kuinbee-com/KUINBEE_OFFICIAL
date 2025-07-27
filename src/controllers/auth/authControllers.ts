import { Response } from "express";
import { IUnifiedResponse } from "../../utility/common/interfaces/customeResponseInterface";
import { ICustomLogInRequest } from "../../utility/common/interfaces/customeRequestInterface";
import { verifyPassword } from "../../utility/common/security/crypto";
import { prisma } from "../../client/getPrismaClient";
import { generateAuthToken } from "../../utility/common/security/jwtUtils";
import { IMinimalLoginToken } from "../../utility/common/interfaces/tokenInterface";
import { KUINBEE_SUPER_ADMIN_IDENTITY_CODE } from "../../env";

const loginPassword = async (req: ICustomLogInRequest, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const { emailId, password } = req.body;
        const user = await prisma.auth.findUnique({ where: { emailId }, include: { Admin: { include: { permissions: true } } } });

        if (!user) return void res.status(404).json({ success: false, error: 'Invalid email or user not found' });
        if (!(await verifyPassword(password, user.password))) return void res.status(401).json({ success: false, error: 'Incorrect password' });

        const jwtPayload = {
            id: user.id, email: user.emailId, role: user.role,
            ...(user.role === 'ADMIN' && { adminId: user.adminId ?? undefined, adminPermissions: user.Admin?.permissions?.permissions.map(p => p) ?? [] }),
            ...(user.role === 'SUPERADMIN' && { superAdminId: user.superAdminId ?? undefined }),
            ...(user.role === 'USER' && { userId: user.userId ?? undefined }),
            identityCode: KUINBEE_SUPER_ADMIN_IDENTITY_CODE
        } satisfies IMinimalLoginToken;

        const token = generateAuthToken(jwtPayload);
        return void res.status(200).json({ success: true, data: { token, identityCode: KUINBEE_SUPER_ADMIN_IDENTITY_CODE } });
    } catch (error) {
        return void res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export { loginPassword };