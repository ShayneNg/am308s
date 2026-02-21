Project Handover Documentation: Echo-Chorus API (Fastify + TypeScript)
This document serves as a comprehensive state-of-the-union for the current development project. It is designed to allow a new developer or an AI collaborator to understand the architecture, logic, and pending requirements without loss of context.

1. Project Overview & Architectural Vision
The project is a high-performance, production-ready API built with Fastify and TypeScript. The core design philosophy is Separation of Concerns using a Layered Architecture and Dependency Injection (DI).

Tech Stack
Framework: Fastify (v4+)

Language: TypeScript (ESM)

DI Container: awilix via @fastify/awilix

Database: PostgreSQL (Driver: pg)

Testing: Vitest + C8 (Coverage target: 86%+)

Config: dotenv with strict validation logic.

2. Folder Structure
The project follows a modular structure to ensure scalability:

Plaintext
src/
├── config/             # Environment validation & configuration
├── controllers/        # HTTP Request handling & Status code management
├── infrastructure/     # External tools setup (Postgres Pool)
├── repositories/       # Direct Database access (SQL queries)
├── routes/             # Fastify route definitions & JSON Schemas
├── services/           # Business logic & Domain error throwing
├── app.ts              # App factory, DI registration, & Error handling
└── index.ts            # Entry point / Server listener
tests/                  # Vitest suites (unit & integration)
3. Implementation Status
A. The Database Layer
Pool Management: Located in src/infrastructure/database.ts. Uses a connection pool with an immediate Heartbeat check (SELECT NOW()) on startup.

Permissions: Resolved "Permission Denied" issues. Current user postgres has full privileges on table chorus_data and its associated sequences.

Table Schema:

SQL
CREATE TABLE chorus_data (
    id SERIAL PRIMARY KEY,
    payload TEXT NOT NULL, -- Specifically for Hex strings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
B. Route Logic: /echo
Purpose: Basic health and DI verification.

Logic: Simple ping-pong with name validation.

C. Route Logic: /chorus (The Core Feature)
This route handles complex hexadecimal payloads (e.g., 0367EE00 04687C ...).

POST: Creates a record (returns 201 Created).

GET: Lists all or retrieves by ID (returns 200 OK or 404 Not Found).

DELETE: Removes a record (returns 204 No Content on success).

Validation: Uses Fastify JSON Schema with Regex: ^[0-9A-Fa-f\\s]+$ to ensure only Hex and spaces are accepted.

4. Best Practices & Conventions Established
Explicit Status Codes: We do not rely on framework defaults.

Success: 200, 201, 204.

Errors: 400 (Validation), 403 (Business Conflict), 404 (Missing), 500 (Unexpected).

Dependency Injection: All classes (Controllers, Services, Repositories) are registered as singletons in the Awilix container. The Database Pool is registered as a Value.

Error Handling: A global setErrorHandler in app.ts catches specific strings thrown by the Service layer (e.g., CHORUS_NOT_FOUND) and maps them to HTTP responses.

5. Environment Configuration
Variables are strictly managed. The application will crash on startup if DATABASE_URL is missing.

.env.sample Reference:

Code snippet
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/db_name
DB_POOL_SIZE=10
6. Testing Strategy
We use Vitest with mocked dependencies to maintain speed and isolation.

Database Mocking: In tests/chorus.test.ts, we mock the pg Pool using vi.mock and inject it into the app via the Awilix diContainer.

Coverage: Currently maintaining ~86% coverage.

Key Test: Verified that DELETE returns 204 with an empty payload and 404 when the ID doesn't exist.

7. Immediate Next Steps for the AI Successor
Pagination: The findAll method in chorus.repository.ts currently returns all records. It should be updated to accept limit and offset.

Audit Logging: Implement a middleware or service hook to log every database modification into a separate system_logs table.

Environment-Based DB Handling: Refine the test setup to ensure that if NODE_ENV === 'test', the app definitely doesn't attempt a real connection to Postgres if the mock fails.

End of Handover. This project is currently in a "Green State" (all tests passing, server connecting to DB).