import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey: string = process.env.SECRET_KEY as string;

interface JwtPayload {
    email: string;
    rol: string;
    [key: string]: any;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }

        (req as any).user = user as JwtPayload;
        next();
    });
};


export const isAuthorized = (role: string, action: string): boolean => {
    const rolesPermissions: { [key: string]: string[] } = {
        Invitado: ['turn-on', 'turn-off'],
        Madre: ['turn-on', 'turn-off'],
        Padre: ['turn-on', 'turn-off'],
        Ratero: [],
    };

    return rolesPermissions[role]?.includes(action) || false;
};
