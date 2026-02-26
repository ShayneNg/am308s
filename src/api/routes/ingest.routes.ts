import type { FastifyInstance } from 'fastify';

export async function ingestRoutes(fastify: FastifyInstance) {
    fastify.post('/ingest', async (request, reply) => {
        // Change .handleIngest to .receive
        return request.diScope.resolve('ingestController').receive(request, reply);
    });

    // Dedicated route for Bobcat Speedtests
    fastify.post('/ingest/bobcat', async (request, reply) => {
        const ingestService = fastify.diContainer.resolve('ingestService');
        
        // No need for a 256-bit key if it's internal LAN, 
        // but you can add basic auth if you want.
        await ingestService.handleBobcatPush(request.body);

        return reply.status(201).send({ status: 'captured' });
    });
}