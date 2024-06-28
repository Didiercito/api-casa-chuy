import { LightfocusRepository } from '../../domain/interface/lightfocusRepository';
import { isAuthorized } from '../../../middlewares/jwt';

export class TurnOnUseCase {
    constructor(private lightfocusRepository: LightfocusRepository, private sendEvent: (data: any) => void) {}

    async execute(id: number, user: string, userRole: string, userId: number): Promise<void> {
        if (!isAuthorized(userRole, 'turn-on')) {
            throw new Error('No tienes permisos para realizar esta acción');
        }

        const lightFocus = await this.lightfocusRepository.getLightFocusById(id);
        if (lightFocus.status === 'on') {
            throw new Error('El foco ya está encendido');
        }

        try {
            const currentTime = new Date();
            await this.lightfocusRepository.updateLightFocusStatus(id, 'on', user, userRole, userId);
            await this.lightfocusRepository.logAction(id, 'on', user, userRole, userId, currentTime);
            this.sendEvent({ action: 'turn-on', id, status: 'on', user, userId, timeTurnedOn: currentTime });
        } catch (error) {
            console.error('Error en la actualización de estado:', error);
            throw error;
        }
    }
}

export class TurnOffUseCase {
    constructor(private lightfocusRepository: LightfocusRepository, private sendEvent: (data: any) => void) {}

    async execute(id: number, user: string, userRole: string, userId: number): Promise<void> {
        if (!isAuthorized(userRole, 'turn-off')) {
            throw new Error('No tienes permisos para realizar esta acción');
        }

        const lightFocus = await this.lightfocusRepository.getLightFocusById(id);
        if (lightFocus.status === 'off') {
            throw new Error('El foco ya está apagado');
        }

        try {
            const currentTime = new Date();
            await this.lightfocusRepository.updateLightFocusStatus(id, 'off', user, userRole, userId);
            await this.lightfocusRepository.logAction(id, 'off', user, userRole, userId, currentTime);
            this.sendEvent({ action: 'turn-off', id, status: 'off', user, userId, timeTurnedOn: currentTime });
        } catch (error) {
            console.error('Error en la actualización de estado:', error);
            throw error;
        }
    }
}

export class GetLightFocusHistoryUseCase {
    constructor(private lightfocusRepository: LightfocusRepository) {}

    async execute(): Promise<any> {
        try {
            return await this.lightfocusRepository.getLightFocusHistory();
        } catch (error) {
            console.error('Error al obtener el historial de acciones de focos de luz:', error);
            throw error;
        }
    }
}
