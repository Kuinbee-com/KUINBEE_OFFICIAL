// utils/handleCatchError.ts
import { Response, Request } from 'express';
import { Prisma } from '@prisma/client';

export function handleCatchError(req: Request, res: Response, error: unknown) {
    console.error(`Error in ${req.method} ${req.originalUrl}:`, error);

    if (error instanceof Prisma.PrismaClientValidationError) {
        const errorMessage = error.message;
        const missingArgMatch = errorMessage.match(/Argument `(\w+)` is missing\./);

        if (missingArgMatch) return res.status(400).json({ success: false, message: `Missing required field: ${missingArgMatch[1]}`, field: missingArgMatch[1] });
        const invalidTypeMatch = errorMessage.match(/Argument `(\w+)`: (.+)/);
        if (invalidTypeMatch) return res.status(400).json({ success: false, message: `Invalid field: ${invalidTypeMatch[1]} - ${invalidTypeMatch[2]}`, field: invalidTypeMatch[1] });

        const operationMatch = errorMessage.match(/Invalid `([^`]+)` invocation/);
        const operation = operationMatch ? operationMatch[1] : 'database operation';
        return res.status(400).json({ success: false, message: `Validation error in ${operation}`, details: 'Invalid data structure provided' });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            const target = error.meta?.target as string[] | undefined; const field = target?.[0] || 'field';
            return res.status(409).json({ success: false, message: `Duplicate value for ${field}`, field: field });
        }
        if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Record not found' });
        return res.status(400).json({ success: false, message: `Database error: ${error.code}`, details: error.meta });
    }
    return res.status(500).json({ success: false, message: 'Internal server error' });
}