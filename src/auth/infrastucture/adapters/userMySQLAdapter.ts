import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';
import { UserRepository } from '../../domain/interface/userRepository';
import { userEntities } from '../../domain/entities/userEntities';
import bcrypt from 'bcrypt';

dotenv.config();

export class userMySQLAdapter implements UserRepository {
    private pool: mysql2.Pool;

    constructor() {
        this.pool = mysql2.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    async verifyUser(email: string, password: string): Promise<userEntities | null> {
        const query = 'SELECT id, name, rol, password, email FROM users WHERE email = ?';
        try {
            const [rows]: [any[], any] = await this.pool.query(query, [email]);

            if (rows.length === 0) {
                return null; 
            }

            for (const user of rows) {
                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (isPasswordValid) {
                    return new userEntities(user.id, user.name, user.rol, user.password, user.email);
                }
            }

            return null; 
        } catch (error) {
            console.error('Error en la verificación de usuario:', error);
            return null; 
        }
    }
}
