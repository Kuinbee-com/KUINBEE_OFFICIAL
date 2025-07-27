import { ICustomeSuperAdminRequest } from "../../utility/common/interfaces/customeRequestInterface";
import { IUnifiedResponse } from "../../utility/common/interfaces/customeResponseInterface";
import { NextFunction, Response } from "express";
import { emailInputValidation } from "../../validations/inputValidation";
import { adminPersonalInfoValidation } from "../../validations/personalInfoValidation";
import { ICustomAddAdmin } from "../../utility/common/interfaces/customeInterfaces";

export const handleAddAdminValidation = async (req: ICustomeSuperAdminRequest, res: Response<IUnifiedResponse>, next: NextFunction): Promise<void> => {
    try {
        if (!req.body) return void res.status(400).json({ success: false, error: 'body is missing' });

        const adminData: ICustomAddAdmin = req.body;
        const requiredFields: (keyof ICustomAddAdmin)[] = ["title", "firstName", "lastName", "personalEmailId", "officialEmailId", "phNo", "personalInfo"];

        for (const field of requiredFields) {
            if (!adminData[field]) return void res.status(400).json({ success: false, error: `${field} is required.` });
        }

        if (!emailInputValidation(adminData.personalEmailId)) return void res.status(400).json({ success: false, error: "Invalid personal email format." });
        if (!emailInputValidation(adminData.officialEmailId)) return void res.status(400).json({ success: false, error: "Invalid official email format." });

        const personalInfoError = adminPersonalInfoValidation(adminData.personalInfo);
        if (personalInfoError) return void res.status(400).json({ success: false, error: `${personalInfoError} is required.` });
        next();
    } catch (error) {
        return void res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
