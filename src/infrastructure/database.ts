import pg from 'pg';
import { config } from '../config/env.config.js';

const { Pool } = pg;

export function createDatabasePool() {
    const pool = new Pool({
        connectionString: config.database.url,
        max: config.database.poolSize,
    });

    // 1. Error listener for idle clients
    pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
        process.exit(-1);
    });

    // 2. Immediate Connection Test
    // We use a self-invoking function to check the connection
    if (config.nodeEnv !== 'test') {
        pool.connect((err, client, release) => {
        if (err) {
            return console.error('❌ Database connection failed:', err.stack);
        }
        client.query('SELECT NOW()', (err) => {
            release(); // Release the client back to the pool
            if (err) {
            return console.error('❌ Error executing query', err.stack);
            }
            console.log('✅ Database connected successfully');
        });
        });
    }

  return pool;
}