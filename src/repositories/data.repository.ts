import { pool } from '../config/db';

export class DataRepository {
    async insertHexPayload(payload: string): Promise<{ id: number; hex_payload: string; created_at: Date }> {
        const query = `
        INSERT INTO ingested_data (hex_payload)
        VALUES ($1)
        RETURNING id, hex_payload, created_at;
        `;
        const result = await pool.query(query, [payload]);
        return result.rows[0];
    }
}