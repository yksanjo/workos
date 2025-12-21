# WorkOS Backend API

Node.js + Express + TypeScript backend API server.

## Setup

```bash
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

## Database Setup

1. Start PostgreSQL (via Docker or local):
```bash
docker-compose -f ../docker/docker-compose.dev.yml up postgres -d
```

2. Run migrations:
```bash
npm run migrate
```

## Development

```bash
npm run dev
```

Server runs on http://localhost:3001

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token

### Boards
- `GET /api/boards` - Get all boards
- `GET /api/boards/:id` - Get board by ID
- `POST /api/boards` - Create board
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Items
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Workflows
- `GET /api/workflows` - Get all workflows
- `GET /api/workflows/:id` - Get workflow by ID
- `GET /api/workflows/:id/optimize` - Get workflow optimizations
- `POST /api/workflows` - Create workflow
- `PUT /api/workflows/:id` - Update workflow
- `DELETE /api/workflows/:id` - Delete workflow

### Automations
- `GET /api/automations` - Get all automations
- `GET /api/automations/:id` - Get automation by ID
- `POST /api/automations` - Create automation
- `PUT /api/automations/:id` - Update automation
- `DELETE /api/automations/:id` - Delete automation
- `POST /api/automations/:id/test` - Test automation

### Analytics
- `GET /api/analytics/forecast/:workflowId` - Get completion forecast
- `GET /api/analytics/bottlenecks/:workflowId` - Get bottlenecks
- `GET /api/analytics/metrics/:workflowId` - Get workflow metrics

