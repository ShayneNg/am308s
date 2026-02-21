import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildApp } from '../src/app.js';

// 1. Mock the entire database module
vi.mock('../src/infrastructure/database.js', () => ({
  createDatabasePool: () => ({
    query: vi.fn(),
    on: vi.fn(),
    end: vi.fn().mockResolvedValue(undefined),
  }),
}));

describe('Chorus API CRUD Suite', () => {
    let app: any;

    beforeEach(async () => {
      app = buildApp();
      await app.ready();
    });

    it('POST /chorus - should save a hex payload successfully', async () => {
      const mockPayload = "0367EE00 04687C 050001";
      
      // 2. Access the mocked DB from the container to define its behavior
      const db = app.diContainer.resolve('db');
      db.query.mockResolvedValueOnce({
        rows: [{ id: 1, payload: mockPayload, created_at: new Date() }]
      });

      const res = await app.inject({
        method: 'POST',
        url: '/chorus',
        payload: { payload: mockPayload }
      });

      expect(res.statusCode).toBe(201);
      expect(res.json().status).toBe('success');
      expect(res.json().data.payload).toBe(mockPayload);
    });

    it('POST /chorus - should return 400 for invalid hex data', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/chorus',
        payload: { payload: "INVALID-GIBBERISH-HEX" }
      });

      expect(res.statusCode).toBe(400);
      expect(res.json().status).toBe('error');
    });

    it('GET /chorus/:id - should return 404 if record missing', async () => {
      const db = app.diContainer.resolve('db');
      // Simulate empty result from DB
      db.query.mockResolvedValueOnce({ rows: [] });

      const res = await app.inject({
        method: 'GET',
        url: '/chorus/999'
      });

      expect(res.statusCode).toBe(404);
      expect(res.json().message).toBe('Record not found');
    });
  it('DELETE /chorus/:id - should return 204 on successful deletion', async () => {
    const db = app.diContainer.resolve('db');
    
    // 1. Mock findById to show it exists
    db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); 
    // 2. Mock delete execution
    db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

    const res = await app.inject({
      method: 'DELETE',
      url: '/chorus/1'
    });

    expect(res.statusCode).toBe(204);
    expect(res.payload).toBe(''); // Verify the body is truly empty
  });
});