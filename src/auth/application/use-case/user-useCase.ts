import { userEntities } from "../../domain/entities/userEntities";
import { UserRepository } from "../../domain/interface/userRepository";
import { UserValidator } from "../../domain/validators/userValidate";
import { generateToken } from "../jwt/auth";

export class UserLoginUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute(email: string, password: string): Promise<{ user: userEntities | null, token: string | null }> {
        const credentials = new userEntities(0, '', '', password, email);
        const validator = new UserValidator(credentials);
        
        try {
            await validator.invalidHasErrors();
        } catch (error) {
            console.error('Error de validación:', error);
            throw error; 
        }

        try {
            const user = await this.userRepository.verifyUser(email, password);
            if (!user) {
                this.invalidUser(); 
            }

            const token = await generateToken({ email, rol: user?.rol, name: user?.name, id: user?.id }); // Genera el token con el email y el rol
            return { user, token };
        } catch (error) {
            console.error('Error en la verificación de usuario:', error);
            throw error; 
        }
    }

    private invalidUser() {
        const error = new Error('Invalid credentials');
        error.name = 'InvalidCredentialsError';
        throw error;
    }
}
