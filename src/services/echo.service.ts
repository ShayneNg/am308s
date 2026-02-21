// src/services/echo.service.ts
import { EchoRepository } from '../repositories/echo.repository.js';

export class EchoService {
    private echoRepository: EchoRepository;

    constructor({ echoRepository }: { echoRepository: EchoRepository }) {
      this.echoRepository = echoRepository;
    }

    async getHealth() {
      return await this.echoRepository.getPingData();
    }

    async performEcho(name: string) {
      // Standardize to lowercase to catch "Forbidden", "FORBIDDEN", etc.
      if (name.toLowerCase() === 'forbidden') {
        throw new Error('BUSINESS_RESERVED_NAME'); 
      }
      return await this.echoRepository.getFormattedGreeting(name);
    }
}