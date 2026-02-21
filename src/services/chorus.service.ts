import { ChorusRepository } from '../repositories/chorus.repository.js';

export class ChorusService {
    private chorusRepository: ChorusRepository;

    constructor({ chorusRepository }: { chorusRepository: ChorusRepository }) {
        this.chorusRepository = chorusRepository;
    }

    async processAndSavePayload(payload: string) {
        // Normalize spaces: turn multiple spaces/tabs into a single space
        const cleanedPayload = payload.trim().replace(/\s+/g, ' ');
        return await this.chorusRepository.create(cleanedPayload);
    }

    async getAllRecords() {
        return await this.chorusRepository.findAll();
    }

    async getRecordById(id: number) {
        const record = await this.chorusRepository.findById(id);
        if (!record) {
            // This MUST match the string in app.ts exactly
            throw new Error('CHORUS_NOT_FOUND'); 
        }
        return record;
        }

    async updateRecord(id: number, payload: string) {
        // Ensure the record exists first
        await this.getRecordById(id); 
        const cleanedPayload = payload.trim().replace(/\s+/g, ' ');
        return await this.chorusRepository.update(id, cleanedPayload);
    }

    async deleteRecord(id: number) {
        const record = await this.chorusRepository.findById(id);
        
        if (!record) {
            throw new Error('CHORUS_NOT_FOUND'); // Triggers 404 via Error Handler
        }

        return await this.chorusRepository.delete(id);
    }
}