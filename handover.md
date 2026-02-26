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
============================================================================================================
============================================================================================================
============================================================================================================
📑 Project Handover: IoT & Network Data Sink
Status: Operational / Production-Ready

Pattern: Advanced Layered Architecture (Controller-Service-Repository)

🏗️ 1. Folder Structure & Consistency
We have organized the project to separate concerns, ensuring that database logic never touches the routing logic. Maintain this structure for all new features:

Plaintext
src/
├── config/          # Environment variables & DB connection strings
├── controllers/     # Route handlers (Request/Response logic only)
├── services/        # Business logic (Decoding, Calculations, Auth)
├── repositories/    # Database queries (SQL execution)
├── routes/          # Fastify route definitions & DI resolution
├── utils/           # Helper functions (Hex decoders, String formatters)
└── index.ts/app.ts  # Server entry & DI Container setup (Awilix)
⚙️ 2. The Advanced MVC (Layered) Flow
We moved away from basic "Route-to-DB" scripts into a decoupled 3-layer system:

Routes/Controller: Acts as the entry point. It extracts the x-api-key and the payload.

Service (The Brain): Performs the 256-bit key validation. This is where we will add the Milesight AM308 Decoder logic.

Repository (The Vault): Handles PostgreSQL interactions. We optimized this today by fixing the 42501 permission errors and adding JSONB support.

✅ 3. Accomplishments Today (Continuing from Yesterday)
Infrastructure & Network
Connectivity: Migrated from localhost to 0.0.0.0 to allow the Milesight UG65 (.113) and Bobcat to hit the API at 192.168.0.119.

Firewall: Successfully whitelisted Port 3000 for inbound TCP traffic.

Logging: Muted framework noise using disableRequestLogging: true to focus on data payloads.

Data Streams
Milesight Ingest: Successfully receiving Base64 environmental data. Security is verified via a 256-bit header check.

Bobcat Ingest: Architected a Webhook (Push) endpoint to replace inefficient Polling. It cleans strings like "58.03 Mbit/s" into numbers automatically.

🔒 4. Security & Database State
Auth: All requests require the GATEWAY_API_KEY stored in .env.

DB Status: Table ingest_logs and bobcat_metrics are live. Permissions are fixed (GRANT ALL).

Next Implementation: The repository is ready for a saveSpeedtest() function that stores normalized numerical data.

🤖 5. Instructions for Follow-up AI
"Important: The server is running on Fastify with Awilix Dependency Injection. When adding features:

Add to Repository first: Define the SQL.

Add to Service second: Define the logic/decoding.

Inject into Controller: Call the service method.

Current Task: The Milesight payload A2cq... is Base64. You need to implement a bit-shifting decoder in src/utils/decoder.ts to extract Temperature and CO2 from the Hex result."