import { buildApp } from './app';

const app = buildApp();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function start() {
    try {
        await app.listen({ port: PORT, host: '0.0.0.0' });
        app.log.info(`Server listening on port ${PORT}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

start();