

import { Prisma } from "@prisma/client";


// **************************** Model types ****************************
export type FullAuthModel = Prisma.AuthGetPayload<{ include: Prisma.AuthInclude }>;
export type AuthModel = Prisma.AuthGetPayload<object>;
export type PasswordModel = Prisma.PasswordDetailsGetPayload<object>;
export type FullAdminPermissions = Prisma.AdminPermissionsGetPayload<object>;
export type FullAddAdminInputBody = Prisma.AdminGetPayload<object>
export type FullPersonalInfo = Prisma.PersonalInfoGetPayload<object>
export type FullDatasetModel = Prisma.DatasetGetPayload<{ include: Prisma.DatasetInclude, }>;



// **************************** Model Interdfaces ****************************
export type IAuthModel = Omit<FullAuthModel, 'password'>;
export type IPasswordModel = PasswordModel;
export type IFullAdminPermissions = FullAdminPermissions;
export type IPersonalInfo = FullPersonalInfo;
export type IAdmin = FullAddAdminInputBody;
export type IDatasetModel = FullDatasetModel;