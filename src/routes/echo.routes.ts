import type { FastifyInstance } from 'fastify';

export async function echoRoutes(fastify: FastifyInstance) {
  fastify.get('/echo', async (request, reply) => {
    const controller = request.diScope.resolve('echoController');
    return controller.handlePing(request, reply);
  });

  fastify.post('/echo', {
    // Ensure 'schema' is the second argument object
    schema: {
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { 
            type: 'string', 
            minLength: 2  // <--- This is what we are testing
          }
        }
      }
    }
  }, async (request, reply) => {
    const controller = request.diScope.resolve('echoController');
    return controller.handleEcho(request, reply);
  });
}