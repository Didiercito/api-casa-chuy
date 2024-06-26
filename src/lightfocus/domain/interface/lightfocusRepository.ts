import { LightfocusEntities } from '../entities/lightfocusEntitis';

export interface LightfocusRepository{
    getLightFocus(): Promise<LightfocusEntities[]>;
    updateLightFocusStatus(id: number, status: string, user: string, userRole: string): Promise<void>;
    logAction(id: number, action: string, user: string, userRole: string): Promise<void>;
}
