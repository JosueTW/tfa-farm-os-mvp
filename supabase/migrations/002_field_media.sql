-- TFA Farm OS - Field Media Table
-- Version 1.1
-- Stores metadata for field photos, videos, and audio recordings

-- ============================================================================
-- FIELD MEDIA TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS field_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Media metadata
  media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('photo', 'video', 'audio')),
  media_date DATE NOT NULL,
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500), -- Path in Supabase Storage (optional for manual entries)
  file_size_bytes BIGINT,
  mime_type VARCHAR(100),
  
  -- Capture details
  captured_by VARCHAR(100) NOT NULL,
  capture_location GEOMETRY(POINT, 4326), -- GPS coordinates if available
  upload_method VARCHAR(20) DEFAULT 'manual' CHECK (upload_method IN ('manual', 'whatsapp', 'field_app', 'api')),
  
  -- Content description
  description TEXT,
  tags TEXT[] DEFAULT '{}', -- Array of tags for categorization
  
  -- Associations
  plot_id UUID REFERENCES plots(id) ON DELETE SET NULL,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  
  -- AI analysis results
  ai_analysis JSONB, -- Stores Claude's analysis if image was processed
  ai_confidence DECIMAL(5,2),
  
  -- Display options
  featured BOOLEAN DEFAULT FALSE, -- Show on dashboard gallery
  thumbnail_path VARCHAR(500),
  
  -- Verification
  verified BOOLEAN DEFAULT FALSE,
  verified_by VARCHAR(100),
  verified_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_field_media_date ON field_media(media_date DESC);
CREATE INDEX IF NOT EXISTS idx_field_media_type ON field_media(media_type);
CREATE INDEX IF NOT EXISTS idx_field_media_plot ON field_media(plot_id);
CREATE INDEX IF NOT EXISTS idx_field_media_featured ON field_media(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_field_media_tags ON field_media USING GIN(tags);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_field_media_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_field_media_timestamp
  BEFORE UPDATE ON field_media
  FOR EACH ROW
  EXECUTE FUNCTION update_field_media_timestamp();

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================
-- Uncomment to insert sample data
/*
INSERT INTO field_media (media_type, media_date, filename, captured_by, description, tags, featured, verified)
VALUES 
  ('photo', '2026-01-28', 'IMG_20260128_143022.jpg', 'Nick Shapley', 'Multi-cladode stacking visible in Block A', ARRAY['planting', 'multi_cladode', 'block_a'], TRUE, TRUE),
  ('photo', '2026-01-27', 'IMG_20260127_091545.jpg', 'Field Team', 'Row spacing measurement - 250cm confirmed', ARRAY['inspection', 'spacing', 'quality_check'], FALSE, TRUE),
  ('video', '2026-01-26', 'VID_20260126_154030.mp4', 'Nick Shapley', 'Planting demonstration for new workers', ARRAY['training', 'planting', 'demo'], TRUE, TRUE);
*/
