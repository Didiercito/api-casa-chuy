import { LightfocusRepository } from "../../domain/interface/lightfocusRepository";
import { isAuthorized } from '../../../middlewares/jwt';

export class TurnOnUseCase {
    constructor(private lightfocusRepository: LightfocusRepository) {}

    async execute(id: number, user: string, userRole: string): Promise<void> {
        if (!isAuthorized(userRole, 'turn-on')) {
            throw new Error('No tienes permisos para realizar esta acción');
        }

        try {
            await this.lightfocusRepository.updateLightFocusStatus(id, 'on', user, userRole);
            await this.lightfocusRepository.logAction(id, 'on', user, userRole);
        } catch (error) {
            console.error('Error en la actualización de estado:', error);
            throw error;
        }
    }

    async getLightFocus(id: number) {
        const lightFocus = await this.lightfocusRepository.getLightFocus();
        return lightFocus.find(lf => lf.idLightfocus === id);
    }
}

export class TurnOffUseCase {
    constructor(private lightfocusRepository: LightfocusRepository) {}

    async execute(id: number, user: string, userRole: string): Promise<void> {
        if (!isAuthorized(userRole, 'turn-off')) {
            throw new Error('No tienes permisos para realizar esta acción');
        }

        try {
            await this.lightfocusRepository.updateLightFocusStatus(id, 'off', user, userRole);
            await this.lightfocusRepository.logAction(id, 'off', user, userRole);
        } catch (error) {
            console.error('Error en la actualización de estado:', error);
            throw error;
        }
    }

    async getLightFocus(id: number) {
        const lightFocus = await this.lightfocusRepository.getLightFocus();
        return lightFocus.find(lf => lf.idLightfocus === id);
    }
    

}

export class GetAllLightFocusUseCase {
    constructor(private lightfocusRepository: LightfocusRepository) {}

    async execute() {
        try {
            return await this.lightfocusRepository.getLightFocus();
        } catch (error) {
            console.error('Error al obtener los focos:', error);
            throw error;
        }
    }
}