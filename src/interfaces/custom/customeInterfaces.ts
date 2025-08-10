import { Prisma } from "@prisma/client";
import { IAdmin, IDatasetModel } from "../model/modelnterface";
import { AdminPermissionOptions, FileFormatOptions } from "../../constants/modelConstants";

export type AdminBaseInput = Omit<IAdmin, "createdBy" | "personalInfo" | "permissions" | "Auth" | "createdAt" | "personalInfoId" | "adminPermissionsId">
export type PersonalInfoInput = Omit<Prisma.PersonalInfoCreateInput, "id" | "Admin" | "SuperAdmin">;

export interface ICustomAddAdmin extends AdminBaseInput {
    personalInfo: PersonalInfoInput;
    permissions: AdminPermissionOptions[];
}

export interface IDatasetBaseInput {
    title: string;
    primaryCategoryId: string;
    sourceId: string;
    price: number;
    isPaid: boolean;
    license: string;
    superTypes: string;
    datasetUniqueId: string;
    aboutDatasetInfo?: IAboutDatasetInfo;
    birthInfo?: IBirthInfo;
    locationInfo?: ILocationInfo;
    securityInfo?: ISecurityInfo;
    categories?: Array<{ id: string; }>
}

export interface IAboutDatasetInfo {
    overview: string;
    description: string;
    dataQuality: string;
    dataFormatInfo: {
        rows: number;
        cols: number;
        fileFormat: FileFormatOptions[number];
    };
    features?: Array<{ content: string; }>;
}


export interface IBirthInfo {
    creatorAdminId: string;
    lastUpdaterAdminId: string;
}

export interface ILocationInfo {
    region: string;
    country: string;
    state: string;
    city: string;
}

export interface ISecurityInfo {
    currentEncryptionSecret: string;
    masterSecret: string;
}
