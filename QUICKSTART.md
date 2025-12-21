# WorkOS Quick Start Guide

Get WorkOS up and running in minutes!

## Prerequisites

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 15+ (or use Docker)
- Redis 7+ (or use Docker)

## Quick Start with Docker

The easiest way to get started is using Docker Compose:

```bash
cd workos
docker-compose -f docker/docker-compose.dev.yml up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379
- Backend API on port 3001
- Frontend on port 3000
- ML Service on port 5000

## Manual Setup

### 1. Start Infrastructure

```bash
cd docker
docker-compose -f docker-compose.dev.yml up postgres redis -d
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env  # Edit .env with your settings
npm run migrate  # Run database migrations
npm run dev
```

Backend will run on http://localhost:3001

### 3. Setup Frontend

```bash
cd frontend
npm install
# Create .env.local with: NEXT_PUBLIC_API_URL=http://localhost:3001/api
npm run dev
```

Frontend will run on http://localhost:3000

### 4. Setup ML Services (Optional)

```bash
cd ml-services
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

ML Service will run on http://localhost:5000

## First Steps

1. **Register a new account:**
   - Go to http://localhost:3000/register
   - Create your account

2. **Create your first board:**
   - After logging in, click "New Board"
   - Give it a name and description

3. **Add items:**
   - Click on your board
   - Add items to track your work

4. **Explore workflows:**
   - Navigate to Workflows
   - Create a workflow to organize multiple boards

## API Testing

Test the API with curl:

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get boards (use token from login)
curl http://localhost:3001/api/boards \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Development

### Backend Development

```bash
cd backend
npm run dev  # Watch mode with hot reload
npm run build  # Build for production
npm start  # Run production build
```

### Frontend Development

```bash
cd frontend
npm run dev  # Development server
npm run build  # Production build
npm start  # Run production build
```

## Project Structure

```
workos/
├── backend/          # Node.js API server
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── db/
│   │   └── middleware/
│   └── package.json
├── frontend/         # Next.js web app
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── stores/
├── ml-services/      # Python ML services
│   ├── app.py
│   └── requirements.txt
└── docker/          # Docker configs
    └── docker-compose.dev.yml
```

## Troubleshooting

### Database Connection Issues

Make sure PostgreSQL is running:
```bash
docker ps  # Check if postgres container is running
```

### Port Already in Use

If ports are already in use, update the ports in:
- `docker-compose.dev.yml`
- `.env` files
- `package.json` scripts

### ML Service Not Responding

The ML service is optional. If it's not running, the backend will return mock data for analytics endpoints.

## Next Steps

- Read the [Backend README](./backend/README.md) for API documentation
- Read the [Frontend README](./frontend/README.md) for frontend details
- Check out the [ML Services README](./ml-services/README.md) for ML features

## Support

For issues or questions, check the documentation in each service's README file.

