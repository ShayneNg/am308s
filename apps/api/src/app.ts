import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
// Import the plugin normally, but import awilix functions from the core 'awilix' package
import { fastifyAwilixPlugin, diContainer } from '@fastify/awilix';
import { asClass, asValue } from 'awilix';

// Import the pool creator
import { createDatabasePool } from '@repo/db';

import { EchoRepository } from './repositories/echo.repository.js';
import { EchoService } from './services/echo.service.js';
import { EchoController } from './controllers/echo.controller.js';
import { echoRoutes } from './routes/echo.routes.js';

import { ChorusRepository } from './repositories/chorus.repository.js';
import { ChorusService } from './services/chorus.service.js';
import { ChorusController } from './controllers/chorus.controller.js';
import { chorusRoutes } from './routes/chorus.routes.js';

// --- NEW: IMPORTS FOR INGEST DOMAIN ---
import { IngestRepository } from './repositories/ingest.repository.js';
import { IngestService } from './services/ingest.service.js';
import { IngestController } from './controllers/ingest.controller.js';
import { ingestRoutes } from './routes/ingest.routes.js';

export function buildApp() {
  // Check if we are currently running tests
  const isTest = process.env.NODE_ENV === 'test';

  const app: FastifyInstance = Fastify({ 
    // Only enable logger if NOT in test mode
    logger: isTest ? false : { level: 'info' } ,
    disableRequestLogging: true, // This removes the "request completed" lines
  });

  // 1. // Register the plugin
  app.register(fastifyAwilixPlugin, { 
    disposeOnClose: true, 
    disposeOnResponse: true 
  });

  // 1b. Initialize the Database Pool
  const dbPool = createDatabasePool();

  // 2. Register your classes (The "Cradle")
  diContainer.register({
    db: asValue(dbPool),

    // Echo
    echoRepository: asClass(EchoRepository).singleton(),
    echoService: asClass(EchoService).singleton(),
    echoController: asClass(EchoController).singleton(),
    
    // Chorus
    chorusRepository: asClass(ChorusRepository).singleton(),
    chorusService: asClass(ChorusService).singleton(),
    chorusController: asClass(ChorusController).singleton(),

    // Ingest (Milesight UG65)
    ingestRepository: asClass(IngestRepository).singleton(),
    ingestService: asClass(IngestService).singleton(),
    ingestController: asClass(IngestController).singleton(),
  });

  // --- REGISTER API ROUTES FIRST ---
  // We prefix these so they don't collide with UI routes
  app.register(echoRoutes, { prefix: '/api' });
  app.register(chorusRoutes, { prefix: '/api' });
  app.register(ingestRoutes, { prefix: '/api' });


  // GLOBAL ERROR HANDLER
  app.setErrorHandler((error, request, reply) => {
    // 1. Log for debugging (Only in dev)
    if (process.env.NODE_ENV !== 'test') app.log.error(error);

    // 2. Handle Schema Validation (400)
    if (error.validation) {
      return reply.status(400).send({
        status: 'error',
        message: 'Data validation failed'
      });
    }

    // 2. Security Error
    if (error.message === 'UNAUTHORIZED_GATEWAY') {
      return reply.status(401).send({ status: 'error', message: 'Unauthorized: Invalid API Key' });
    }

    // 2. Chorus Not Found (404) <--- CHECK THIS STRING
    if (error.message === 'CHORUS_NOT_FOUND') {
      return reply.status(404).send({ 
        status: 'error', 
        message: 'Record not found' 
      });
    }

    // 3. Handle Business Logic (403) - MATCH THE STRING HERE
    if (error.message === 'BUSINESS_RESERVED_NAME') {
      return reply.status(403).send({
        status: 'error',
        message: 'That name is forbidden'
      });
    }

    // 4. Default Fallback (500)
    return reply.status(500).send({
      status: 'error',
      message: 'Internal Server Error'
    });
  });

  // --- SVELTEKIT HANDOFF ---
  // If the request isn't an API call, let SvelteKit handle it
  app.use((req, res, next) => {
    // If request starts with /api, it should have been caught by Fastify. 
    // Otherwise, give it to SvelteKit.
    if (req.url?.startsWith('/api')) {
      next();
    } else {
      handler(req, res, next);
    }
  });

  return app;
}