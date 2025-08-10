import { Request, Response, NextFunction } from "express";
import { IUnifiedResponse } from "../../interfaces/custom/customeResponseInterface";
import { emailInputValidation, strongPasswordValidation } from "../../validations/inputValidation";

const handleUserRegistrationValidation = (req: Request, res: Response<IUnifiedResponse>, next: NextFunction) => {
    const { name, emailId, phNo, password } = req.body;

    if (!name) return res.status(400).json({ success: false, message: "Name is required" });
    if (!emailId) return res.status(400).json({ success: false, message: "Email ID is required" });
    if (!phNo) return res.status(400).json({ success: false, message: "Phone number is required" });
    if (!password) return res.status(400).json({ success: false, message: "Password is required" });

    if (name.length < 3) return res.status(400).json({ success: false, message: "Name must be at least 3 characters long" });
    if (!emailInputValidation(emailId)) return res.status(400).json({ success: false, message: "Invalid email ID" });
    if (phNo.length < 10) return res.status(400).json({ success: false, message: "Phone number must be at least 10 digits long" });
    if (!strongPasswordValidation(password)) return res.status(400).json({ success: false, message: "Weak password" });

    next();
};

export { handleUserRegistrationValidation };