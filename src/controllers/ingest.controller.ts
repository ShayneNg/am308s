import type { FastifyReply, FastifyRequest } from 'fastify';
import { IngestService } from '../services/ingest.service.js';

export class IngestController {
    private ingestService: IngestService;

    constructor({ ingestService }: { ingestService: IngestService }) {
        this.ingestService = ingestService;
    }

    async receive(req: FastifyRequest<{ Body: { data: string } }>, reply: FastifyReply) {
        const apiKey = req.headers['x-api-key'] as string;

        // Add a safety check for req.body
        if (!req.body || !req.body.data) {
            return reply.status(400).send({ 
            status: 'error', 
            message: 'Missing "data" field in request body' 
            });
        }

        const { data } = req.body;

        const record = await this.ingestService.processGatewayData(data, apiKey);
        
        // Explicit 201 Created for consistency
        return reply.status(201).send({
        status: 'success',
        id: record.id
        });
    }
}