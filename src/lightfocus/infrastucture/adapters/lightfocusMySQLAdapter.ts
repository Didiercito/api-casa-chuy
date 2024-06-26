import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';
import { LightfocusRepository } from '../../domain/interface/lightfocusRepository';
import { LightfocusEntities } from '../../domain/entities/lightfocusEntitis';

dotenv.config();

export class lightfocusMySQLAdapter implements LightfocusRepository {
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

    async getLightFocus(): Promise<LightfocusEntities[]> {
        const [rows]: any = await this.pool.query('SELECT * FROM Lightfocus');
        return rows.map((row: any) => new LightfocusEntities(
            row.idLightfocus,
            row.namelightfocus,
            row.status,
            row.userName,
            row.userRole,
            row.timesTurnedOn,
            row.userId
        ));
    }

    async updateLightFocusStatus(id: number, status: string, user: string, userRole: string): Promise<void> {
        await this.pool.query(
            'UPDATE Lightfocus SET status = ?, userName = ?, userRole = ?, timesTurnedOn = timesTurnedOn + IF(status = "ON", 1, 0) WHERE idLightfocus = ?',
            [status, user, userRole, id]
        );
    }

    async logAction(id: number, action: string, user: string, userRole: string): Promise<void> {
        await this.pool.query(
            'INSERT INTO LightfocusLog (idLightfocus, action, user, userRole) VALUES (?, ?, ?, ?)',
            [id, action, user, userRole]
        );
    }
}