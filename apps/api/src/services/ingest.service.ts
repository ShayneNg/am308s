import { config } from '../config/env.config.js';
import { IngestRepository } from '../repositories/ingest.repository.js';

export class IngestService {
    private ingestRepository: IngestRepository;

    constructor({ ingestRepository }: { ingestRepository: IngestRepository }) {
        this.ingestRepository = ingestRepository;
    }

    async processGatewayData(payload: string, receivedKey: string | undefined) {
        // console.log('--- Auth Debug ---');
        // console.log('Key from Gateway:', receivedKey);
        // console.log('Key from .env:   ', config.gatewayApiKey);

        // 1. Security Check
        if (!receivedKey || receivedKey !== config.gatewayApiKey) {
        console.warn(`[INGEST] Unauthorized access attempt with key: ${receivedKey}`);
        throw new Error('UNAUTHORIZED_GATEWAY');
        }

        // 2. Console Log the Submission (As requested)
        console.log(`[INGEST] Data received at ${new Date().toISOString()}`);
        console.log(`[INGEST] Payload: ${payload}`);

        // 3. Persist to Database for consistency
        return await this.ingestRepository.savePayload(payload);
    }

    async handleBobcatPush(rawData: any) {
        // Use Regex to pull only the numbers out of the string
        const clean = {
            download: parseFloat(rawData.DownloadSpeed.replace(/[^\d.-]/g, '')),
            upload: parseFloat(rawData.UploadSpeed.replace(/[^\d.-]/g, '')),
            latency: parseFloat(rawData.Latency.replace(/[^\d.-]/g, '')),
            raw_json: rawData // Keep the original just in case
        };

        console.log(`[BOBCAT] Speed recorded: ${clean.download} Mbps`);
        
        return await this.ingestRepository.saveNetworkMetric(clean);
    }
}