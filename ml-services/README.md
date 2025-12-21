# WorkOS ML Services

Python-based ML services for workflow optimization, forecasting, and analytics.

## Features

- Workflow bottleneck detection
- Completion date forecasting (Monte Carlo simulation)
- Workflow optimization suggestions
- Risk analysis

## Setup

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Run

```bash
python app.py
```

The service will run on http://localhost:5000

## API Endpoints

- `GET /health` - Health check
- `GET /api/workflows/<workflow_id>/optimize` - Get optimization suggestions
- `GET /api/analytics/forecast/<workflow_id>` - Forecast completion date
- `GET /api/analytics/bottlenecks/<workflow_id>` - Get bottlenecks

