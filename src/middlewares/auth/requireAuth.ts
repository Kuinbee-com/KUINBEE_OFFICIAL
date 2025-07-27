import { Response, NextFunction, RequestHandler } from "express";
import { ICustomRequest } from "../../utility/common/interfaces/customeRequestInterface";
import { decodeAuthToken } from "../../utility/common/security/jwtUtils";
import { IMinimalLoginToken } from "../../utility/common/interfaces/tokenInterface";
import { decode } from "jsonwebtoken";

const requireAuth = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const authToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        // const authToken = authHeaderToken && authHeaderToken[1];
        // const identityToken = authHeaderToken && authHeaderToken[1];

        if (!authToken) return void res.status(401).json({ success: false, error: 'Authentication token is missing or invalid' });


        const decoded = decodeAuthToken<IMinimalLoginToken>(authToken);
        const userId = decoded.decodedToken?.userId ?? decoded.decodedToken?.adminId ?? decoded.decodedToken?.superAdminId;
        if (!userId) { res.status(401).json({ success: false, error: 'Invalid authentication token data' }); return; }

        req.id = userId;
        req.authToken = authToken;
        req.role = decoded.decodedToken?.role;
        // ! HERE it SHOULD BE IDENTITY TOKEN 
        req.identityToken = decoded.decodedToken?.identityCode;

        return next();
    } catch (err) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export { requireAuth };