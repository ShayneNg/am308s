import type { Pool } from 'pg';

export class IngestRepository {
    private db: Pool;
    constructor({ db }: { db: Pool }) { this.db = db; }

    async savePayload(payload: string, deviceName: string = 'UG65_Gateway') {
        const result = await this.db.query(
        'INSERT INTO ingest_logs (raw_payload, device_name) VALUES ($1, $2) RETURNING *',
        [payload, deviceName]
        );
        return result.rows[0];
    }
}