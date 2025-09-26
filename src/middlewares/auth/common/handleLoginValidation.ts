import { NextFunction, Request, Response } from "express";
import { ICustomLogInRequest } from "../../../interfaces/custom/customRequestInterface";
import { IUnifiedResponse } from "../../../interfaces/custom/customResponseInterface";
import { emailInputValidation } from "../../../validations/inputValidation";



// ************************************** LOGIN INPUT VALIDATION **************************************

const loginInputValidation = async (req: ICustomLogInRequest, res: Response<IUnifiedResponse>, next: NextFunction): Promise<void> => {
    const { emailId, password } = req.body;
    if (!emailId || !password) return void res.status(400).json({ success: false, error: 'EmailId and password is required' });
    if (!emailInputValidation(emailId)) return void res.status(400).json({ success: false, error: 'Invalid email format.' });


    return next();
};



export { loginInputValidation };