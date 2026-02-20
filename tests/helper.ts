// tests/helper.ts
import { buildApp } from '../src/app';

export function getTestServer() {
    const app = buildApp();
    return app;
}