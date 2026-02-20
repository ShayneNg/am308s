import { FastifyInstance } from 'fastify';
import { DataController } from '../controllers/data.controller';

const ingestSchema = {
    body: {
        type: 'object',
        required: ['payload'],
        properties: {
        payload: {
            type: 'string',
            // Enforces exactly 64 valid hex characters (case-insensitive)
            pattern: '^[0-9a-fA-F]{64}$'
        }
        }
    }
    };

    export default async function dataRoutes(fastify: FastifyInstance) {
    const controller = new DataController();

    fastify.post('/ingest', { schema: ingestSchema }, controller.ingestData);
}