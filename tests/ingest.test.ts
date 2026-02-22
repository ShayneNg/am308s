import { expect, it, describe, vi, beforeEach } from 'vitest';
import { buildApp } from '../src/app.js';

describe('Ingest API Suite', () => {
    let app: any;
    const MOCK_KEY = 'ug65_super_secret_key_2026';
    const VALID_HEX = '0367160104688705000106cb00077db801087d6400097357270b7d19000c7d1a00017563';

    beforeEach(async () => {
        app = buildApp();
        // Ensure the DI container is ready
        await app.ready();
    });

    it('POST /ingest - should successfully ingest data with valid API key', async () => {
        const db = app.diContainer.resolve('db');
        
        // Mock the DB insert to return a fake record
        db.query.mockResolvedValueOnce({ 
        rows: [{ id: 101, raw_payload: VALID_HEX }] 
        });

        const res = await app.inject({
        method: 'POST',
        url: '/ingest',
        headers: { 'x-api-key': MOCK_KEY },
        payload: { data: VALID_HEX }
        });

        expect(res.statusCode).toBe(201);
        expect(res.json().status).toBe('success');
        expect(res.json().id).toBe(101);
    });

    it('POST /ingest - should return 401 if API key is missing', async () => {
        const res = await app.inject({
        method: 'POST',
        url: '/ingest',
        payload: { data: VALID_HEX }
        // No x-api-key header
        });

        expect(res.statusCode).toBe(401);
        expect(res.json().message).toContain('Unauthorized');
    });

    it('POST /ingest - should return 401 if API key is incorrect', async () => {
        const res = await app.inject({
        method: 'POST',
        url: '/ingest',
        headers: { 'x-api-key': 'wrong-key-123' },
        payload: { data: VALID_HEX }
        });

        expect(res.statusCode).toBe(401);
    });
});