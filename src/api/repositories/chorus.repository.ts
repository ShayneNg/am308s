import type { Pool } from 'pg';

export class ChorusRepository {
    private db: Pool;

    constructor({ db }: { db: Pool }) {
        this.db = db;
    }

    async create(payload: string) {
        const result = await this.db.query(
        'INSERT INTO chorus_data (payload) VALUES ($1) RETURNING *',
        [payload]
        );
        return result.rows[0];
    }

    async findAll() {
        const result = await this.db.query('SELECT * FROM chorus_data ORDER BY created_at DESC');
        return result.rows;
    }

    async findById(id: number) {
        const result = await this.db.query('SELECT * FROM chorus_data WHERE id = $1', [id]);
        return result.rows[0];
    }

    async update(id: number, payload: string) {
        const result = await this.db.query(
        'UPDATE chorus_data SET payload = $1 WHERE id = $2 RETURNING *',
        [payload, id]
        );
        return result.rows[0];
    }

    async delete(id: number) {
        const result = await this.db.query('DELETE FROM chorus_data WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}