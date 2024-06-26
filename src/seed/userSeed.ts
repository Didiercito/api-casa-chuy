import { userEntities } from "../auth/domain/entities/userEntities";
import { newConnection } from "../database/dbConfig";
import bcrypt from 'bcrypt';

export const User: Omit<userEntities, 'id'>[] = [
    {
        name: "Didier",
        rol: "Padre",
        password: "soyelpapa",
        email: 'testemail@gmail.com'
    },
    {
        name: "Margarita",
        rol: "Madre",
        password: "soylamama",
        email: 'testemail@gmail.com'
    },
    {
        name: "Joel",
        rol: "Invitado",
        password: "soyelinvitado",
        email: 'testemail@gmail.com'
    },
    {
        name: "Jesús",
        rol: "Ratero",
        password: "soyelratero",
        email: 'testemail@gmail.com'
    }
];

export const encriptedPassword = async () => {
    const encryptedUsers = await Promise.all(User.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
            ...user,
            password: hashedPassword
        };
    }));

    const checkUserExists = (user: any) => {
        return new Promise((resolve, reject) => {
            const checkQuery = 'SELECT COUNT(*) as count FROM users WHERE name = ?';
            newConnection.query(checkQuery, [user.name], (err, results: any) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0].count > 0);
            });
        });
    };

    let allUsersExist = true;

    for (const user of encryptedUsers) {
        try {
            const userExists = await checkUserExists(user);
            if (!userExists) {
                allUsersExist = false;
                const insertQuery = 'INSERT INTO users (name, rol, password, email) VALUES (?, ?, ?, ?)';
                await new Promise((resolve, reject) => {
                    newConnection.query(insertQuery, [user.name, user.rol, user.password, user.email], (err, results) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(results);
                    });
                });
            }
        } catch (err) {
            console.error('Error processing user:', err);
        }
    }

    if (allUsersExist) {
        console.log('Todos los usuarios ya existen');
    } else {
        console.log('Usuarios insertados correctamente');
    }
};

