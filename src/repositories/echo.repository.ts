// src/repositories/echo.repository.ts
export class EchoRepository {
    async getPingData() {
        return { status: 'pong', timestamp: new Date().toISOString() };
    }

    async getFormattedGreeting(name: string) {
        return `DI Echo: ${name}`;
    }
}