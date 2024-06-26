import { createConnection } from "mysql2";
import dotenv from 'dotenv'
dotenv.config();


export const newConnection = createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306
});


export async function connect() {
    newConnection.connect((err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('DB is connected');
    })
}