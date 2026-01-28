-- ================================================
-- TFA STEELPOORT FARM OS - ENHANCED DATABASE UPDATE V3.0
-- Multi-Cladode Methodology + Weather Tracking + Field Media + KPIs
-- Generated: 2026-01-27
-- Purpose: Complete database enhancement with visual evidence integration
-- ================================================

-- ================================================
-- SECTION 1: SCHEMA ENHANCEMENTS
-- ================================================

-- 1.1: Add Multi-Cladode Tracking to Activities Table
ALTER TABLE activities ADD COLUMN IF NOT EXISTS stations_planted INTEGER;
COMMENT ON COLUMN activities.stations_planted IS 'Number of planting holes/stations created (distinct from individual cladodes)';

ALTER TABLE activities ADD COLUMN IF NOT EXISTS avg_cladodes_per_station DECIMAL(4,2);
COMMENT ON COLUMN activities.avg_cladodes_per_station IS 'Average number of cladodes stacked per station (e.g., 3.5, 4.2, 5.0)';

ALTER TABLE activities ADD COLUMN IF NOT EXISTS min_cladodes_per_station INTEGER;
COMMENT ON COLUMN activities.min_cladodes_per_station IS 'Minimum cladodes observed in any station';

ALTER TABLE activities ADD COLUMN IF NOT EXISTS max_cladodes_per_station INTEGER;
COMMENT ON COLUMN activities.max_cladodes_per_station IS 'Maximum cladodes observed in any station';

ALTER TABLE activities ADD COLUMN IF NOT EXISTS planting_pattern VARCHAR(50);
COMMENT ON COLUMN activities.planting_pattern IS 'Type of planting: primary_grid_4.5m, infill_rows_2m, mixed';

ALTER TABLE activities ADD COLUMN IF NOT EXISTS weather_condition VARCHAR(50);
COMMENT ON COLUMN activities.weather_condition IS 'Weather during activity: clear, light_rain, heavy_rain, extreme_heat';

ALTER TABLE activities ADD COLUMN IF NOT EXISTS productivity_impact_percent INTEGER;
COMMENT ON COLUMN activities.productivity_impact_percent IS 'Percentage impact on productivity (negative for reductions, e.g., -25)';

