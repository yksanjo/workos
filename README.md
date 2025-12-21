# WorkOS - Modern Work Operating System

A next-generation work operating system that combines Monday.com's workflow flexibility with AI-powered automation, intelligent data relationships, and seamless team collaboration.

## 🚀 Features

- **AI-Powered Workflow Optimization**: Automatically analyzes and optimizes workflows
- **Intelligent Data Relationships**: Auto-detects and visualizes relationships between items
- **Self-Healing Automations**: Automations that adapt when workflows change
- **Predictive Analytics**: Forecast completion dates and identify risks
- **Real-Time Collaboration**: Live updates and collaborative editing
- **Advanced Views**: Board, Table, Timeline, Calendar, Form, Chart views
- **Powerful Integrations**: 100+ integrations with bi-directional sync
- **Enterprise Security**: SSO, RBAC, audit logs, compliance

## 📁 Project Structure

```
workos/
├── frontend/          # Next.js web application
├── backend/           # Node.js API server
├── ml-services/       # Python ML services
├── infrastructure/    # Terraform, K8s configs
└── docker/            # Docker compose files
```

## 🛠️ Tech Stack

**Frontend:**
- React 18+ with TypeScript
- Next.js 14+ (App Router)
- Tailwind CSS
- React Query
- Zustand

**Backend:**
- Node.js 20+ (Express.js)
- PostgreSQL 15+
- Redis 7+
- GraphQL (Apollo Server)

**ML Services:**
- Python 3.11+
- TensorFlow/PyTorch
- scikit-learn

**Infrastructure:**
- Docker & Docker Compose
- Kubernetes
- AWS
- Terraform

## 🚦 Quick Start

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

### Quick Start with Docker

```bash
cd workos
docker-compose -f docker/docker-compose.dev.yml up -d
```

This starts all services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- ML Service: http://localhost:5000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Manual Setup

1. **Start infrastructure:**
```bash
docker-compose -f docker/docker-compose.dev.yml up postgres redis -d
```

2. **Setup backend:**
```bash
cd backend
npm install
cp .env.example .env
npm run migrate
npm run dev
```

3. **Setup frontend:**
```bash
cd frontend
npm install
npm run dev
```

4. **Setup ML services (optional):**
```bash
cd ml-services
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

## 📖 Documentation

- [API Documentation](./backend/README.md)
- [Frontend Guide](./frontend/README.md)
- [ML Services](./ml-services/README.md)
- [Deployment Guide](./infrastructure/README.md)

## 📝 License

MIT

