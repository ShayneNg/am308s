import { buildApp } from './app';

const server = buildApp();

const start = async () => {
  try {
    const app = await buildApp();
    
    // Listen on 0.0.0.0 to allow Milesight/Bobcat access
    const address = await app.listen({ 
      port: 3000, 
      host: '0.0.0.0' 
    });

    console.log(`🚀 Gateway API & Dashboard running at: ${address}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();2222