import type { FastifyInstance } from 'fastify';

export async function chorusRoutes(fastify: FastifyInstance) {
  
    // Create Schema
    const payloadSchema = {
        body: {
        type: 'object',
        required: ['payload'],
        properties: {
            payload: { 
            type: 'string', 
            pattern: '^[0-9A-Fa-f\\s]+$', // Only allow Hex and spaces
            minLength: 5 
            }
        }
        }
    };

    fastify.post('/chorus', { schema: payloadSchema }, async (request, reply) => {
        return request.diScope.resolve('chorusController').create(request, reply);
    });

    fastify.get('/chorus', async (request, reply) => {
        return request.diScope.resolve('chorusController').getAll(request, reply);
    });

    fastify.get('/chorus/:id', async (request, reply) => {
        return request.diScope.resolve('chorusController').getOne(request, reply);
    });

    fastify.put('/chorus/:id', { schema: payloadSchema }, async (request, reply) => {
        return request.diScope.resolve('chorusController').update(request, reply);
    });

    fastify.delete('/chorus/:id', async (request, reply) => {
        return request.diScope.resolve('chorusController').delete(request, reply);
    });
}