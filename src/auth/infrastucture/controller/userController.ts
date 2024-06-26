import { Request, Response } from 'express';
import { UserLoginUseCase } from '../../application/use-case/user-useCase';

export class UserController {
    constructor(private userUseCase: UserLoginUseCase) {}

    async verifyUser(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await this.userUseCase.execute(email, password);

            if (!result.user) {
                return res.status(401).json({
                    message: 'Credenciales inválidas',
                    success: false,
                });
            }

            res.status(200).json({
                message: 'Inicio de sesión exitoso',
                success: true,
                user: {
                    name: result.user.name,
                    rol: result.user.rol,
                    email: result.user.email,
                    id: result.user.id,
                },
                token: result.token,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error en el servidor',
                success: false,
            });
        }
    }
}
