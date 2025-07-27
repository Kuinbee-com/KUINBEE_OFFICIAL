import { Response, NextFunction } from 'express';
import { ICustomeSuperAdminRequest } from '../../utility/common/interfaces/customeRequestInterface';
import { KUINBEE_SUPER_ADMIN_IDENTITY_CODE } from '../../env';

const requireAdminAuth = async (req: ICustomeSuperAdminRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (req.role !== 'SUPERADMIN') return void res.status(403).json({ success: false, error: 'Access denied. Super Admins only.' });
        if (req.identityToken === undefined || req.authToken === undefined || req.identityToken !== KUINBEE_SUPER_ADMIN_IDENTITY_CODE)
            return void res.status(401).json({ success: false, error: 'Authentication token is missing or invalid' });

        req.AdminPermissions = ['READ', 'WRITE', 'DELETE'];
        return next();
    } catch (error) {
        console.error("need to add handlecatch function here", error);
    }
}

export { requireAdminAuth };