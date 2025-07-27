import { AdminPermissions } from "@prisma/client";
import { RoleOptions } from "../../../constants/modelConstants";

export interface IMinimalLoginToken {
    id: string;
    email: string;
    role?: RoleOptions;
    superAdminId?: string;
    adminId?: string;
    userId?: string;
    adminPermissions?: AdminPermissions['permissions'];
    identityCode: string;
};
