import express, { Router } from 'express';
import { lightFocusController } from '../dependencies';
import { authenticateToken } from '../../../middlewares/jwt';

export const lightFocusRouter = Router();

lightFocusRouter.post('/turn-on/:id', authenticateToken, lightFocusController.turnOn.bind(lightFocusController));
lightFocusRouter.post('/turn-off/:id', authenticateToken, lightFocusController.turnOff.bind(lightFocusController));
lightFocusRouter.get('/events', lightFocusController.sendEvent.bind(lightFocusController));
lightFocusRouter.get('/history',authenticateToken, lightFocusController.getLightFocusHistory.bind(lightFocusController));
lightFocusRouter.post('/send-email',authenticateToken, lightFocusController.sendLightFocusHistoryEmail.bind(lightFocusController));