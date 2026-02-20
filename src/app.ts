import Fastify from 'fastify';
import dataRoutes from './routes/data.routes';

export function buildApp() {
    const app = Fastify({
        logger: true, // Enables high-performance Pino logging
    });

    // Register routes
    app.register(dataRoutes, { prefix: '/api/v1' });

    return app;
}