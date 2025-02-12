import { LightfocusEntities } from '../entities/lightfocusEntitis';

export interface LightfocusRepository {
    getLightFocus(): Promise<LightfocusEntities[]>;
    updateLightFocusStatus(id: number, status: string, user: string, userRole: string, userId: number): Promise<void>;
    logAction(id: number, action: string, user: string, userRole: string, userId: number, timeTurnedOn: Date): Promise<void>;
    getLightFocusHistory(): Promise<any>;
    getLightFocusById(id: number): Promise<LightfocusEntities>;  // Nuevo método
}
