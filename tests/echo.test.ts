import { describe, it, expect } from 'vitest';
import { buildApp } from '../src/app.js';

// Initialize the app once for the test suite
const app = buildApp();

describe('High Coverage Echo API Suite', () => {
  
    /**
     * 1. GET /echo (Ping/Health Check)
     * Covers: Route -> Controller -> Service -> Repository (Happy Path)
     */
    it('GET /echo - should return health status from repository', async () => {
        const res = await app.inject({ 
        method: 'GET', 
        url: '/echo' 
        });

        expect(res.statusCode).toBe(200);
        expect(res.json()).toHaveProperty('status', 'pong');
        expect(res.json()).toHaveProperty('timestamp');
    });

    /**
     * 2. POST /echo (Success)
     * Covers: Request parsing -> Service logic -> Data formatting
     */
    it('POST /echo - should echo valid name correctly', async () => {
        const name = 'Gemini';
        const res = await app.inject({
        method: 'POST',
        url: '/echo',
        payload: { name }
        });

        expect(res.statusCode).toBe(200);
        expect(res.json().message).toBe(`DI Echo: ${name}`);
    });

    /**
     * 3. POST /echo (Schema Validation Failures)
     * Covers: Fastify Schema logic & Global Error Handler (400 branch)
     */
describe('Schema Validation (400 Errors)', () => {
    it('should return 400 if name is missing', async () => {
        const res = await app.inject({
            method: 'POST',
            url: '/echo',
            payload: {} // Missing 'name'
        });

        expect(res.statusCode).toBe(400);
        expect(res.json().status).toBe('error');
        });

        it('should return 400 if name is too short', async () => {
        const res = await app.inject({
            method: 'POST',
            url: '/echo',
            payload: { name: 'A' } // Fails minLength: 2
        });

        expect(res.statusCode).toBe(400);
        });
    });

    /**
     * 4. POST /echo (Business Logic Error)
     * Covers: Service 'if' branch & Global Error Handler (403 branch)
     */
    it('POST /echo - should return 403 for reserved names', async () => {
        const res = await app.inject({
        method: 'POST',
        url: '/echo',
        payload: { name: 'forbidden' }
        });

        // Hits the 'if (name === "forbidden")' in EchoService
        expect(res.statusCode).toBe(403);
        const body = res.json();
        expect(body.status).toBe('error');
        expect(body.message).toBe('That name is forbidden')
    });

    /**
     * 5. Edge Case: Not Found
     * Covers: Fastify default 404 handler branch
     */
    it('should return 404 for routes that do not exist', async () => {
        const res = await app.inject({ 
        method: 'GET', 
        url: '/non-existent-route' 
        });

        expect(res.statusCode).toBe(404);
    });
});