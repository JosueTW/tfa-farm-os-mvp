-- TFA Farm OS - Row Level Security Policies
-- Run after indexes migration

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================
ALTER TABLE plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE labor_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTION: Check user role
-- ============================================================================
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM user_profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PLOTS POLICIES
-- ============================================================================

-- Everyone can read plots
CREATE POLICY "Plots are viewable by all authenticated users"
  ON plots FOR SELECT
  TO authenticated
  USING (true);

-- Only admins and supervisors can create/update plots
CREATE POLICY "Plots are editable by admins and supervisors"
  ON plots FOR INSERT
  TO authenticated
  WITH CHECK (get_user_role() IN ('admin', 'supervisor'));

CREATE POLICY "Plots are updatable by admins and supervisors"
  ON plots FOR UPDATE
  TO authenticated
  USING (get_user_role() IN ('admin', 'supervisor'));

-- Only admins can delete plots
CREATE POLICY "Plots are deletable by admins only"
  ON plots FOR DELETE
  TO authenticated
  USING (get_user_role() = 'admin');

-- ============================================================================
-- ACTIVITIES POLICIES
-- ============================================================================

-- Everyone can read activities
CREATE POLICY "Activities are viewable by all authenticated users"
  ON activities FOR SELECT
  TO authenticated
  USING (true);

-- All authenticated users can create activities
CREATE POLICY "Activities can be created by authenticated users"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only admins, supervisors, and creators can update
CREATE POLICY "Activities are updatable by admins, supervisors, or creators"
  ON activities FOR UPDATE
  TO authenticated
  USING (
    get_user_role() IN ('admin', 'supervisor')
  );

-- Only admins can delete
CREATE POLICY "Activities are deletable by admins only"
  ON activities FOR DELETE
  TO authenticated
  USING (get_user_role() = 'admin');

-- ============================================================================
-- FIELD OBSERVATIONS POLICIES
-- ============================================================================

CREATE POLICY "Observations are viewable by all authenticated users"
  ON field_observations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Observations can be created by authenticated users"
  ON field_observations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Observations are updatable by admins and supervisors"
  ON field_observations FOR UPDATE
  TO authenticated
  USING (get_user_role() IN ('admin', 'supervisor'));

CREATE POLICY "Observations are deletable by admins only"
  ON field_observations FOR DELETE
  TO authenticated
  USING (get_user_role() = 'admin');

-- ============================================================================
-- PLANT HEALTH POLICIES
-- ============================================================================

CREATE POLICY "Plant health is viewable by all authenticated users"
  ON plant_health FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Plant health can be created by authenticated users"
  ON plant_health FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Plant health is updatable by admins and supervisors"
  ON plant_health FOR UPDATE
  TO authenticated
  USING (get_user_role() IN ('admin', 'supervisor'));

-- ============================================================================
-- ALERTS POLICIES
-- ============================================================================

CREATE POLICY "Alerts are viewable by all authenticated users"
  ON alerts FOR SELECT
  TO authenticated
  USING (true);

-- System/service role can create alerts
CREATE POLICY "Alerts can be created by service role"
  ON alerts FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Authenticated users can also create alerts
CREATE POLICY "Alerts can be created by authenticated users"
  ON alerts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- All authenticated users can update alerts (acknowledge/resolve)
CREATE POLICY "Alerts are updatable by authenticated users"
  ON alerts FOR UPDATE
  TO authenticated
  USING (true);

-- ============================================================================
-- WHATSAPP MESSAGES POLICIES
-- ============================================================================

-- Only service role and admins can view raw messages
CREATE POLICY "WhatsApp messages viewable by admins"
  ON whatsapp_messages FOR SELECT
  TO authenticated
  USING (get_user_role() = 'admin');

-- Service role can insert (webhook)
CREATE POLICY "WhatsApp messages insertable by service role"
  ON whatsapp_messages FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================================================
-- WEATHER DATA POLICIES
-- ============================================================================

CREATE POLICY "Weather data is viewable by all authenticated users"
  ON weather_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Weather data insertable by service role"
  ON weather_data FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================================================
-- USER PROFILES POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (get_user_role() = 'admin');

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Auto-create profile on signup
CREATE POLICY "Users can create own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- ============================================================================
-- LABOR LOGS & RESOURCE INVENTORY (Admin/Supervisor only)
-- ============================================================================

CREATE POLICY "Labor logs viewable by admins and supervisors"
  ON labor_logs FOR SELECT
  TO authenticated
  USING (get_user_role() IN ('admin', 'supervisor'));

CREATE POLICY "Labor logs editable by admins and supervisors"
  ON labor_logs FOR ALL
  TO authenticated
  USING (get_user_role() IN ('admin', 'supervisor'));

CREATE POLICY "Resource inventory viewable by admins and supervisors"
  ON resource_inventory FOR SELECT
  TO authenticated
  USING (get_user_role() IN ('admin', 'supervisor'));

CREATE POLICY "Resource inventory editable by admins and supervisors"
  ON resource_inventory FOR ALL
  TO authenticated
  USING (get_user_role() IN ('admin', 'supervisor'));
