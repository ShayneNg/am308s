import dotenv from 'dotenv';

// Load the .env file
dotenv.config();

// Validate that required variables exist
const requiredEnvs = ['DATABASE_URL'];
for (const env of requiredEnvs) {
    if (!process.env[env]) {
        throw new Error(`CRITICAL: Missing environment variable: ${env}`);
    }
}

export const config = {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        url: process.env.DATABASE_URL as string,
        poolSize: parseInt(process.env.DB_POOL_SIZE || '10', 10),
    } ,

    gatewayApiKey: process.env.GATEWAY_API_KEY,
};