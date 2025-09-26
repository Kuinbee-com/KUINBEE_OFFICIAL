import cors from 'cors';
import { Request, Response, NextFunction } from 'express';

const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    cors({
        origin: (_origin, callback) => { callback(null, true); }, credentials: true
    })(req, res, next);
};

export default corsMiddleware;
