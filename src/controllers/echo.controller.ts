// src/controllers/echo.controller.ts
import Fastify from 'fastify';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { EchoService } from '../services/echo.service.js';

export class EchoController {
    private echoService: EchoService;

    constructor({ echoService }: { echoService: EchoService }) {
        this.echoService = echoService;
    }

    async handlePing(req: FastifyRequest, reply: FastifyReply) {
        const data = await this.echoService.getHealth();
        return reply.send(data);
    }

    async handleEcho(req: FastifyRequest<{ Body: { name: string } }>, reply: FastifyReply) {
        const { name } = req.body;
        const message = await this.echoService.performEcho(name);
        return reply.send({ message });
    }
}