import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import { JWT_SECRET } from '../../../env';


export const generateAuthToken = (payload: object, expiresIn: SignOptions['expiresIn'] = '1h'): string => {
    try {
        const jwtToken = jwt.sign(payload, JWT_SECRET, { expiresIn });

        return encryptData(jwtToken);
    } catch (error) {
        throw new Error('Failed to generate token');
    }
}

export const decodeAuthToken = <T>(token: string): { decodedToken: JwtPayload & T | null, message?: never } | { decodedToken?: never, message: string, error: unknown } => {
    try {
        const jwtToken = decryptData(token);
        const decodedToken = jwt.verify(jwtToken, JWT_SECRET) as JwtPayload & T;
        return { decodedToken };
    } catch (error) {
        return { message: 'This link has been expired', error };
    }
};


export const encryptData = (data: string): string => Buffer.from(data, 'utf-8').toString('base64');
export const decryptData = (data: string): string => Buffer.from(data, 'base64').toString('utf-8');




// TODO CREATE A FUNCTION FOR SHIFTING JWT TOKEN USING CIPHER ALGORITHM