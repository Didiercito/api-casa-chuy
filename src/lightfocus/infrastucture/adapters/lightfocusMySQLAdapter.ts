import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';
import { LightfocusRepository } from '../../domain/interface/lightfocusRepository';
import { LightfocusEntities } from '../../domain/entities/lightfocusEntitis';

dotenv.config();

export class LightfocusMySQLAdapter implements LightfocusRepository {
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
            row.userId,
            row.timeTurnedOn,
            row.timeTurnedOff
        ));
    }

    async updateLightFocusStatus(id: number, status: string, user: string, userRole: string, userId: number): Promise<void> {
        await this.pool.query(
            'UPDATE Lightfocus SET status = ?, userName = ?, userRole = ?, timeTurnedOn = IF(? = "on", NOW(), timeTurnedOn), timeTurnedOff = IF(? = "off", NOW(), timeTurnedOff) WHERE idLightfocus = ?',
            [status, user, userRole, status, status, id]
        );
    }

    async logAction(id: number, action: string, user: string, userRole: string, userId: number, timeTurnedOn: Date): Promise<void> {
        const [rows]: any = await this.pool.query('SELECT namelightfocus FROM Lightfocus WHERE idLightfocus = ?', [id]);
        const namelightfocus = rows[0]?.namelightfocus;

        if (!namelightfocus) {
            throw new Error(`No se encontró un foco con id ${id}`);
        }

        await this.pool.query(
            'INSERT INTO LightfocusLog (idLightfocus, namelightfocus, action, user, userRole, userId, timeTurnedOn) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, namelightfocus, action, user, userRole, userId, timeTurnedOn]
        );
    }

    async getLightFocusHistory(): Promise<any> {
        try {
            const query = `
                SELECT lf.namelightfocus, ll.action AS status, u.name AS userName, ll.userRole, ll.timeTurnedOn, ll.createdAt AS timeTurnedOff
                FROM LightfocusLog ll
                INNER JOIN Lightfocus lf ON ll.idLightfocus = lf.idLightfocus
                INNER JOIN users u ON ll.userId = u.id
                ORDER BY ll.createdAt DESC
            `;
            const [rows]: any = await this.pool.query(query);
    
            if (rows.length === 0) {
                return { message: "No hay nada registrado de los focos de luz", historial: [] };
            } else {
                const historial = rows.map((row: any) => ({
                    name: row.namelightfocus,
                    status: row.status,
                    userName: row.userName,
                    userRole: row.userRole,
                    timeTurnedOn: row.timeTurnedOn,
                    timeTurnedOff: row.timeTurnedOff
                }));
                return { message: "Se ha registrado una acción de encendido y apagado", historial };
            }
        } catch (error) {
            console.error('Error al obtener el historial de acciones de focos de luz:', error);
            throw error;
        }
    }

    async getLightFocusById(id: number): Promise<LightfocusEntities> {
        const [rows]: any = await this.pool.query('SELECT * FROM Lightfocus WHERE idLightfocus = ?', [id]);
        if (rows.length === 0) {
            throw new Error(`No se encontró un foco con id ${id}`);
        }
        const row = rows[0];
        return new LightfocusEntities(
            row.idLightfocus,
            row.namelightfocus,
            row.status,
            row.userName,
            row.userRole,
            row.userId,
            row.timeTurnedOn,
            row.timeTurnedOff
        );
    }
}
