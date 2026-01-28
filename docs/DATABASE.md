# TFA Farm OS - Database Schema

## Overview

The database is built on PostgreSQL with PostGIS extension for geospatial data. It's hosted on Supabase.

## Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│    plots     │────<│  activities  │────<│ field_observations│
└──────────────┘     └──────────────┘     └──────────────────┘
       │                    │
       │                    │
       ▼                    ▼
┌──────────────┐     ┌──────────────┐
│ plant_health │     │  labor_logs  │
└──────────────┘     └──────────────┘
       
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│    alerts    │     │ weather_data │     │ whatsapp_messages│
└──────────────┘     └──────────────┘     └──────────────────┘
```

## Tables

### plots

Main table for plot/field management.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| plot_code | VARCHAR(10) | Unique plot identifier (e.g., "2A") |
| plot_name | VARCHAR(100) | Human-readable name |
| geometry | GEOMETRY(POLYGON) | GeoJSON polygon for map display |
| area_ha | DECIMAL | Area in hectares |
| planned_density | INTEGER | Target plants per hectare |
| status | VARCHAR(20) | pending, clearing, planting, completed |
| start_date | DATE | When work started |
| target_completion_date | DATE | Expected completion |
| actual_completion_date | DATE | Actual completion |
| created_at | TIMESTAMPTZ | Record creation |
| updated_at | TIMESTAMPTZ | Last update |

### activities

Field operations log.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| plot_id | UUID | Foreign key to plots |
| activity_type | VARCHAR(50) | planting, inspection, weeding, etc. |
| activity_date | DATE | When the activity occurred |
| cladodes_planted | INTEGER | Number of cladodes (for planting) |
| workers_count | INTEGER | Number of workers |
| hours_worked | DECIMAL | Total hours |
| area_covered_ha | DECIMAL | Area covered |
| row_spacing_cm | INTEGER | Row spacing measurement |
| plant_spacing_cm | INTEGER | Plant spacing measurement |
| reported_by | VARCHAR | Reporter name/phone |
| report_method | VARCHAR | whatsapp, app, manual |
| gps_location | GEOGRAPHY(POINT) | GPS coordinates |
| notes | TEXT | Free-form notes |
| ai_extracted | BOOLEAN | Was data extracted by AI |
| ai_confidence | DECIMAL | AI extraction confidence |
| source_message_id | VARCHAR | Link to WhatsApp message |

### field_observations

Issues and quality observations.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| activity_id | UUID | Related activity |
| plot_id | UUID | Related plot |
| observation_date | DATE | When observed |
| observation_type | VARCHAR | quality_issue, pest, weed, etc. |
| severity | VARCHAR | low, medium, high, critical |
| description | TEXT | Details |
| action_required | TEXT | Recommended action |
| status | VARCHAR | open, in_progress, resolved |
| photos | JSONB | Array of photo URLs |
| ai_detected | BOOLEAN | Detected by AI |
| ai_analysis | JSONB | Full AI response |

### plant_health

Health assessments and survival tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| plot_id | UUID | Related plot |
| assessment_date | DATE | Assessment date |
| plants_alive | INTEGER | Living plants count |
| plants_dead | INTEGER | Dead plants count |
| survival_rate | DECIMAL | Percentage |
| avg_height_cm | DECIMAL | Average plant height |
| health_score | DECIMAL | 0-1 health score |
| pest_detected | BOOLEAN | Pest presence |
| disease_detected | BOOLEAN | Disease presence |
| weed_pressure | VARCHAR | low, moderate, high |

### alerts

System notifications.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| alert_type | VARCHAR | schedule_delay, quality_issue, etc. |
| severity | VARCHAR | low, medium, high, critical |
| title | VARCHAR | Alert title |
| description | TEXT | Details |
| related_plot_id | UUID | Related plot |
| related_activity_id | UUID | Related activity |
| status | VARCHAR | active, acknowledged, resolved |
| notification_sent | BOOLEAN | Was notification sent |
| notification_channels | JSONB | ['sms', 'email', 'push'] |

### whatsapp_messages

Raw WhatsApp message log.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| message_id | VARCHAR | Twilio message ID |
| from_number | VARCHAR | Sender phone |
| message_type | VARCHAR | text, image, audio |
| body | TEXT | Message content |
| media_url | VARCHAR | Media URL |
| processed | BOOLEAN | Has been processed |
| extracted_data | JSONB | AI extraction result |
| linked_activity_id | UUID | Created activity |

## Indexes

Key indexes for performance:

```sql
-- Activities
CREATE INDEX idx_activities_plot_date ON activities(plot_id, activity_date);
CREATE INDEX idx_activities_type ON activities(activity_type);

-- Alerts
CREATE INDEX idx_alerts_severity_status ON alerts(severity, status);

-- Geospatial
CREATE INDEX idx_plots_geometry ON plots USING GIST(geometry);
CREATE INDEX idx_activities_location ON activities USING GIST(gps_location);
```

## Row Level Security

RLS is enabled on all tables. Key policies:

- **Plots:** Viewable by all, editable by admin/supervisor
- **Activities:** Viewable by all, creatable by all authenticated
- **Alerts:** Viewable by all, creatable by system/authenticated
- **WhatsApp Messages:** Admin only access

## Migrations

Migrations are in `/supabase/migrations/`:

1. `001_initial_schema.sql` - Core tables
2. `002_add_indexes.sql` - Performance indexes
3. `003_rls_policies.sql` - Security policies

Run with: `supabase db push`