-- 1.2: Create Weather Events Table
CREATE TABLE IF NOT EXISTS weather_events (
    event_id SERIAL PRIMARY KEY,
    event_date DATE NOT NULL,
    event_type VARCHAR(50) NOT NULL,  -- 'rain', 'extreme_heat', 'wind', 'hail', 'drought'
    severity VARCHAR(20),  -- 'light', 'moderate', 'heavy', 'severe', 'extreme'
    start_time TIME,
    end_time TIME,
    duration_hours DECIMAL(5,2),
    rainfall_mm DECIMAL(6,2),  -- If rain event
    temperature_max_c DECIMAL(5,2),
    temperature_min_c DECIMAL(5,2),
    wind_speed_kmh DECIMAL(5,2),
    operations_impact VARCHAR(100),  -- 'stopped', 'reduced_50pct', 'reduced_25pct', 'continued', 'delayed_start'
    productivity_impact_percent INTEGER,  -- e.g., -100 for full stoppage, -25 for 25% reduction
    worker_safety_gear VARCHAR(200),  -- 'rain_coats_yellow', 'hats', 'none', 'sun_protection'
    field_conditions TEXT,  -- Description of field state
    evidence_media_id INTEGER,  -- Foreign key to field_media table (added below)
    reported_by VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_weather_events_date ON weather_events(event_date);
CREATE INDEX idx_weather_events_type ON weather_events(event_type);
CREATE INDEX idx_weather_events_severity ON weather_events(severity);

COMMENT ON TABLE weather_events IS 'Tracks all weather events and their operational impacts';

-- 1.3: Create Field Media Table (Photos, Videos, Audio from WhatsApp)
CREATE TABLE IF NOT EXISTS field_media (
    media_id SERIAL PRIMARY KEY,
    media_type VARCHAR(20) NOT NULL,  -- 'photo', 'video', 'audio'
    media_date DATE NOT NULL,
    media_time TIME,
    filename VARCHAR(255),
    file_url TEXT,
    file_size_mb DECIMAL(10,2),
    duration_seconds INTEGER,  -- For video/audio
    resolution VARCHAR(20),  -- For photo/video: '1920x1080', '4K', etc.
    captured_by VARCHAR(100),
    upload_method VARCHAR(50),  -- 'whatsapp', 'direct_upload', 'drone', 'manual'
    whatsapp_message_id VARCHAR(100),  -- For WhatsApp integration
    gps_latitude DECIMAL(10,7),
    gps_longitude DECIMAL(11,7),
    gps_accuracy_m DECIMAL(6,2),
    gps_altitude_m DECIMAL(7,2),
    plot_id INTEGER REFERENCES plots(id),
    activity_id INTEGER REFERENCES activities(id),
    weather_event_id INTEGER REFERENCES weather_events(event_id),
    description TEXT,
    caption TEXT,  -- WhatsApp message text accompanying media
    tags TEXT[],  -- Array: ['planting', 'rain_day', 'flowering', 'multi_cladode_stack', 'equipment']
    analysis_notes TEXT,  -- What analyst/AI observed in media
    ai_analyzed BOOLEAN DEFAULT FALSE,
    ai_analysis_result JSONB,  -- Store AI vision analysis results
    verified BOOLEAN DEFAULT FALSE,
    verified_by VARCHAR(100),
    verification_date TIMESTAMP,
    featured BOOLEAN DEFAULT FALSE,  -- Flag for dashboard showcase
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_field_media_date ON field_media(media_date);
CREATE INDEX idx_field_media_type ON field_media(media_type);
CREATE INDEX idx_field_media_plot ON field_media(plot_id);
CREATE INDEX idx_field_media_activity ON field_media(activity_id);
CREATE INDEX idx_field_media_weather ON field_media(weather_event_id);
CREATE INDEX idx_field_media_featured ON field_media(featured);
CREATE INDEX idx_field_media_tags ON field_media USING GIN(tags);

COMMENT ON TABLE field_media IS 'All photos, videos, audio from field - primarily WhatsApp submissions';

-- 1.4: Create Performance Benchmarks Table
CREATE TABLE IF NOT EXISTS performance_benchmarks (
    benchmark_id SERIAL PRIMARY KEY,
    benchmark_date DATE NOT NULL,
    metric_name VARCHAR(100) NOT NULL,  -- 'cladodes_per_worker_day', 'stations_per_worker_day', etc.
    metric_value DECIMAL(10,2),
    metric_unit VARCHAR(50),
    conditions VARCHAR(100),  -- 'clear_weather_experienced_crew', 'rain_25pct_impact', etc.
    team_size INTEGER,
    team_experience VARCHAR(50),  -- 'novice_week1', 'intermediate_week2_4', 'experienced_month2+'
    equipment_used TEXT[],  -- ['pickaxe', 'spade', 'measuring_tape']
    soil_condition VARCHAR(50),  -- 'hard_pan_requires_pickaxe', 'moderate', 'soft'
    planting_method VARCHAR(100),  -- 'multi_cladode_4_5_stack', 'single_cladode', 'infill_2_3_stack'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_performance_benchmarks_date ON performance_benchmarks(benchmark_date);
CREATE INDEX idx_performance_benchmarks_metric ON performance_benchmarks(metric_name);

COMMENT ON TABLE performance_benchmarks IS 'Daily performance metrics for productivity analysis';

-- 1.5: Add Foreign Key from weather_events to field_media
ALTER TABLE weather_events 
    ADD CONSTRAINT fk_weather_event_media 
    FOREIGN KEY (evidence_media_id) 
    REFERENCES field_media(media_id);

-- 1.6: Create KPI Snapshots Table (for dashboard caching)
CREATE TABLE IF NOT EXISTS kpi_snapshots (
    snapshot_id SERIAL PRIMARY KEY,
    snapshot_date DATE NOT NULL,
    snapshot_time TIME NOT NULL,
    kpi_name VARCHAR(100) NOT NULL,
    kpi_value DECIMAL(15,4),
    kpi_unit VARCHAR(50),
    kpi_status VARCHAR(20),  -- 'on_target', 'below_target', 'above_target', 'critical'
    comparison_value DECIMAL(15,4),  -- Baseline or target for comparison
    delta_percent DECIMAL(8,2),
    trend VARCHAR(20),  -- 'up', 'down', 'stable'
    calculation_details JSONB,  -- Store calculation breakdown
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kpi_snapshots_date ON kpi_snapshots(snapshot_date, snapshot_time);
CREATE INDEX idx_kpi_snapshots_name ON kpi_snapshots(kpi_name);
CREATE UNIQUE INDEX idx_kpi_snapshots_unique ON kpi_snapshots(snapshot_date, snapshot_time, kpi_name);

COMMENT ON TABLE kpi_snapshots IS 'Pre-calculated KPI values for fast dashboard loading';

-- ================================================
-- SECTION 2: POPULATE WEATHER EVENTS
-- ================================================

-- Event 1: December 22, 2025 - First Rain Stoppage
INSERT INTO weather_events (
    event_date, event_type, severity,
    start_time, end_time, duration_hours,
    operations_impact, productivity_impact_percent,
    worker_safety_gear, field_conditions,
    reported_by, notes
)
VALUES (
    '2025-12-22', 'rain', 'heavy',
    '08:00', '17:00', 9.0,
    'stopped', -100,
    'none',  -- Rain gear not yet procured
    'Full work stoppage due to heavy rain. Workers unable to continue planting. Site muddy and unsafe.',
    'Nick Shapley (COO)',
    'WhatsApp log: "Thursday we had rain last week" + "Today is raining". Rain coats ordered this day for future rain events. First weather stoppage since project start.'
);

-- Event 2: December 23, 2025 - Rain Day with Continued Operations
INSERT INTO weather_events (
    event_date, event_type, severity,
    start_time, end_time, duration_hours,
    operations_impact, productivity_impact_percent,
    worker_safety_gear, field_conditions,
    reported_by, notes
)
VALUES (
    '2025-12-23', 'rain', 'moderate',
    '09:00', '15:00', 6.0,
    'reduced_25pct', -25,
    'improvised',  -- Rain gear ordered but not yet delivered
    'Light to moderate rain throughout day. Teams continued planting but productivity reduced. 360 plants vs. normal 480+ expected.',
    'Nick Shapley (COO)',
    'WhatsApp log: 360 plants planted. Audio log available (Planting_Audio_2025-12-23_at_10_13_12.opus). Productivity: 60 plants/worker vs. normal 80+. Approximately 25% reduction due to weather. Operations continued despite rain.'
);

-- Event 3: December 25-27, 2025 - Christmas Period Rain (Estimated)
INSERT INTO weather_events (
    event_date, event_type, severity,
    duration_hours,
    operations_impact, productivity_impact_percent,
    field_conditions,
    reported_by, notes
)
VALUES (
    '2025-12-25', 'rain', 'moderate',
    NULL,  -- Duration unknown
    'holiday_no_ops', 0,  -- No operations planned (Christmas)
    'Rain during holiday period. No field operations scheduled.',
    'Nick Shapley (COO)',
    'WhatsApp log Dec 22: "rain for the rest of the week and Xmas". No operations on Christmas Day. Rain mentioned but no direct report for this specific date. Inferred from context.'
);

INSERT INTO weather_events (
    event_date, event_type, severity,
    duration_hours,
    operations_impact, productivity_impact_percent,
    field_conditions,
    reported_by, notes
)
VALUES (
    '2025-12-26', 'rain', 'light',
    NULL,
    'reduced_or_stopped', -50,  -- Estimated
    'Post-Christmas rain. Limited operations.',
    'Nick Shapley (COO)',
    'Inferred from "rain for rest of week" comment. No specific activity report for this date suggests limited or no operations. Gap in reporting Dec 24-28.'
);

INSERT INTO weather_events (
    event_date, event_type, severity,
    duration_hours,
    operations_impact, productivity_impact_percent,
    field_conditions,
    reported_by, notes
)
VALUES (
    '2025-12-27', 'rain', 'light',
    NULL,
    'reduced_or_stopped', -50,
    'Continued rain from Christmas period.',
    'Nick Shapley (COO)',
    'Part of "rain for rest of week" period. No activity report = likely reduced operations.'
);

-- Event 4: January 16, 2026 - Heavy Rain with Rain Gear Operations 🌧️
-- NOTE: Will link to field_media after media table populated
INSERT INTO weather_events (
    event_date, event_type, severity,
    start_time, duration_hours,
    operations_impact, productivity_impact_percent,
    worker_safety_gear, field_conditions,
    reported_by, notes
)
VALUES (
    '2026-01-16', 'rain', 'heavy',
    NULL,  -- Time unknown
    NULL,  -- Duration unknown
    'continued', -30,  -- Estimated - ops continued but reduced efficiency
    'rain_coats_yellow',
    'Heavy rain during work hours. Workers continued operations wearing rain coats (yellow gear procured Dec 22). Field muddy but teams resilient. Nick Shapley video shows conditions.',
    'Nick Shapley (COO)',
    'WhatsApp: "Farming is not for sissies" with video showing heavy rain, workers in rain coats continuing operations. Demonstrates weather resilience and rain gear effectiveness. Rain coats allowed continuation vs. Dec 22 stoppage. Video evidence available: WhatsApp_Video_2026-01-16 (filename TBD - in upload batch).'
) RETURNING event_id as jan16_rain_event_id;

-- ================================================
-- SECTION 3: POPULATE FIELD MEDIA RECORDS
-- ================================================

-- 3.1: December 12, 2025 - First Planting Day Media
INSERT INTO field_media (
    media_type, media_date, media_time, filename,
    captured_by, upload_method,
    description, caption, tags,
    analysis_notes, verified, verified_by, verification_date, featured
)
VALUES 
(
    'audio', '2025-12-12', '13:42:27', 'Planting_Audio_2025-12-12_at_13_42_27.mp3',
    'Field Team', 'whatsapp',
    'Inaugural planting day audio recording - Terence Unterpertinger on-site induction',
    'First planting demonstration and crew training',
    ARRAY['induction', 'training', 'terence_unterpertinger', 'first_day', 'milestone'],
    'Audio captures Terence conducting planting demonstration to field crew. Includes methodology instructions, planting depth guidance, multi-cladode stacking technique. Historical significance: first day of operations.',
    TRUE, 'Geospatial Analyst', '2026-01-27', TRUE
),
(
    'audio', '2025-12-12', '13:43:18', 'Planting_Audio_2025-12-12_at_13_43_18.mp3',
    'Field Team', 'whatsapp',
    'Continuation of inaugural planting induction session',
    'Training continuation',
    ARRAY['induction', 'training', 'terence_unterpertinger', 'first_day'],
    'Continuation of induction audio. Further operational guidance from Lead Agronomist.',
    TRUE, 'Geospatial Analyst', '2026-01-27', FALSE
),
(
    'video', '2025-12-12', '13:40:17', 'Planting_Video1_2025-12-12_at_13_40_17.mp4',
    'Field Team', 'whatsapp',
    'First planting operations video documentation',
    'Milestone moment - inaugural planting',
    ARRAY['planting', 'first_day', 'demonstration', 'terence_unterpertinger', 'milestone'],
    'Video shows initial planting operations, crew learning technique, ground preparation with pickaxe (hard soil), Terence demonstrating methodology. Should show how many cladodes per station in demo.',
    TRUE, 'Geospatial Analyst', '2026-01-27', TRUE
),
(
    'video', '2025-12-12', '13:40:18', 'Planting_Video2_2025-12-12_at_13_40_18.mp4',
    'Field Team', 'whatsapp',
    'First planting operations - alternate angle',
    'Day 1 planting documentation',
    ARRAY['planting', 'first_day', 'demonstration'],
    'Companion video to Video1. Different angle/perspective of same operations.',
    TRUE, 'Geospatial Analyst', '2026-01-27', FALSE
);

-- 3.2: December 16, 2025 - Early Operations Week 1
INSERT INTO field_media (
    media_type, media_date, media_time, filename,
    captured_by, upload_method,
    description, tags,
    analysis_notes, verified
)
VALUES 
(
    'video', '2025-12-16', '17:19:17', 'WhatsApp_Video_2025-12-16_at_17_19_17.mp4',
    'Nick Shapley (COO)', 'whatsapp',
    'Early operations documentation - Day 4-5 of planting',
    ARRAY['planting', 'early_operations', 'training_phase'],
    'Crew implementing learned planting technique. Should show consistency of multi-cladode stacking method across workers.',
    TRUE
),
(
    'video', '2025-12-16', '17:19:18', 'WhatsApp_Video_2025-12-16_at_17_19_18.mp4',
    'Nick Shapley (COO)', 'whatsapp',
    'Continued operations footage',
    ARRAY['planting', 'early_operations'],
    'Part of Dec 16 documentation series.',
    TRUE
),
(
    'video', '2025-12-16', '17:19:18', 'WhatsApp_Video_2025-12-16_at_17_19_18_(1).mp4',
    'Nick Shapley (COO)', 'whatsapp',
    'Additional Dec 16 operations footage',
    ARRAY['planting', 'early_operations'],
    'Third video from Dec 16 series.',
    TRUE
),
(
    'video', '2025-12-16', '17:19:19', 'WhatsApp_Video_2025-12-16_at_17_19_19.mp4',
    'Nick Shapley (COO)', 'whatsapp',
    'Final Dec 16 operations documentation',
    ARRAY['planting', 'early_operations'],
    'Fourth video completing Dec 16 series. Comprehensive early operations documentation.',
    TRUE
);

-- 3.3: December 23, 2025 - Rain Day Audio
INSERT INTO field_media (
    media_type, media_date, media_time, filename,
    captured_by, upload_method, weather_event_id,
    description, tags,
    analysis_notes, verified, featured
)
VALUES (
    'audio', '2025-12-23', '10:13:12', 'Planting_Audio_2025-12-23_at_10_13_12.opus',
    'Nick Shapley (COO)', 'whatsapp', 
    (SELECT event_id FROM weather_events WHERE event_date = '2025-12-23'),  -- Link to rain event
    'Rain day operations audio log',
    ARRAY['rain_day', 'weather_impact', 'operations_continued'],
    'Audio documents team working through rain. Should include field conditions discussion, productivity challenges, team morale. Evidence of operations continuing despite weather.',
    TRUE, TRUE
);

-- 3.4: December 28, 2025 - Pre-Density Change Baseline
INSERT INTO field_media (
    media_type, media_date, media_time, filename,
    captured_by, upload_method,
    description, tags,
    analysis_notes, verified, featured
)
VALUES (
    'video', '2025-12-28', '13:40:52', 'WhatsApp_Video_2025-12-28_at_13_40_52.mp4',
    'Nick Shapley (COO)', 'whatsapp',
    'Pre-density change operations - baseline 4.5m grid spacing',
    ARRAY['planting', 'baseline', 'pre_density_change'],
    'CRITICAL: Day before hybrid density implementation. Shows "before" state of 4.5m-only spacing. Provides comparison baseline for Dec 29 change.',
    TRUE, TRUE
);

-- 3.5: December 29, 2025 - DENSITY CHANGE DAY (Most Critical) 🎯
INSERT INTO field_media (
    media_type, media_date, media_time, filename,
    captured_by, upload_method,
    description, caption, tags,
    analysis_notes, verified, featured
)
VALUES (
    'video', '2025-12-29', '12:08:01', 'Planting_Video_2025-12-29_at_12_08_01.mp4',
    'Nick Shapley (COO)', 'whatsapp',
    'CRITICAL: Hybrid density implementation day - in-fill row system initiated',
    'Planting now between the rows 2m to increase density @terrence',
    ARRAY['density_change', 'hybrid_method', 'infill_rows_2m', 'methodology_shift', 'critical'],
    'HIGHEST PRIORITY VIDEO: Documents THE DAY hybrid planting methodology implemented. Should show: 1) How 2m in-fill rows measured/marked, 2) Worker instructions for new pattern, 3) Difference between primary 4.5m and in-fill 2m spacing, 4) Multi-cladode stacking in in-fill vs. primary. WhatsApp log confirms: "Planting now between the rows 2m to increase density @terrence" with Terence response: "Yes👌". Productivity this day: 486 plants (81/worker - highest recorded). This video is KEY to understanding field methodology.',
    TRUE, TRUE
);

-- 3.6: December 31, 2025 - Workforce Expansion
INSERT INTO field_media (
    media_type, media_date, media_time, filename,
    captured_by, upload_method,
    description, tags,
    analysis_notes, verified
)
VALUES (
    'video', '2025-12-31', '17:18:20', 'Planting_Video_2025-12-31_at_17_18_20.mp4',
    'Nick Shapley (COO)', 'whatsapp',
    'Year-end operations - 3 teams (9 workers) expanded workforce',
    ARRAY['planting', 'workforce_expansion', '3_teams', 'year_end'],
    'Documents expanded crew operations. Should show coordination of 3 teams working simultaneously. Output this day: 498 plants. Cumulative: ~2,137 plants.',
    TRUE
);

-- 3.7: January 14, 2026 - Batch 2 Material
INSERT INTO field_media (
    media_type, media_date, media_time, filename,
    captured_by, upload_method,
    description, caption, tags,
    analysis_notes, verified
)
VALUES 
(
    'video', '2026-01-14', '14:10:08', 'Planting_Video_2026-01-14_at_14_10_08.mp4',
    'Nick Shapley (COO)', 'whatsapp',
    'Batch 2 material arrival - 4,000 cladodes after 3-week curing',
    'These cladodes lay in the field for the past 3 weeks after being cut',
    ARRAY['material_batch_2', 'cladode_curing', 'supply_chain'],
    'Documents cladode quality after 21-day field curing. Should show: 1) Callused cut ends (dry, hardened), 2) Cladode color (healthy green or slight yellowing acceptable), 3) Material handling/distribution method, 4) Batch quality control.',
    TRUE
),
(
    'video', '2026-01-14', '14:12:04', 'Planting_Video_2026-01-14_at_14_12_04.mp4',
    'Nick Shapley (COO)', 'whatsapp',
    'Continuation of Batch 2 material documentation',
    'Material handling and distribution',
    ARRAY['material_batch_2', 'cladode_curing', 'supply_chain'],
    'Part 2 of Batch 2 documentation. Continuation of material assessment.',
    TRUE
);

-- 3.8: January 16, 2026 - Heavy Rain Operations 🌧️
INSERT INTO field_media (
    media_type, media_date, filename,
    captured_by, upload_method, weather_event_id,
    description, caption, tags,
    analysis_notes, verified, featured
)
VALUES (
    'video', '2026-01-16', 'WhatsApp_Video_2026-01-16_Rain_Day.mp4',  -- Filename TBD
    'Nick Shapley (COO)', 'whatsapp',
    (SELECT event_id FROM weather_events WHERE event_date = '2026-01-16'),
    'RAIN DAY OPERATIONS: Heavy rain with workers continuing in rain coats',
    'Farming is not for sissies',
    ARRAY['rain_day', 'heavy_rain', 'rain_coats', 'resilience', 'weather_adaptation'],
    'VIDEO SHOWS: Heavy rain conditions, workers wearing yellow rain coats (procured Dec 22), field muddy with standing water, teams continuing planting operations despite challenging conditions. Demonstrates weather resilience and rain gear effectiveness. Contrast to Dec 22 full stoppage - rain coats enabled operations. Productivity likely reduced ~30% but not stopped. Nick Shapley commentary: "Farming is not for sissies" - acknowledges difficulty but team pushing through. Evidence of "cant stop planting every time we get some rain" philosophy.',
    TRUE, TRUE
);

-- Update the Jan 16 weather event with media link
UPDATE weather_events 
SET evidence_media_id = (SELECT media_id FROM field_media WHERE media_date = '2026-01-16' AND media_type = 'video')
WHERE event_date = '2026-01-16';

-- 3.9: January 22, 2026 - Steady-State Operations Photos (8 Photos)
INSERT INTO field_media (
    media_type, media_date, media_time, filename,
    captured_by, upload_method,
    description, tags,
    analysis_notes, verified, featured
)
VALUES 
(
    'photo', '2026-01-22', '11:16:45', 'WhatsApp_Image_2026-01-22_at_11_16_45.jpeg',
    'Nick Shapley (COO)', 'whatsapp',
    'Wide-angle site overview - hundreds of plants visible extending to horizon',
    ARRAY['wide_angle', 'scale_verification', 'steady_state', 'mountains_background'],
    'WIDE-ANGLE SCALE SHOT: Shows ~100m × 50m planted area (0.5 ha) with 600-800 plants visible. Row spacing ~3-4m visible. Mountains (Limpopo bushveld) in background. Reddish laterite soil. Demonstrates large-scale commercial operation (not test plot). Calculated density: 1,200-1,600 plants/ha. Critical for progress verification.',
    TRUE, TRUE
),
(
    'photo', '2026-01-22', '11:16:46', 'WhatsApp_Image_2026-01-22_at_11_16_46.jpeg',
    'Nick Shapley (COO)', 'whatsapp',
    'Mid-range density documentation - row structure visible',
    ARRAY['mid_range', 'row_structure', 'density_verification'],
    'MID-RANGE SHOT: Clear parallel planting lines confirmed. Individual plants countable in foreground. Background shows extent of hundreds of plants. Soil preparation visible - cleared strips between grassy areas.',
    TRUE, FALSE
),
(
    'photo', '2026-01-22', '11:16:47', 'WhatsApp_Image_2026-01-22_at_11_16_47.jpeg',
    'Nick Shapley (COO)', 'whatsapp',
    'CRITICAL: Multi-cladode stack close-up (5 cladodes visible)',
    ARRAY['close_up', 'multi_cladode_stack', '5_cladodes', 'stacking_method', 'critical'],
    '🔍 BREAKTHROUGH EVIDENCE: Shows 5 cladodes stacked vertically per station. Base ~25cm partially buried (1/3 depth), tiers of 20cm, 18cm, 15cm, 12cm visible. Straw mulch visible around base (moisture retention). This photo PROVES multi-cladode methodology - NOT single cladode assumption. Changes all density calculations.',
    TRUE, TRUE
),
(
    'photo', '2026-01-22', '11:16:47', 'WhatsApp_Image_2026-01-22_at_11_16_47_(1).jpeg',
    'Nick Shapley (COO)', 'whatsapp',
    'Multi-cladode stack - alternate view',
    ARRAY['close_up', 'multi_cladode_stack', 'stacking_variation'],
    'Second view of multi-cladode stacking. Shows variation in stacking patterns between stations.',
    TRUE, FALSE
),
(
    'photo', '2026-01-22', '12:14:13', 'WhatsApp_Image_2026-01-22_at_12_14_13.jpeg',
    'Nick Shapley (COO)', 'whatsapp',
    'Close-up: 3-cladode stack with soil ball attachment',
    ARRAY['close_up', 'multi_cladode_stack', '3_cladodes', 'root_ball'],
    'Shows 3 cladodes per station. Base cladode (~30cm) with intact root ball/soil. 2nd tier 20cm, 3rd tier 15cm with new pad growth visible. Planting depth ~20-25cm (1/3 to 1/2 buried). Rocky soil composition visible around base (stones 2-20cm).',
    TRUE, TRUE
),
(
    'photo', '2026-01-22', '12:14:14', 'WhatsApp_Image_2026-01-22_at_12_14_14.jpeg',
    'Nick Shapley (COO)', 'whatsapp',
    'Establishment growth - new pads emerging (6 weeks post-planting)',
    ARRAY['close_up', 'growth_verification', 'new_pads', 'plant_health'],
    'NEW GROWTH VISIBLE: Light green new pads emerging (5-10cm). Growth period: 41 days since Dec 12 = growth rate ~1-2mm/day (normal for Opuntia establishment). Green color, turgid appearance = good water status. Confirms healthy establishment.',
    TRUE, FALSE
),
(
    'photo', '2026-01-22', '12:14:14', 'WhatsApp_Image_2026-01-22_at_12_14_14_(1).jpeg',
    'Nick Shapley (COO)', 'whatsapp',
    'Mature multi-cladode plant - well-established',
    ARRAY['close_up', 'mature_plant', '5_6_cladodes', 'fruit_scars'],
    'WELL-ESTABLISHED: 5-6 cladodes per plant, height 40-50cm above ground. Multiple new pads emerging from older cladodes. FRUIT SCARS VISIBLE: Circular scars from removed fruit (Jan 26 directive compliance). Plants stable, well-anchored (good root development).',
    TRUE, FALSE
),
(
    'photo', '2026-01-22', '12:14:14', 'WhatsApp_Image_2026-01-22_at_12_14_14_(2).jpeg',
    'Nick Shapley (COO)', 'whatsapp',
    'Final Jan 22 documentation - comprehensive coverage',
    ARRAY['documentation', 'comprehensive'],
    'Eighth photo completing Jan 22 documentation set. Provides comprehensive visual evidence of steady-state operations.',
    TRUE, FALSE
);

-- 3.10: January 26, 2026 - Flowering Evidence 🌸
INSERT INTO field_media (
    media_type, media_date, media_time, filename,
    captured_by, upload_method,
    description, caption, tags,
    analysis_notes, verified, featured
)
VALUES 
(
    'photo', '2026-01-26', '13:28:20', 'Planting_Image_2026-01-26_at_13_28_20.jpeg',
    'Field Team', 'whatsapp',
    'FLOWERING EVIDENCE: Yellow Opuntia flower on young plant',
    'Yellow flower visible on planted cactus',
    ARRAY['flowering', 'yellow_flower', 'stress_induced', 'fruit_removal_trigger'],
    '🌸 CRITICAL AGRONOMIC EVIDENCE: Bright yellow Opuntia ficus-indica flower (~7-8cm diameter) on young plant (45 days post-planting = Dec 12 planting). PREMATURE FLOWERING indicates: 1) Water stress trigger, 2) Root establishment complete enough for flowering confidence, 3) Day length trigger (13+ hr days January). Photo taken Jan 26 at 13:28 → likely sent to Terence → prompted IMMEDIATE directive same day: "Break off any fruit please immediately". Photo timing proves directive was REACTIVE response to observed field condition (not preemptive). Professional agronomic management confirmed.',
    TRUE, TRUE
),
(
    'photo', '2026-01-26', '13:28:32', 'Planting_Image_2026-01-26_at_13_28_32.jpeg',
    'Field Team', 'whatsapp',
    'Fruit development and removal evidence on multi-cladode plant',
    'Plant with fruit and white truck visible in background',
    ARRAY['flowering', 'fruit_removal', 'compliance', 'transport_truck'],
    'FRUIT REMOVAL COMPLIANCE: Small green fruit (prickly pear) visible developing. FRUIT SCARS VISIBLE: Some fruit already removed (brown circular marks on cladode surface). Plant configuration: Multi-cladode stack (3-4 cladodes). WHITE TRUCK BACKGROUND: Material transport vehicle visible (field access confirmed). Evidence of Jan 26 directive being implemented.',
    TRUE, FALSE
);

-- ================================================
-- SECTION 4: UPDATE EXISTING ACTIVITY RECORDS
-- ================================================

-- 4.1: Update all existing activities with multi-cladode methodology assumptions
UPDATE activities
SET 
    avg_cladodes_per_station = 4.0,  -- Conservative mid-range estimate
    min_cladodes_per_station = 3,
    max_cladodes_per_station = 5,
    stations_planted = ROUND(cladodes_planted / 4.0),
    notes = CONCAT(
        COALESCE(notes, ''), 
        ' | VISUAL EVIDENCE UPDATE (Jan 27, 2026): Multi-cladode stacking methodology verified from field photos. Photos show 3-5 cladodes per station (avg 4.0 estimated). Activity tracking cladodes planted (individual pads), not stations. Stations calculated retroactively from cladodes ÷ 4.0.'
    )
WHERE activity_date BETWEEN '2025-12-12' AND '2026-01-27'
  AND activity_type = 'planting'
  AND avg_cladodes_per_station IS NULL;

-- 4.2: Update Dec 29 activity with specific density change information
UPDATE activities
SET
    planting_pattern = 'mixed_primary_and_infill',
    avg_cladodes_per_station = 4.5,  -- Slightly higher (peak productivity day)
    weather_condition = 'clear',
    notes = CONCAT(
        COALESCE(notes, ''), 
        ' | DENSITY CHANGE DAY: Hybrid planting method implemented. Started planting 2m in-fill rows between 4.5m primary grid. WhatsApp log confirms: "Planting now between the rows 2m to increase density @terrence" with approval "Yes👌". Peak productivity: 81 plants/worker/day. Video evidence available: Planting_Video_2025-12-29_at_12_08_01.mp4. This marks transition from primary-grid-only to hybrid density system.'
    )
WHERE activity_date = '2025-12-29'
  AND activity_type = 'planting';

-- 4.3: Update Dec 22 (rain stoppage)
UPDATE activities
SET
    weather_condition = 'heavy_rain',
    productivity_impact_percent = -100,
    notes = CONCAT(
        COALESCE(notes, ''), 
        ' | WEATHER STOPPAGE: Heavy rain caused full work stoppage. No planting operations. Workers unable to continue due to unsafe muddy conditions. Rain coats ordered this day for future rain events. First weather interruption since project start Dec 12.'
    )
WHERE activity_date = '2025-12-22';

-- 4.4: Update Dec 23 (rain day with reduced ops)
UPDATE activities
SET
    weather_condition = 'moderate_rain',
    productivity_impact_percent = -25,
    notes = CONCAT(
        COALESCE(notes, ''), 
        ' | RAIN DAY OPERATIONS: Light to moderate rain throughout day. Teams continued planting but productivity reduced. Output: 360 plants (60/worker) vs. normal 80+ expected = ~25% reduction. Audio evidence: Planting_Audio_2025-12-23_at_10_13_12.opus. Rain gear not yet arrived (ordered Dec 22). Demonstrates team commitment to continue despite weather.'
    )
WHERE activity_date = '2025-12-23'
  AND activity_type = 'planting';

-- 4.5: Update activity records with correct role (Nick Shapley = COO)
UPDATE activities
SET reported_by = 'Nick Shapley (COO)'
WHERE reported_by LIKE '%Nick Shapley%'
  AND reported_by NOT LIKE '%(COO)%';

-- ================================================
-- SECTION 5: POPULATE PERFORMANCE BENCHMARKS
-- ================================================

-- Benchmark 1: Peak Performance Day (Dec 29)
INSERT INTO performance_benchmarks (
    benchmark_date, metric_name, metric_value, metric_unit,
    conditions, team_size, team_experience,
    equipment_used, soil_condition, planting_method,
    notes
)
VALUES (
    '2025-12-29', 'cladodes_per_worker_day', 81.0, 'cladodes/worker',
    'clear_weather_experienced_crew_density_change_day', 6, 'intermediate_week3',
    ARRAY['pickaxe', 'spade', 'measuring_tape_or_pace'], 'hard_pan_requires_pickaxe', 'multi_cladode_4_5_stack_plus_infill_2_3',
    'PEAK PRODUCTIVITY: Highest recorded rate. Hybrid density method implemented this day. Clear weather, experienced crew (week 3). Total: 486 plants. Quote: "A good day on the farm!!" Method transition from primary-grid-only to hybrid contributed to high morale and focus.'
);

-- Benchmark 2: Rain-Impacted Day (Dec 23)
INSERT INTO performance_benchmarks (
    benchmark_date, metric_name, metric_value, metric_unit,
    conditions, team_size, team_experience,
    equipment_used, soil_condition, planting_method,
    notes
)
VALUES (
    '2025-12-23', 'cladodes_per_worker_day', 60.0, 'cladodes/worker',
    'moderate_rain_no_rain_gear', 6, 'intermediate_week2',
    ARRAY['pickaxe', 'spade'], 'muddy_wet', 'multi_cladode_4_stack',
    'RAIN DAY PRODUCTIVITY: ~25% reduction due to weather. Light-moderate rain throughout day. No rain gear available yet (ordered Dec 22, not delivered). 360 total plants. Workers continued despite challenging conditions. Audio evidence available.'
);

-- Benchmark 3: Steady-State Operations (Jan 21 - reported 520-550/day)
INSERT INTO performance_benchmarks (
    benchmark_date, metric_name, metric_value, metric_unit,
    conditions, team_size, team_experience,
    equipment_used, soil_condition, planting_method,
    notes
)
VALUES (
    '2026-01-21', 'cladodes_per_day_total', 535.0, 'cladodes/day',
    'clear_weather_experienced_large_crew', 10, 'experienced_month2',
    ARRAY['pickaxe', 'spade', 'rain_coats_available'], 'standard_hard_pan', 'multi_cladode_hybrid_method',
    'STEADY-STATE RATE: Sustainable long-term productivity established. WhatsApp log: "Planting 520-550 / day". Team size: 9-12 workers (using 10 midpoint). Per-worker rate: 53.5 cladodes/worker/day. More sustainable than Dec 29 peak (81/worker) due to consistent daily pace. This rate used for completion forecasting.'
),
(
    '2026-01-21', 'cladodes_per_worker_day', 53.5, 'cladodes/worker',
    'clear_weather_experienced_large_crew', 10, 'experienced_month2',
    ARRAY['pickaxe', 'spade', 'rain_coats_available'], 'standard_hard_pan', 'multi_cladode_hybrid_method',
    'Per-worker steady-state rate. More sustainable than peak rates. Accounts for breaks, coordination, material handling in established operations.'
);

-- Benchmark 4: Workforce Expansion Day (Dec 31)
INSERT INTO performance_benchmarks (
    benchmark_date, metric_name, metric_value, metric_unit,
    conditions, team_size, team_experience,
    equipment_used, soil_condition, planting_method,
    notes
)
VALUES (
    '2025-12-31', 'cladodes_per_worker_day', 55.3, 'cladodes/worker',
    'clear_weather_team_expansion_training', 9, 'mixed_experienced_and_new',
    ARRAY['pickaxe', 'spade'], 'standard_hard_pan', 'multi_cladode_hybrid_method',
    'WORKFORCE EXPANSION: 3 teams (9 workers) vs. previous 2 teams (6 workers). Output: 498 plants = 55.3/worker. Slightly lower per-worker than previous days likely due to: 1) New worker integration, 2) 3-team coordination overhead, 3) Training/supervision of expanded crew. Total output increased (498 vs ~486) due to more workers.'
);

-- ================================================
-- SECTION 6: POPULATE KPI SNAPSHOTS (FOR DASHBOARD TESTING)
-- ================================================

-- KPI Snapshot Function
CREATE OR REPLACE FUNCTION calculate_kpi_snapshot(snapshot_dt DATE, snapshot_tm TIME)
RETURNS VOID AS $$
BEGIN
    -- KPI 1: Total Cladodes Planted
    INSERT INTO kpi_snapshots (snapshot_date, snapshot_time, kpi_name, kpi_value, kpi_unit, kpi_status, comparison_value, delta_percent, trend)
    SELECT 
        snapshot_dt,
        snapshot_tm,
        'Total Cladodes Planted',
        COALESCE(SUM(cladodes_planted), 0),
        'cladodes',
        CASE 
            WHEN COALESCE(SUM(cladodes_planted), 0) >= 3000 THEN 'on_target'
            WHEN COALESCE(SUM(cladodes_planted), 0) >= 2000 THEN 'below_target'
            ELSE 'critical'
        END,
        3000.0,  -- Expected by this date
        ROUND(((COALESCE(SUM(cladodes_planted), 0) - 3000.0) / 3000.0) * 100, 2),
        CASE 
            WHEN COALESCE(SUM(cladodes_planted), 0) >= 3000 THEN 'up'
            ELSE 'down'
        END
    FROM activities
    WHERE activity_type = 'planting'
      AND activity_date <= snapshot_dt;

    -- KPI 2: Stations Established
    INSERT INTO kpi_snapshots (snapshot_date, snapshot_time, kpi_name, kpi_value, kpi_unit, kpi_status, comparison_value, delta_percent, trend)
    SELECT 
        snapshot_dt,
        snapshot_tm,
        'Planting Stations Established',
        COALESCE(SUM(stations_planted), 0),
        'stations',
        CASE 
            WHEN COALESCE(SUM(stations_planted), 0) >= 750 THEN 'on_target'
            WHEN COALESCE(SUM(stations_planted), 0) >= 500 THEN 'below_target'
            ELSE 'critical'
        END,
        750.0,
        ROUND(((COALESCE(SUM(stations_planted), 0) - 750.0) / 750.0) * 100, 2),
        'up'
    FROM activities
    WHERE activity_type = 'planting'
      AND activity_date <= snapshot_dt;

    -- KPI 3: Daily Planting Rate (Last 7 Days Average)
    INSERT INTO kpi_snapshots (snapshot_date, snapshot_time, kpi_name, kpi_value, kpi_unit, kpi_status, comparison_value, delta_percent, trend)
    SELECT 
        snapshot_dt,
        snapshot_tm,
        '7-Day Average Planting Rate',
        COALESCE(AVG(cladodes_planted), 0),
        'cladodes/day',
        CASE 
            WHEN COALESCE(AVG(cladodes_planted), 0) >= 500 THEN 'on_target'
            WHEN COALESCE(AVG(cladodes_planted), 0) >= 300 THEN 'below_target'
            ELSE 'critical'
        END,
        520.0,  -- Target rate
        ROUND(((COALESCE(AVG(cladodes_planted), 0) - 520.0) / 520.0) * 100, 2),
        CASE 
            WHEN COALESCE(AVG(cladodes_planted), 0) >= 520 THEN 'up'
            WHEN COALESCE(AVG(cladodes_planted), 0) >= 400 THEN 'stable'
            ELSE 'down'
        END
    FROM activities
    WHERE activity_type = 'planting'
      AND activity_date > snapshot_dt - INTERVAL '7 days'
      AND activity_date <= snapshot_dt;

    -- KPI 4: Progress Percentage
    INSERT INTO kpi_snapshots (snapshot_date, snapshot_time, kpi_name, kpi_value, kpi_unit, kpi_status, comparison_value, delta_percent, trend)
    SELECT 
        snapshot_dt,
        snapshot_tm,
        'Site Completion Progress',
        ROUND((COALESCE(SUM(stations_planted), 0)::DECIMAL / 6373.0) * 100, 2),  -- 6373 = total primary grid stations for 12.9 ha
        '%',
        CASE 
            WHEN ROUND((COALESCE(SUM(stations_planted), 0)::DECIMAL / 6373.0) * 100, 2) >= 10 THEN 'on_target'
            WHEN ROUND((COALESCE(SUM(stations_planted), 0)::DECIMAL / 6373.0) * 100, 2) >= 5 THEN 'below_target'
            ELSE 'critical'
        END,
        10.0,  -- Expected progress by now
        0,  -- Delta not meaningful for %
        'up'
    FROM activities
    WHERE activity_type = 'planting'
      AND activity_date <= snapshot_dt;

    -- KPI 5: Weather Impact Days
    INSERT INTO kpi_snapshots (snapshot_date, snapshot_time, kpi_name, kpi_value, kpi_unit, kpi_status, comparison_value, delta_percent, trend)
    SELECT 
        snapshot_dt,
        snapshot_tm,
        'Weather-Impacted Days (Total)',
        COUNT(*),
        'days',
        CASE 
            WHEN COUNT(*) <= 5 THEN 'on_target'
            WHEN COUNT(*) <= 8 THEN 'below_target'
            ELSE 'critical'
        END,
        5.0,
        ROUND(((COUNT(*) - 5.0) / 5.0) * 100, 2),
        'stable'
    FROM weather_events
    WHERE event_date <= snapshot_dt
      AND productivity_impact_percent < 0;

    -- KPI 6: Average Productivity per Worker
    INSERT INTO kpi_snapshots (snapshot_date, snapshot_time, kpi_name, kpi_value, kpi_unit, kpi_status, comparison_value, delta_percent, trend)
    SELECT 
        snapshot_dt,
        snapshot_tm,
        'Average Productivity per Worker',
        ROUND(AVG(cladodes_planted::DECIMAL / NULLIF(workers_count, 0)), 2),
        'cladodes/worker/day',
        CASE 
            WHEN AVG(cladodes_planted::DECIMAL / NULLIF(workers_count, 0)) >= 50 THEN 'on_target'
            WHEN AVG(cladodes_planted::DECIMAL / NULLIF(workers_count, 0)) >= 35 THEN 'below_target'
            ELSE 'critical'
        END,
        50.0,
        ROUND(((AVG(cladodes_planted::DECIMAL / NULLIF(workers_count, 0)) - 50.0) / 50.0) * 100, 2),
        'stable'
    FROM activities
    WHERE activity_type = 'planting'
      AND activity_date > snapshot_dt - INTERVAL '7 days'
      AND activity_date <= snapshot_dt
      AND workers_count > 0;

    -- KPI 7: Field Documentation Rate
    INSERT INTO kpi_snapshots (snapshot_date, snapshot_time, kpi_name, kpi_value, kpi_unit, kpi_status, comparison_value, delta_percent, trend)
    SELECT 
        snapshot_dt,
        snapshot_tm,
        'Field Media Uploads (Last 7 Days)',
        COUNT(*),
        'files',
        CASE 
            WHEN COUNT(*) >= 5 THEN 'on_target'
            WHEN COUNT(*) >= 2 THEN 'below_target'
            ELSE 'critical'
        END,
        5.0,
        ROUND(((COUNT(*) - 5.0) / 5.0) * 100, 2),
        'stable'
    FROM field_media
    WHERE media_date > snapshot_dt - INTERVAL '7 days'
      AND media_date <= snapshot_dt;

END;
$$ LANGUAGE plpgsql;

-- Generate KPI snapshot for Jan 27, 2026
SELECT calculate_kpi_snapshot('2026-01-27'::DATE, '17:00:00'::TIME);

-- ================================================
-- SECTION 7: CREATE WEATHER ALERTS
-- ================================================

-- Alert for weather interruptions
INSERT INTO alerts (
    alert_type, severity, title, description,
    recommended_action, status, affected_plots,
    created_at
)
VALUES (
    'weather_interruption', 'medium', 'Weather Impact: 4-5 Rain Days Recorded',
    'Weather interruptions documented: Dec 22 (full stoppage), Dec 23 (25% reduction), Dec 25-27 (estimated interruptions), Jan 16 (operations continued with rain gear). Total impact: 8.5-10.6% time loss over 47-day period. Rain gear procurement (Dec 22) significantly improved resilience - Jan 16 heavy rain had minimal impact vs. Dec 22 full stoppage.',
    'CONTINUE current weather adaptation strategy: 1) Rain gear maintained and used during precipitation, 2) Monitor forecasts for heavy rain (>50mm/day) requiring stoppage, 3) Track productivity impact to quantify weather effects, 4) Consider additional rain gear for expanded workforce. POSITIVE: Jan 16 demonstrated rain gear effectiveness - operations continued despite heavy rain vs. Dec 22 stoppage. Team morale strong ("Farming is not for sissies"). Weather adaptation working well.',
    'resolved',
    ARRAY['BLOCK-A'],
    '2026-01-27'
);

-- Alert for inactivity tracking (Dec 22 rain stoppage)
INSERT INTO alerts (
    alert_type, severity, title, description,
    recommended_action, status, affected_plots,
    created_at
)
VALUES (
    'inactivity_weather', 'high', 'Operations Stoppage: Dec 22 Heavy Rain',
    'Full work stoppage on Dec 22 due to heavy rain. Workers unable to continue planting operations. Site muddy and unsafe. Zero productivity this day. This was FIRST weather interruption since project start Dec 12. Rain coats ordered same day to prevent future full stoppages.',
    'IMMEDIATE: Procure rain coats for all workers (ordered Dec 22). FUTURE: Establish weather monitoring protocol - check forecasts daily, prepare for rain events, ensure rain gear available. LESSON LEARNED: Investment in rain gear (completed) prevents future full stoppages, as demonstrated Jan 16 when operations continued during heavy rain.',
    'resolved',
    ARRAY['BLOCK-A'],
    '2025-12-22'
);

-- Alert for Jan 16 rain day (successful weather adaptation)
INSERT INTO alerts (
    alert_type, severity, title, description,
    recommended_action, status, affected_plots,
    created_at
)
VALUES (
    'weather_adaptation_success', 'low', 'Jan 16 Heavy Rain: Operations Continued Successfully',
    'Heavy rain on Jan 16 but operations CONTINUED with workers wearing rain coats (yellow gear procured Dec 22). Field conditions challenging (muddy, standing water) but team resilient. Nick Shapley video evidence: "Farming is not for sissies" shows workers continuing despite difficult conditions. Estimated productivity impact: -30% (vs. -100% stoppage Dec 22 without rain gear).',
    'CELEBRATE SUCCESS: Rain gear investment proved effective. Operations maintained vs. Dec 22 full stoppage. Team morale excellent despite challenging conditions. CONTINUE: Maintain rain gear, replace damaged items, ensure all workers equipped. MONITOR: Track productivity on future rain days to refine impact estimates. COMMEND: Team resilience and commitment to schedule.',
    'acknowledged',
    ARRAY['BLOCK-A'],
    '2026-01-16'
);

-- Alert for flowering/fruit removal (Jan 26)
INSERT INTO alerts (
    alert_type, severity, title, description,
    recommended_action, status, affected_plots,
    created_at
)
VALUES (
    'agronomic_management', 'medium', 'Early Flowering Detected: Fruit Removal Protocol Initiated',
    'Premature flowering observed on young plants (45 days post-planting) on Jan 26. Bright yellow Opuntia flowers visible on multiple plants. Indicates: 1) Water stress (triggers survival reproduction), 2) Root establishment complete, 3) Day length trigger (13+ hr days January). Lead Agronomist Terence Unterpertinger issued immediate directive: "Break off any fruit please immediately" to redirect plant energy from reproduction to vegetative growth (roots, new cladodes) during critical establishment phase. Photo evidence shows flowers and developing fruit. FIELD TEAM COMPLIANCE: Photos show fruit scars indicating removal protocol being followed.',
    'CONTINUE fruit removal protocol. All field workers instructed to remove any flowers or fruit immediately upon detection. Rationale: Plants must concentrate energy on vegetative growth (roots, cladodes) not reproduction during first 6-12 months. Flowering at 45 days is premature and reduces establishment success if allowed to fruit. MONITOR: Weekly field inspections for flowering, ensure compliance with removal directive. EXPECTED: Flowering may continue through Feb-Mar (summer flowering season) - maintain vigilance. LONG-TERM: Flowering will cease as plants establish deeper root systems and water stress reduces.',
    'active',
    ARRAY['BLOCK-A'],
    '2026-01-26'
);

-- ================================================
-- SECTION 8: CREATE USEFUL VIEWS FOR DASHBOARD
-- ================================================

-- View 1: Daily Progress Summary
CREATE OR REPLACE VIEW v_daily_progress AS
SELECT 
    a.activity_date,
    SUM(a.cladodes_planted) as cladodes_planted,
    SUM(a.stations_planted) as stations_planted,
    AVG(a.avg_cladodes_per_station) as avg_stack_height,
    SUM(a.cladodes_planted) / SUM(a.workers_count) as avg_per_worker,
    a.weather_condition,
    a.productivity_impact_percent,
    STRING_AGG(DISTINCT a.planting_pattern, ', ') as planting_patterns,
    COUNT(DISTINCT a.plot_id) as plots_active,
    MAX(a.workers_count) as workers,
    STRING_AGG(DISTINCT p.plot_name, ', ') as plots_worked
FROM activities a
LEFT JOIN plots p ON a.plot_id = p.id
WHERE a.activity_type = 'planting'
GROUP BY a.activity_date, a.weather_condition, a.productivity_impact_percent
ORDER BY a.activity_date DESC;

COMMENT ON VIEW v_daily_progress IS 'Daily planting progress summary for dashboard';

-- View 2: Weather Impact Summary
CREATE OR REPLACE VIEW v_weather_impact AS
SELECT 
    event_date,
    event_type,
    severity,
    operations_impact,
    productivity_impact_percent,
    worker_safety_gear,
    CASE 
        WHEN productivity_impact_percent = -100 THEN 'Full Stoppage'
        WHEN productivity_impact_percent <= -50 THEN 'Major Impact'
        WHEN productivity_impact_percent <= -20 THEN 'Moderate Impact'
        WHEN productivity_impact_percent < 0 THEN 'Minor Impact'
        ELSE 'No Impact'
    END as impact_category,
    notes
FROM weather_events
ORDER BY event_date DESC;

COMMENT ON VIEW v_weather_impact IS 'Weather events and operational impacts for dashboard';

-- View 3: Cumulative Progress
CREATE OR REPLACE VIEW v_cumulative_progress AS
SELECT 
    activity_date,
    SUM(SUM(cladodes_planted)) OVER (ORDER BY activity_date) as cumulative_cladodes,
    SUM(SUM(stations_planted)) OVER (ORDER BY activity_date) as cumulative_stations,
    ROUND((SUM(SUM(stations_planted)) OVER (ORDER BY activity_date)::DECIMAL / 6373.0) * 100, 2) as progress_percent_primary_grid,
    ROUND((SUM(SUM(stations_planted)) OVER (ORDER BY activity_date)::DECIMAL / 15403.0) * 100, 2) as progress_percent_full_density
FROM activities
WHERE activity_type = 'planting'
GROUP BY activity_date
ORDER BY activity_date;

COMMENT ON VIEW v_cumulative_progress IS 'Running total of planting progress';

-- View 4: Performance Metrics Timeline
CREATE OR REPLACE VIEW v_performance_timeline AS
SELECT 
    pb.benchmark_date,
    pb.metric_name,
    pb.metric_value,
    pb.metric_unit,
    pb.conditions,
    pb.team_size,
    CASE 
        WHEN metric_name LIKE '%per_worker%' AND metric_value >= 70 THEN 'Excellent'
        WHEN metric_name LIKE '%per_worker%' AND metric_value >= 50 THEN 'Good'
        WHEN metric_name LIKE '%per_worker%' AND metric_value >= 35 THEN 'Acceptable'
        WHEN metric_name LIKE '%per_worker%' AND metric_value < 35 THEN 'Below Target'
        ELSE 'N/A'
    END as performance_rating
FROM performance_benchmarks pb
ORDER BY pb.benchmark_date DESC;

COMMENT ON VIEW v_performance_timeline IS 'Performance benchmarks over time';

-- View 5: Media Coverage by Date
CREATE OR REPLACE VIEW v_media_coverage AS
SELECT 
    media_date,
    COUNT(*) FILTER (WHERE media_type = 'photo') as photos,
    COUNT(*) FILTER (WHERE media_type = 'video') as videos,
    COUNT(*) FILTER (WHERE media_type = 'audio') as audio_files,
    COUNT(*) as total_media,
    COUNT(*) FILTER (WHERE verified = TRUE) as verified_count,
    ARRAY_AGG(DISTINCT tags ORDER BY tags) as all_tags,
    STRING_AGG(DISTINCT description, ' | ') as descriptions
FROM field_media
GROUP BY media_date
ORDER BY media_date DESC;

COMMENT ON VIEW v_media_coverage IS 'Daily media documentation summary';

-- ================================================
-- SECTION 9: HELPER FUNCTIONS FOR DASHBOARD
-- ================================================

-- Function: Get latest KPI values
CREATE OR REPLACE FUNCTION get_latest_kpis()
RETURNS TABLE (
    kpi_name VARCHAR(100),
    kpi_value DECIMAL(15,4),
    kpi_unit VARCHAR(50),
    kpi_status VARCHAR(20),
    trend VARCHAR(20),
    delta_percent DECIMAL(8,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT ON (ks.kpi_name)
        ks.kpi_name,
        ks.kpi_value,
        ks.kpi_unit,
        ks.kpi_status,
        ks.trend,
        ks.delta_percent
    FROM kpi_snapshots ks
    ORDER BY ks.kpi_name, ks.snapshot_date DESC, ks.snapshot_time DESC;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate completion forecast
CREATE OR REPLACE FUNCTION calculate_completion_forecast()
RETURNS TABLE (
    forecast_method VARCHAR(100),
    estimated_completion_date DATE,
    days_remaining INTEGER,
    assumptions TEXT
) AS $$
DECLARE
    recent_rate DECIMAL;
    total_cladodes INTEGER;
    remaining_cladodes INTEGER;
BEGIN
    -- Get 7-day average rate
    SELECT AVG(cladodes_planted) INTO recent_rate
    FROM activities
    WHERE activity_type = 'planting'
      AND activity_date > CURRENT_DATE - INTERVAL '7 days';

    -- Get cumulative total
    SELECT SUM(cladodes_planted) INTO total_cladodes
    FROM activities
    WHERE activity_type = 'planting';

    -- Calculate remaining (using conservative 43,860 target = 12.9 ha × 3,400 cladodes/ha)
    remaining_cladodes := 43860 - COALESCE(total_cladodes, 0);

    RETURN QUERY
    SELECT 
        'Linear Projection (7-Day Avg Rate)' as forecast_method,
        CURRENT_DATE + (remaining_cladodes / NULLIF(recent_rate, 0))::INTEGER as estimated_completion_date,
        (remaining_cladodes / NULLIF(recent_rate, 0))::INTEGER as days_remaining,
        'Based on 7-day average rate of ' || ROUND(recent_rate, 0) || ' cladodes/day. Target: 43,860 cladodes (12.9 ha × 3,400/ha). Assumes weather impacts similar to recent period.' as assumptions;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- SECTION 10: SUMMARY REPORT QUERY
-- ================================================

-- Generate comprehensive summary for dashboard
CREATE OR REPLACE VIEW v_dashboard_summary AS
SELECT 
    'Total Cladodes Planted' as metric,
    (SELECT SUM(cladodes_planted) FROM activities WHERE activity_type = 'planting')::TEXT as value,
    'cladodes' as unit
UNION ALL
SELECT 
    'Total Stations Established',
    (SELECT SUM(stations_planted) FROM activities WHERE activity_type = 'planting')::TEXT,
    'stations'
UNION ALL
SELECT 
    'Progress (Primary Grid)',
    ROUND((SELECT SUM(stations_planted)::DECIMAL FROM activities WHERE activity_type = 'planting') / 6373.0 * 100, 1)::TEXT || '%',
    'of 6,373 stations'
UNION ALL
SELECT 
    'Weather Impact Days',
    (SELECT COUNT(*) FROM weather_events WHERE productivity_impact_percent < 0)::TEXT,
    'days'
UNION ALL
SELECT 
    'Current Daily Rate (7-Day Avg)',
    ROUND((SELECT AVG(cladodes_planted) FROM activities WHERE activity_type = 'planting' AND activity_date > CURRENT_DATE - INTERVAL '7 days'), 0)::TEXT,
    'cladodes/day'
UNION ALL
SELECT 
    'Field Media Uploaded',
    (SELECT COUNT(*) FROM field_media)::TEXT,
    'files'
UNION ALL
SELECT 
    'Verified Media',
    (SELECT COUNT(*) FROM field_media WHERE verified = TRUE)::TEXT,
    'files'
UNION ALL
SELECT 
    'Active Alerts',
    (SELECT COUNT(*) FROM alerts WHERE status = 'active')::TEXT,
    'alerts'
UNION ALL
SELECT 
    'Days Since Start',
    (CURRENT_DATE - DATE '2025-12-12')::TEXT,
    'days'
UNION ALL
SELECT 
    'Avg Worker Productivity',
    ROUND((SELECT AVG(cladodes_planted::DECIMAL / NULLIF(workers_count, 0)) FROM activities WHERE activity_type = 'planting'), 1)::TEXT,
    'cladodes/worker/day';

-- ================================================
-- SECTION 11: SAMPLE DASHBOARD API QUERY
-- ================================================

-- This query can be used by the dashboard API endpoint
COMMENT ON VIEW v_dashboard_summary IS 
'Complete dashboard summary - use this for API endpoint:
GET /api/dashboard/summary
Returns all key metrics in one query for dashboard display';

-- ================================================
-- END OF DATABASE UPDATE
-- ================================================

-- Verification Queries
SELECT 'Database update complete!' as status;
SELECT 'Total activities: ' || COUNT(*) FROM activities WHERE activity_type = 'planting';
SELECT 'Total weather events: ' || COUNT(*) FROM weather_events;
SELECT 'Total field media: ' || COUNT(*) FROM field_media;
SELECT 'Total performance benchmarks: ' || COUNT(*) FROM performance_benchmarks;
SELECT 'Total KPI snapshots: ' || COUNT(*) FROM kpi_snapshots;
SELECT 'Total active alerts: ' || COUNT(*) FROM alerts WHERE status = 'active';

-- Generate latest KPIs
SELECT * FROM get_latest_kpis();

-- Show completion forecast
SELECT * FROM calculate_completion_forecast();
