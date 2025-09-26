import { ICustomAdminRequest, ICustomeSuperAdminRequest } from "../../interfaces/custom/customRequestInterface";
import { Response, NextFunction } from "express";

type IKuinbeeCombinedRequest = ICustomeSuperAdminRequest & ICustomAdminRequest; // add for all types of users here 
const extractIdFromParams = async (req: IKuinbeeCombinedRequest, _: Response, next: NextFunction): Promise<void> => {
    req.paramsId = req.params.id;
    next();
}
const extractIdFromBody = async (req: IKuinbeeCombinedRequest, _: Response, next: NextFunction): Promise<void> => {
    req.bodyId = req.body.id;
    next();
};
export { extractIdFromParams, extractIdFromBody };