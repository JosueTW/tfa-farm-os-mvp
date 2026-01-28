# TFA Farm OS - API Documentation

## Overview

The TFA Farm OS API is built on Next.js API Routes and uses Supabase as the backend database. All endpoints return JSON responses.

## Base URL

- **Development:** `http://localhost:3000/api`
- **Production:** `https://fos.terraferm.africa/api`

## Authentication

All API endpoints require authentication via Supabase Auth. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### Dashboard

#### GET /api/dashboard/overview

Returns the main dashboard data including KPIs, recent activities, and active alerts.

**Response:**
```json
{
  "summary": {
    "total_area_ha": 13.0,
    "completed_area_ha": 1.2,
    "planting_progress_percent": 9,
    "current_planting_rate_per_day": 850,
    "target_planting_rate_per_day": 1200,
    "overall_survival_rate_percent": 94,
    "labor_productivity_per_worker": 283
  },
  "kpis": [...],
  "recent_activities": [...],
  "active_alerts": [...],
  "last_updated": "2026-01-26T14:23:00Z"
}
```

#### GET /api/dashboard/metrics

Returns detailed metrics with daily breakdown.

**Query Parameters:**
- `start_date` (optional): Start date for the period (YYYY-MM-DD)
- `end_date` (optional): End date for the period (YYYY-MM-DD)
- `plot_id` (optional): Filter by plot ID

---

### Plots

#### GET /api/plots

List all plots.

**Query Parameters:**
- `status` (optional): Filter by status (pending, clearing, planting, completed)
- `include_metrics` (optional): Include calculated metrics (true/false)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "plot_code": "2A",
      "plot_name": "Main Field South",
      "area_ha": 0.5,
      "planned_density": 12000,
      "status": "in_progress",
      "target_completion_date": "2026-01-28"
    }
  ]
}
```

#### POST /api/plots

Create a new plot.

**Request Body:**
```json
{
  "plot_code": "6A",
  "plot_name": "New Section",
  "area_ha": 0.5,
  "planned_density": 12000,
  "target_completion_date": "2026-03-01",
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[28.123, -24.567], ...]]
  }
}
```

#### GET /api/plots/:id

Get a single plot with details.

#### PUT /api/plots/:id

Update a plot.

#### DELETE /api/plots/:id

Delete a plot (admin only).

---

### Activities

#### GET /api/activities

List activities with optional filters.

**Query Parameters:**
- `plot_id` (optional): Filter by plot
- `date` (optional): Filter by date (YYYY-MM-DD)
- `activity_type` (optional): Filter by type
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset

#### POST /api/activities

Create a new activity.

**Request Body:**
```json
{
  "plot_id": "uuid",
  "activity_type": "planting",
  "activity_date": "2026-01-26",
  "cladodes_planted": 400,
  "workers_count": 6,
  "hours_worked": 8,
  "notes": "Rows look good, spacing on target"
}
```

---

### AI Processing

#### POST /api/ai/process-message

Process a field message with Claude AI.

**Request Body:**
```json
{
  "message": "Planted 400 cladodes in Plot 2A with 6 workers",
  "from": "+27123456789",
  "timestamp": "2026-01-26T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "extracted_data": {
    "activity_type": "planting",
    "plot_id": "2A",
    "cladodes_planted": 400,
    "workers": 6
  },
  "confidence": 0.92,
  "processing_time_ms": 1250
}
```

#### POST /api/ai/analyze-image

Analyze an image with Claude Vision.

**Request Body:**
```json
{
  "image_url": "https://storage.supabase.co/...",
  "image_type": "row",
  "context": "Plot 2A, row 15"
}
```

---

### Webhooks

#### POST /api/webhooks/whatsapp

Twilio WhatsApp webhook endpoint. Receives incoming messages and processes them automatically.

**Note:** This endpoint is called by Twilio and uses Twilio's signature validation.

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "details": [...] // Optional validation errors
}
```

**Common Status Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., duplicate plot code)
- `500` - Internal Server Error

---

## Rate Limiting

- Dashboard endpoints: 60 requests/minute
- Activity creation: 30 requests/minute
- AI processing: 10 requests/minute

---

## Webhooks

Configure the WhatsApp webhook in Twilio:

1. Go to Twilio Console → Messaging → Settings
2. Set webhook URL: `https://your-app.vercel.app/api/webhooks/whatsapp`
3. Method: POST
