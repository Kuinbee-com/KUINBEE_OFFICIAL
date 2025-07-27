import { RoleOptions } from './../../../constants/modelConstants';
import { Request } from "express";
import { SuperAdminPermissionsOptions } from "../../../constants/modelConstants";


interface ICustomLogInRequest extends Request {
    body: {
        emailId: string;
        password: string;
    }
}

interface ICustomRequest extends Request {
    id?: string;
    authToken?: string;
    role?: RoleOptions;
    identityToken?: string;
}


interface ICustomeSuperAdminRequest extends ICustomRequest {
    AdminPermissions?: SuperAdminPermissionsOptions[];
    inputAdminId?: string
}
export { ICustomLogInRequest, ICustomRequest, ICustomeSuperAdminRequest };