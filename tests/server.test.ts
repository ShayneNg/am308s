import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from './app';

describe('Server Health Check', () => {
    const app = buildApp();

    // Ensure the app is ready before running tests
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should return 200 on health check route', async () => {
        const response = await app.inject({
        method: 'GET',
        url: '/health' // Ensure you have this route defined
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({ status: 'ok' });
    });
});