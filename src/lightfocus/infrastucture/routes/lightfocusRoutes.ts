import express, { Router } from 'express';
import { lightFocusController } from '../dependencies';
import { authenticateToken } from '../../../middlewares/jwt';

export const lightFocusRouter = Router();

lightFocusRouter.post('/turn-on/:id', authenticateToken, lightFocusController.turnOn.bind(lightFocusController));
lightFocusRouter.post('/turn-off/:id', authenticateToken, lightFocusController.turnOff.bind(lightFocusController));
lightFocusRouter.get('/all', authenticateToken, lightFocusController.getAll.bind(lightFocusController));