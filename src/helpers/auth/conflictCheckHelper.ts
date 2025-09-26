import { prisma } from "../../client/prisma/getPrismaClient";


type AdminUniqueFields = { personalEmailId: string; officialEmailId: string; phNo: number; };
type ConflictResult = { field: keyof AdminUniqueFields; value: string | number } | null;

export async function checkAuthEmailConflict({ personalEmailId, officialEmailId, }: Pick<AdminUniqueFields, "personalEmailId" | "officialEmailId">): Promise<ConflictResult> {
    const existing = await prisma.auth.findFirst({ where: { OR: [{ emailId: personalEmailId }, { emailId: officialEmailId }] } });
    if (!existing) return null;

    if (existing.emailId === personalEmailId) return { field: "personalEmailId", value: personalEmailId };
    if (existing.emailId === officialEmailId) return { field: "officialEmailId", value: officialEmailId };

    return null;
}


export async function checkAdminConflicts({ personalEmailId, officialEmailId, phNo, }: AdminUniqueFields): Promise<ConflictResult> {
    const existing = await prisma.admin.findFirst({ where: { OR: [{ personalEmailId }, { officialEmailId }, { phNo }] } });
    if (!existing) return null;

    if (existing.personalEmailId === personalEmailId) return { field: "personalEmailId", value: personalEmailId };
    if (existing.officialEmailId === officialEmailId) return { field: "officialEmailId", value: officialEmailId };
    if (existing.phNo === BigInt(phNo)) return { field: "phNo", value: phNo };

    return null;
}

