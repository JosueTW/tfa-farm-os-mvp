-- TFA Farm OS - Initial Database Schema
-- PostgreSQL + PostGIS
-- Version 1.0

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================================
-- 1. PLOTS TABLE (GIS-enabled)
-- ============================================================================
CREATE TABLE IF NOT EXISTS plots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plot_code VARCHAR(10) UNIQUE NOT NULL, -- e.g., "2A", "3B"
  plot_name VARCHAR(100),
  geometry GEOMETRY(POLYGON, 4326), -- GeoJSON polygon
  area_ha DECIMAL(10,2),
  planned_density INTEGER DEFAULT 12000, -- target plants/ha
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'clearing', 'planting', 'completed'
  start_date DATE,
  target_completion_date DATE,
  actual_completion_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. ACTIVITIES TABLE (Field operations log)
-- ============================================================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plot_id UUID REFERENCES plots(id) ON DELETE SET NULL,
  activity_type VARCHAR(50), -- 'site_clearing', 'planting', 'inspection', 'weeding', etc.
  activity_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Planting-specific
  cladodes_planted INTEGER,
  workers_count INTEGER,
  hours_worked DECIMAL(5,2),
  
  -- Measurements
  area_covered_ha DECIMAL(10,4),
  row_spacing_cm INTEGER,
  plant_spacing_cm INTEGER,
  actual_density INTEGER,
  
  -- Metadata
  reported_by VARCHAR(100), -- Name or phone number
  report_method VARCHAR(20) DEFAULT 'manual', -- 'whatsapp', 'app', 'manual'
  gps_location GEOGRAPHY(POINT, 4326),
  notes TEXT,
  
  -- AI extraction metadata
  ai_extracted BOOLEAN DEFAULT FALSE,
  ai_confidence DECIMAL(3,2),
  source_message_id VARCHAR(100) -- Link to original WhatsApp/media
);

-- ============================================================================
-- 3. FIELD OBSERVATIONS TABLE (Issues, quality checks)
-- ============================================================================
CREATE TABLE IF NOT EXISTS field_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  plot_id UUID REFERENCES plots(id) ON DELETE SET NULL,
  observation_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Issue tracking
  observation_type VARCHAR(50), -- 'quality_issue', 'pest', 'weed', 'spacing_error', etc.
  severity VARCHAR(20) DEFAULT 'low', -- 'low', 'medium', 'high', 'critical'
  description TEXT,
  action_required TEXT,
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'in_progress', 'resolved'
  resolved_at TIMESTAMPTZ,
  
  -- Media
  photos JSONB, -- Array of Supabase Storage URLs
  voice_notes JSONB,
  
  -- AI analysis
  ai_detected BOOLEAN DEFAULT FALSE,
  ai_analysis JSONB -- Full Claude response
);

-- ============================================================================
-- 4. PLANT HEALTH TABLE (Tracking survival and growth)
-- ============================================================================
CREATE TABLE IF NOT EXISTS plant_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plot_id UUID REFERENCES plots(id) ON DELETE SET NULL,
  assessment_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Health metrics
  plants_alive INTEGER,
  plants_dead INTEGER,
  survival_rate DECIMAL(5,2), -- Percentage
  avg_height_cm DECIMAL(5,2),
  health_score DECIMAL(3,2), -- 0-1 from CV analysis
  
  -- Issues
  pest_detected BOOLEAN DEFAULT FALSE,
  disease_detected BOOLEAN DEFAULT FALSE,
  weed_pressure VARCHAR(20), -- 'low', 'moderate', 'high'
  
  -- Source
  assessed_by VARCHAR(100),
  photos JSONB
);

-- ============================================================================
-- 5. LABOR LOGS TABLE (Team tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS labor_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Worker details
  worker_name VARCHAR(100),
  worker_phone VARCHAR(20),
  role VARCHAR(50), -- 'planter', 'digger', 'supervisor'
  
  -- Work done
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  hours_worked DECIMAL(5,2),
  tasks_completed JSONB, -- Array of tasks
  output_quantity INTEGER, -- e.g., plants planted
  
  -- Attendance
  check_in_time TIME,
  check_out_time TIME,
  present BOOLEAN DEFAULT TRUE
);

-- ============================================================================
-- 6. RESOURCE INVENTORY TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS resource_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type VARCHAR(50), -- 'cladode', 'compost', 'water', 'equipment'
  quantity DECIMAL(10,2),
  unit VARCHAR(20), -- 'units', 'kg', 'liters', 'hours'
  location VARCHAR(100),
  
  -- Transactions
  transaction_type VARCHAR(20), -- 'received', 'used', 'transferred'
  transaction_date DATE NOT NULL,
  related_activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. WEATHER DATA TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS weather_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Location
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  
  -- Conditions
  temperature_c DECIMAL(4,1),
  humidity_percent INTEGER,
  rainfall_mm DECIMAL(5,2),
  wind_speed_kmh DECIMAL(5,2),
  conditions VARCHAR(50), -- 'clear', 'cloudy', 'rain'
  
  -- Source
  source VARCHAR(50) DEFAULT 'openweathermap', -- 'openweathermap', 'manual'
  is_forecast BOOLEAN DEFAULT FALSE,
  forecast_date DATE
);

-- ============================================================================
-- 8. ALERTS TABLE (System notifications)
-- ============================================================================
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Alert details
  alert_type VARCHAR(50),
  severity VARCHAR(20) DEFAULT 'low', -- 'low', 'medium', 'high', 'critical'
  title VARCHAR(200),
  description TEXT,
  
  -- Context
  related_plot_id UUID REFERENCES plots(id) ON DELETE SET NULL,
  related_activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'acknowledged', 'resolved'
  acknowledged_by VARCHAR(100),
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  
  -- Delivery
  notification_sent BOOLEAN DEFAULT FALSE,
  notification_channels JSONB -- ['sms', 'email', 'push']
);

-- ============================================================================
-- 9. WHATSAPP MESSAGES TABLE (Raw message log)
-- ============================================================================
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  received_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Message metadata
  from_number VARCHAR(20),
  message_id VARCHAR(100) UNIQUE,
  message_type VARCHAR(20), -- 'text', 'image', 'audio', 'video'
  
  -- Content
  body TEXT,
  media_url VARCHAR(500),
  media_content_type VARCHAR(50),
  
  -- Processing
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  extracted_data JSONB, -- Claude extraction result
  linked_activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  
  -- Storage
  media_stored_path VARCHAR(500) -- Supabase Storage path
);

-- ============================================================================
-- 10. USER PROFILES TABLE (Optional - for auth)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  full_name VARCHAR(100),
  phone VARCHAR(20),
  role VARCHAR(50), -- 'admin', 'supervisor', 'field_worker', 'viewer'
  avatar_url VARCHAR(500),
  preferences JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_plots_updated_at
  BEFORE UPDATE ON plots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_field_observations_updated_at
  BEFORE UPDATE ON field_observations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
