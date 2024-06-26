import { LightfocusEntities } from "../lightfocus/domain/entities/lightfocusEntitis";
import { newConnection } from "../database/dbConfig";

export const Lightfocus: Omit<LightfocusEntities, 'idLightfocus'>[] = [
    {
        namelightfocus: "Sala",
        status: "off",
        userName: "",
        userRole: "",
        timesTurnedOn: 0,
        userId: 0
    },
    {
        namelightfocus: "Baño",
        status: "off",
        userName: "",
        userRole: "",
        timesTurnedOn: 0,
        userId: 0
    },
    {
        namelightfocus: "Garaje",
        status: "off",
        userName: "",
        userRole: "",
        timesTurnedOn: 0,
        userId: 0
    },
    {
        namelightfocus: "Cuarto principal",
        status: "off",
        userName: "",
        userRole: "",
        timesTurnedOn: 0,
        userId: 0
    },
    {
        namelightfocus: "Cocina",
        status: "off",
        userName: "",
        userRole: "",
        timesTurnedOn: 0,
        userId: 0
    }
];

export const seedLightfocus = async () => {
    const checkLightfocusExists = (lightfocus: any) => {
        return new Promise((resolve, reject) => {
            const checkQuery = 'SELECT COUNT(*) as count FROM Lightfocus WHERE namelightfocus = ?';
            newConnection.query(checkQuery, [lightfocus.namelightfocus], (err, results: any) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0].count > 0);
            });
        });
    };

    let allLightfocusExist = true;

    for (const lightfocus of Lightfocus) {
        try {
            const lightfocusExists = await checkLightfocusExists(lightfocus);
            if (!lightfocusExists) {
                allLightfocusExist = false;
                const insertQuery = 'INSERT INTO Lightfocus (namelightfocus, status, userName, userRole, timesTurnedOn, userId) VALUES (?, ?, ?, ?, ?, ?)';
                await new Promise((resolve, reject) => {
                    newConnection.query(insertQuery, [lightfocus.namelightfocus, lightfocus.status, lightfocus.userName, lightfocus.userRole, lightfocus.timesTurnedOn, lightfocus.userId], (err, results) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(results);
                    });
                });
            }
        } catch (err) {
            console.error('Error procesando foco de luz:', err);
        }
    }

    if (allLightfocusExist) {
        console.log('Todos los focos de luz ya existen');
    } else {
        console.log('Focos de la casa insertadamente correctamente');
    }
};
