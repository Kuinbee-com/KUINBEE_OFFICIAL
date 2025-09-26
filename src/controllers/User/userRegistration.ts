import { Response, Request } from 'express';
import { IUnifiedResponse } from "../../interfaces/custom/customResponseInterface";
import { prisma } from '../../client/prisma/getPrismaClient';
import { Prisma, Role } from "@prisma/client";
import { hashPassword } from '../../utility/common/security/crypto';

const userRegistration = async (req: Request, res: Response<IUnifiedResponse>): Promise<void> => {
    try {
        const { name, emailId, password, phNo } = req.body;
        const user = await prisma.user.create({ data: { name, email: emailId, phNo }, });
        await prisma.auth.create({
            data: {
                userId: user.id, emailId: emailId as string,
                password: await hashPassword(password), role: Role.USER
            }
        });
        res.status(201).json({ success: true, message: "User registered successfully", });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
            return void res.status(409).json({ success: false, message: "User already exists", });
        res.status(500).json({ success: false, message: "Internal server error", });
    }
};



export { userRegistration };