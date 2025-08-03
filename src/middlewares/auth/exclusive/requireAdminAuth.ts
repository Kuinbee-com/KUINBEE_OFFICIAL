import { NextFunction, Response } from "express";
import { ICustomAdminRequest } from "../../../interfaces/custom/customeRequestInterface";
import { KUINBEE_ADMIN_IDENTITY_CODE } from "../../../env";
import { getAdminPermissions } from "../../../helpers/Admin/adminHelper";

const requireAdminAuth = async (req: ICustomAdminRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (req.role !== 'ADMIN') return void res.status(403).json({ success: false, error: 'Access denied. Admins only.' });
        if (req.identityToken === undefined || req.authToken === undefined || req.identityToken !== KUINBEE_ADMIN_IDENTITY_CODE)
            return void res.status(401).json({ success: false, error: 'Authentication token is missing or invalid' });
        req.AdminPermissions = await getAdminPermissions(req.id as string);
        return next();
    } catch (error) {
        console.error("need to add handlecatch function here", error);
    }
};

export { requireAdminAuth };