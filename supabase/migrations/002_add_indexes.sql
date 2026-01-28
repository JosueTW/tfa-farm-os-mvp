-- TFA Farm OS - Performance Indexes
-- Run after initial schema migration

-- ============================================================================
-- PLOTS INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_plots_status ON plots(status);
CREATE INDEX IF NOT EXISTS idx_plots_code ON plots(plot_code);
CREATE INDEX IF NOT EXISTS idx_plots_geometry ON plots USING GIST(geometry);

-- ============================================================================
-- ACTIVITIES INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_activities_plot_date ON activities(plot_id, activity_date);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(activity_date DESC);
CREATE INDEX IF NOT EXISTS idx_activities_location ON activities USING GIST(gps_location);
CREATE INDEX IF NOT EXISTS idx_activities_created ON activities(created_at DESC);

-- ============================================================================
-- FIELD OBSERVATIONS INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_observations_status ON field_observations(status);
CREATE INDEX IF NOT EXISTS idx_observations_plot ON field_observations(plot_id);
CREATE INDEX IF NOT EXISTS idx_observations_severity ON field_observations(severity);
CREATE INDEX IF NOT EXISTS idx_observations_date ON field_observations(observation_date DESC);

-- ============================================================================
-- PLANT HEALTH INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_plant_health_plot ON plant_health(plot_id);
CREATE INDEX IF NOT EXISTS idx_plant_health_date ON plant_health(assessment_date DESC);

-- ============================================================================
-- LABOR LOGS INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_labor_date ON labor_logs(work_date);
CREATE INDEX IF NOT EXISTS idx_labor_worker ON labor_logs(worker_phone);
CREATE INDEX IF NOT EXISTS idx_labor_activity ON labor_logs(activity_id);

-- ============================================================================
-- ALERTS INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_alerts_severity_status ON alerts(severity, status);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_plot ON alerts(related_plot_id);

-- ============================================================================
-- WHATSAPP MESSAGES INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_whatsapp_processed ON whatsapp_messages(processed);
CREATE INDEX IF NOT EXISTS idx_whatsapp_from ON whatsapp_messages(from_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_received ON whatsapp_messages(received_at DESC);

-- ============================================================================
-- WEATHER DATA INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_weather_date ON weather_data(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_weather_forecast ON weather_data(is_forecast, forecast_date);

-- ============================================================================
-- RESOURCE INVENTORY INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_resource_type ON resource_inventory(resource_type);
CREATE INDEX IF NOT EXISTS idx_resource_date ON resource_inventory(transaction_date DESC);

-- ============================================================================
-- COMPOSITE INDEXES FOR COMMON QUERIES
-- ============================================================================

-- Dashboard overview query
CREATE INDEX IF NOT EXISTS idx_activities_dashboard 
  ON activities(activity_type, activity_date DESC) 
  WHERE activity_type = 'planting';

-- Active alerts for display
CREATE INDEX IF NOT EXISTS idx_alerts_active 
  ON alerts(created_at DESC) 
  WHERE status = 'active';

-- Recent observations for review
CREATE INDEX IF NOT EXISTS idx_observations_open 
  ON field_observations(observation_date DESC) 
  WHERE status = 'open';
