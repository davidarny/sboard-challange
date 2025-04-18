# sBoard Challenge

Monorepo for the Sboard application, including client (frontend) and server (backend) packages.

## Prerequisites

- Bun (v1.2.10+; https://bun.sh)
- Node.js (v16+; required for Nest CLI)

## Installation

From the root directory, install dependencies:

```bash
bun install
```

## Environment Variables

Define the following environment variables in a `.env` or `.env.local` file at the root of the project:

### Frontend (client)

| Variable        | Description                            | Example               |
| --------------- | -------------------------------------- | --------------------- |
| PORT            | Port for frontend server (vite server) | 3000                  |
| API_URL         | URL of the backend API (vite server)   | http://localhost:3001 |
| SKIP_VALIDATION | Skip environment validation (opt)      | "true" or "false"     |

### Backend (server)

| Variable        | Description                       | Example               |
| --------------- | --------------------------------- | --------------------- |
| PORT            | Port for backend server           | 3001                  |
| S3_ENDPOINT     | S3 endpoint URL                   | http://localhost:9000 |
| S3_BUCKET       | Name of the S3 bucket             | bucket                |
| S3_ACCESS_KEY   | AWS access key for S3             | access-key            |
| S3_SECRET_KEY   | AWS secret key for S3             | secret-key            |
| DB_HOST         | Database host                     | localhost             |
| DB_PORT         | Database port                     | 5432                  |
| DB_USER         | Database user                     | postgres              |
| DB_PASSWORD     | Database password                 | postgres              |
| DB_NAME         | Database name                     | postgres              |
| REDIS_HOST      | Redis host                        | localhost             |
| REDIS_PORT      | Redis port                        | 6379                  |
| SKIP_VALIDATION | Skip environment validation (opt) | "true" or "false"     |

## Development

Run both client and server in development mode using Turbo:

```bash
bun run dev
```

This will concurrently start:

- **Client**: running at `http://localhost:5173` (powered by Vite)
- **Server**: running at `http://localhost:4000` (powered by NestJS)

You can also start them individually:

```bash
# Start the backend
cd packages/server
bun run dev

# Start the frontend
cd packages/client
bun run dev
```

## Building

Build all packages for production:

```bash
bun run build
```

## Running in Production

To start the backend in production:

```bash
cd packages/server
bun run start:prod
```

To preview the built frontend:

```bash
cd packages/client
bun run preview
```

## Running with Docker Compose

You can run all services and the application using Docker Compose with the provided `docker-compose.yml`:

```bash
docker-compose up --build
```

This will start:

- **PostgreSQL** database
- **Redis** cache
- **MinIO** object storage
- **Server** (backend)
- **Frontend**

Ensure you have a `.env.local` file at the root of the project with the following variables:

```bash
S3_ACCESS_KEY=<your-s3-access-key>
S3_SECRET_KEY=<your-s3-secret-key>
```
