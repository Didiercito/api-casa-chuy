import { userEntities } from "../entities/userEntities";

export interface UserRepository {
    verifyUser(email: string, password: string): Promise<userEntities | null>;
}