import { Request, Response } from 'express';
import { TurnOnUseCase, TurnOffUseCase, GetLightFocusHistoryUseCase } from '../../application/use-case/lightfocusUseCase';
import { isAuthorized } from '../../../middlewares/jwt';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

const resend = new Resend('re_QKrJS3ES_5notXPyKVVRBnJnKqgHtJi3h');

export class LightFocusController {
    private clients: Response[] = [];

    constructor(
        private readonly turnOnUseCase: TurnOnUseCase,
        private readonly turnOffUseCase: TurnOffUseCase,
        private readonly getLightFocusHistoryUseCase: GetLightFocusHistoryUseCase
    ) { }

    sendEvent(req: Request, res: Response): void {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        this.clients.push(res);
        console.log('Client connected, total clients:', this.clients.length);

        req.on('close', () => {
            this.clients = this.clients.filter(client => client !== res);
            console.log('Client disconnected, total clients:', this.clients.length);
            res.end();
        });

        this.sendLightFocusHistoryToClient(res);
    }

    async turnOn(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const user = (req as any).user;

            if (!user) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }

            if (user.rol === 'Ratero') {
                const ratTemplate = fs.readFileSync(path.resolve(__dirname, '../../../template/catchRat.html'), 'utf-8');
                await resend.emails.send({
                    from: 'onboarding@resend.dev',
                    to: '231193@ids.upchiapas.edu.mx',
                    subject: 'Intento de acceso no autorizado',
                    html: ratTemplate
                });

                return res.status(403).json({
                    message: 'No tienes permisos para realizar esta acción',
                    success: false,
                });
            }

            await this.turnOnUseCase.execute(Number(id), user.name, user.rol, user.id);

            this.sendToAllClients('lightfocus', { id: Number(id), status: 'on' });

            return res.status(200).json({
                message: 'Foco encendido exitosamente',
                success: true,
            });
        } catch (error: any) {
            if (error.message === 'No tienes permisos para realizar esta acción') {
                return res.status(403).json({
                    message: error.message,
                    success: false,
                });
            }

            return res.status(500).json({
                message: 'Error al encender el foco',
                success: false,
            });
        }
    }

    async turnOff(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const user = (req as any).user;

            if (!user) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }

            await this.turnOffUseCase.execute(Number(id), user.name, user.rol, user.id);

            this.sendToAllClients('lightfocus', { id: Number(id), status: 'off' });

            return res.status(200).json({
                message: 'Foco apagado exitosamente',
                success: true,
            });
        } catch (error: any) {
            if (error.message === 'No tienes permisos para realizar esta acción') {
                return res.status(403).json({
                    message: error.message,
                    success: false,
                });
            }

            return res.status(500).json({
                message: 'Error al apagar el foco',
                success: false,
            });
        }
    }

    async getLightFocusHistory(req: Request, res: Response): Promise<Response> {
        try {
            const user = (req as any).user;

            if (!user) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }

            if (!isAuthorized(user.rol, 'view-history')) {
                return res.status(403).json({ message: 'No tienes permisos para ver el historial' });
            }

            const history = await this.getLightFocusHistoryUseCase.execute();

            this.sendToAllClients('lightfocus-history', { historial: history }); // Cambiado aquí

            return res.status(200).json(history);
        } catch (error) {
            console.error('Error al obtener el historial de focos:', error);
            return res.status(500).json({ message: 'Error al obtener el historial de focos' });
        }
    }

    async sendLightFocusHistoryEmail(req: Request, res: Response): Promise<Response> {
        try {
            const user = (req as any).user;

            if (!user) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }

            if (!isAuthorized(user.rol, 'send-email')) {
                return res.status(403).json({ message: 'No tienes permisos para enviar correos' });
            }

            const historyResponse = await this.getLightFocusHistoryUseCase.execute();

            if (!Array.isArray(historyResponse.historial)) {
                console.error('Error: El historial no es un array:', historyResponse);
                return res.status(500).json({ message: 'Error al obtener el historial de focos' });
            }

            const history = historyResponse.historial;
            const htmlTemplate = fs.readFileSync(path.resolve(__dirname, '../../../template/historyLightFocus.html'), 'utf-8');
            const formattedHistory = this.formatHistoryAsHtml(history);
            const htmlContent = htmlTemplate.replace('{{history}}', formattedHistory);

            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: '231193@ids.upchiapas.edu.mx',
                subject: 'Historial de Acciones de Focos',
                html: htmlContent
            });

            return res.status(200).json({ message: 'Correo enviado exitosamente' });
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            return res.status(500).json({ message: 'Error al enviar el correo' });
        }
    }

    private sendToAllClients(event: string, data: any) {
        this.clients.forEach(client => client.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
    }

    private async sendLightFocusHistoryToClient(client: Response) {
        try {
            const history = await this.getLightFocusHistoryUseCase.execute();
            client.write(`event: lightfocus-history\ndata: ${JSON.stringify(history)}\n\n`);
        } catch (error) {
            console.error('Error al enviar el historial de focos al cliente:', error);
        }
    }

    private formatHistoryAsHtml(history: any[]): string {
        return history.map(entry =>
            `<tr>
                <td class="name">${entry.name}</td>
                <td class="${entry.status === 'on' ? 'status-on' : 'status-off'}">
                    <button>${entry.status === 'on' ? 'Encendido' : 'Apagado'}</button>
                </td>
                <td>${entry.userName} (${entry.userRole})</td>
                <td>${entry.timeTurnedOn ? new Date(entry.timeTurnedOn).toLocaleString() : ''}</td>
                <td>${entry.timeTurnedOff ? new Date(entry.timeTurnedOff).toLocaleString() : ''}</td>
            </tr>`
        ).join('');
    }
}
