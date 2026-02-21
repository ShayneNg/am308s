import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
// Import the plugin normally, but import awilix functions from the core 'awilix' package
import { fastifyAwilixPlugin, diContainer } from '@fastify/awilix';
import { asClass, asValue } from 'awilix';

// Import the pool creator
import { createDatabasePool } from './infrastructure/database.js';

import { EchoRepository } from './repositories/echo.repository.js';
import { EchoService } from './services/echo.service.js';
import { EchoController } from './controllers/echo.controller.js';
import { echoRoutes } from './routes/echo.routes.js';

import { ChorusRepository } from './repositories/chorus.repository.js';
import { ChorusService } from './services/chorus.service.js';
import { ChorusController } from './controllers/chorus.controller.js';
import { chorusRoutes } from './routes/chorus.routes.js';

export function buildApp() {
  // Check if we are currently running tests
  const isTest = process.env.NODE_ENV === 'test';

  const app: FastifyInstance = Fastify({ 
    // Only enable logger if NOT in test mode
    logger: isTest ? false : { level: 'info' } 
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

    echoRepository: asClass(EchoRepository).singleton(),
    echoService: asClass(EchoService).singleton(),
    echoController: asClass(EchoController).singleton(),

    // ADD CHORUS HERE:
    chorusRepository: asClass(ChorusRepository).singleton(),
    chorusService: asClass(ChorusService).singleton(),
    chorusController: asClass(ChorusController).singleton(),
  });


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

    // 3. Register Routes
  app.register(echoRoutes);
  app.register(chorusRoutes); // Register your new API

  return app;
}