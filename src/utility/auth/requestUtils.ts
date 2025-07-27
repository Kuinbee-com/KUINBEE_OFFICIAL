import { ICustomeSuperAdminRequest } from "../common/interfaces/customeRequestInterface";
import { Response, NextFunction } from "express";

type IKuinbeeCombinedRequest = ICustomeSuperAdminRequest; // add for all types of users here 
const extractIdFromParams = async (req: IKuinbeeCombinedRequest, _: Response, next: NextFunction): Promise<void> => {
    req.inputAdminId = req.params.id;
    next();
}

const extractIdFromBody = async (req: IKuinbeeCombinedRequest, _: Response, next: NextFunction): Promise<void> => {
    req.inputAdminId = req.body.id;
    next();

};

export { extractIdFromParams, extractIdFromBody };