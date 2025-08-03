import { AdminPermissionOptions, RoleOptions } from '../../constants/modelConstants';
import e, { Request } from "express";
import { SuperAdminPermissionsOptions } from "../../constants/modelConstants";


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
    paramsId?: string;
    bodyId?: string;
}


interface ICustomeSuperAdminRequest extends ICustomRequest {
    AdminPermissions?: SuperAdminPermissionsOptions[];
}


interface ICustomAdminRequest extends ICustomRequest {
    AdminPermissions?: AdminPermissionOptions[];

}

export { ICustomLogInRequest, ICustomRequest, ICustomeSuperAdminRequest, ICustomAdminRequest };