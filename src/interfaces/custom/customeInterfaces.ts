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
    aboutDatasetInfo?: {
        overview: string;
        description: string;
        dataQuality: string;
        dataFormatInfo: {
            rows: number;
            cols: number;
            fileFormat: FileFormatOptions[number];
        };
        features?: Array<{ content: string; }>;
    };

    birthInfo?: {
        creatorAdminId: string;
        lastUpdaterAdminId: string;
    };

    location?: {
        region: string;
        country: string;
        state: string;
        city: string;
    };

    security?: {
        currentEncryptionSecret: string;
        masterSecret: string;
    };

    categories?: Array<{ id: string; }>
}