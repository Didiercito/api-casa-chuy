import { Request, Response } from 'express';
import { TurnOnUseCase, TurnOffUseCase, GetAllLightFocusUseCase  } from '../../application/use-case/lightfocusUseCase';

export class LightFocusController {
    constructor(
        private readonly turnOnUseCase: TurnOnUseCase,
        private readonly turnOffUseCase: TurnOffUseCase,
        private readonly getAllLightFocusUseCase: GetAllLightFocusUseCase
    ) {}

    async turnOn(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = (req as any).user;

            if (!user) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }

            await this.turnOnUseCase.execute(Number(id), user.name, user.rol); // Usamos user.name en lugar de user.email

            const lightFocus = await this.turnOnUseCase.getLightFocus(Number(id));

            if (!lightFocus) {
                return res.status(404).json({
                    message: 'LightFocus no encontrado',
                    success: false,
                });
            }

            return res.status(200).json({
                id: lightFocus.idLightfocus,
                nombre: lightFocus.namelightfocus,
                status: lightFocus.status,
                nombre_del_quien_fue: lightFocus.userName,
                rol_del_quien_fue: lightFocus.userRole,
                tiempo_encendido: lightFocus.timesTurnedOn
            });
        } catch (error: any) {
            if (error.message === 'No tienes permisos para realizar esta acción') {
                return res.status(403).json({
                    message: error.message,
                    success: false,
                });
            }

            console.error(error);
            return res.status(500).json({
                message: 'Error en el servidor',
                success: false,
            });
        }
    }

    async turnOff(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = (req as any).user;

            if (!user) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }

            await this.turnOffUseCase.execute(Number(id), user.name, user.rol); // Usamos user.name en lugar de user.email

            const lightFocus = await this.turnOffUseCase.getLightFocus(Number(id));

            if (!lightFocus) {
                return res.status(404).json({
                    message: 'LightFocus no encontrado',
                    success: false,
                });
            }

            return res.status(200).json({
                id: lightFocus.idLightfocus,
                nombre: lightFocus.namelightfocus,
                status: lightFocus.status,
                nombre_del_quien_fue: lightFocus.userName,
                rol_del_quien_fue: lightFocus.userRole,
                tiempo_encendido: lightFocus.timesTurnedOn
            });
        } catch (error: any) {
            if (error.message === 'No tienes permisos para realizar esta acción') {
                return res.status(403).json({
                    message: error.message,
                    success: false,
                });
            }

            console.error(error);
            return res.status(500).json({
                message: 'Error en el servidor',
                success: false,
            });
        }
    }

    async getAll(req: Request, res: Response) {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        if (user.rol === 'Ratero') {
            return res.status(403).json({
                message: 'No tienes permisos para ver esta información',
                success: false,
            });
        }

        try {
            const lightFocuses = await this.getAllLightFocusUseCase.execute();
            
            const mappedLightFocuses = lightFocuses.map(lightFocus => ({
                id: lightFocus.idLightfocus,
                nombre: lightFocus.namelightfocus,
                status: lightFocus.status,
                nombre_del_quien_fue: lightFocus.userName, 
                rol_del_quien_fue: lightFocus.userRole,
                tiempo_encendido: lightFocus.timesTurnedOn
            }));

            return res.status(200).json(mappedLightFocuses); 
        } catch (error) {
            console.error('Error al obtener todos los focos:', error);
            return res.status(500).json({
                message: 'Error en el servidor',
                success: false,
            });
        }
    }
}
