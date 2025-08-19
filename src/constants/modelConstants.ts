// *################################ CONSTANTS ################################* //
export const roleOptions = ['SUPERADMIN', 'ADMIN', 'USER'] as const;
export const superAdminPermissionsOptions = ['READ', 'WRITE', 'DELETE'] as const;
export const genderOptions = ['MALE', 'FEMALE', 'OTHER'] as const;
export const adminPermissionOptions = ['CREATE', 'UPDATE', 'DELETE'] as const;
export const fileFormatOptions = ['csv', 'xlsx', 'xls', 'xml'] as const;

// *################################ TYPES ################################* //
export type RoleOptions = typeof roleOptions[number];
export type SuperAdminPermissionsOptions = typeof superAdminPermissionsOptions[number];
export type AdminPermissionOptions = typeof adminPermissionOptions[number];
export type GenderOptions = typeof genderOptions[number];
export type FileFormatOptions = typeof fileFormatOptions[number];