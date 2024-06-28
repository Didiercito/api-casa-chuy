import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';



dotenv.config();

const secretKey: any = process.env.SECRET_KEY;



export const generateToken = async (data: any): Promise<string | null> => {
    try {
        const token = jwt.sign(data, secretKey);
        return token;
    } catch (error) {
        console.error('Error al generar el token:', error);
        return null;
    }
}


