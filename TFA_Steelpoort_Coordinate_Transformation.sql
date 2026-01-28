-- ================================================
-- TFA STEELPOORT FARM OS - COORDINATE TRANSFORMATION & DATABASE POPULATION
-- Generated: 2026-01-27
-- Purpose: Transform Lo29 survey coordinates to WGS84 and populate plots table
-- ================================================

-- ================================================
-- SECTION 1: SETUP & PREREQUISITES
-- ================================================

-- Ensure PostGIS is installed
CREATE EXTENSION IF NOT EXISTS postgis;

-- Check PostGIS version
SELECT PostGIS_Full_Version();

-- Verify spatial_ref_sys has South African datum definitions
SELECT COUNT(*) as sa_datums_available
FROM spatial_ref_sys
WHERE srid IN (22229, 22287, 2046);
-- EPSG:22229 = Cape / Lo29 
-- EPSG:22287 = Hartebees hope94 / Lo29
-- EPSG:2046 = Hartebeesthoek94 / Lo29 (modern)

-- ================================================
-- SECTION 2: CREATE HELPER FUNCTIONS
-- ================================================

-- Function to transform single point from Lo29 to WGS84
CREATE OR REPLACE FUNCTION transform_lo29_to_wgs84_point(
    easting NUMERIC,
    northing NUMERIC,
    lo29_srid INTEGER DEFAULT 22229  -- Adjust if needed
)
RETURNS GEOMETRY
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    lo29_geom GEOMETRY;
    wgs84_geom GEOMETRY;
BEGIN
    -- Create point in Lo29
    lo29_geom := ST_SetSRID(ST_MakePoint(easting, northing), lo29_srid);
    
    -- Transform to WGS84 (EPSG:4326)
    wgs84_geom := ST_Transform(lo29_geom, 4326);
    
    RETURN wgs84_geom;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Coordinate transformation failed for E:%, N:% - %', 
                      easting, northing, SQLERRM;
        RETURN NULL;
END;
$$;

-- Function to transform polygon from Lo29 to WGS84
CREATE OR REPLACE FUNCTION transform_lo29_to_wgs84_polygon(
    corner_coords NUMERIC[][],  -- Array of [easting, northing] pairs
    lo29_srid INTEGER DEFAULT 22229
)
RETURNS GEOMETRY
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    lo29_geom GEOMETRY;
    wgs84_geom GEOMETRY;
    point_text TEXT;
    i INTEGER;
BEGIN
    -- Build WKT polygon text from coordinates
    point_text := 'POLYGON((';
    
    FOR i IN 1..array_length(corner_coords, 1) LOOP
        IF i > 1 THEN
            point_text := point_text || ', ';
        END IF;
        point_text := point_text || corner_coords[i][1]::TEXT || ' ' || corner_coords[i][2]::TEXT;
    END LOOP;
    
    point_text := point_text || '))';
    
    -- Create geometry from WKT
    lo29_geom := ST_SetSRID(ST_GeomFromText(point_text), lo29_srid);
    
    -- Transform to WGS84
    wgs84_geom := ST_Transform(lo29_geom, 4326);
    
    RETURN wgs84_geom;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Polygon transformation failed - %', SQLERRM;
        RETURN NULL;
END;
$$;

-- ================================================
-- SECTION 3: IMPORT GRID COORDINATES (OPTIONAL)
-- ================================================
-- If you want to store all 1,116 grid points for reference

CREATE TABLE IF NOT EXISTS grid_coordinates (
    grid_id SERIAL PRIMARY KEY,
    point_code VARCHAR(10) UNIQUE NOT NULL,
    lo29_easting NUMERIC(12, 3),
    lo29_northing NUMERIC(12, 3),
    wgs84_geom GEOMETRY(Point, 4326),
    block_id VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create spatial index
CREATE INDEX IF NOT EXISTS idx_grid_coords_geom ON grid_coordinates USING GIST (wgs84_geom);

-- Example: Load from CSV (adjust path to your actual file location)
-- COPY grid_coordinates(point_code, lo29_easting, lo29_northing)
-- FROM '/path/to/STEELPOORT_SET_OUT_GRIDS.csv'
-- DELIMITER ','
-- CSV HEADER;

-- Transform all imported coordinates
UPDATE grid_coordinates
SET wgs84_geom = transform_lo29_to_wgs84_point(lo29_easting, lo29_northing),
    block_id = CASE 
        WHEN point_code LIKE 'A%' THEN 'BLOCK-A'
        WHEN point_code LIKE 'B%' THEN 'BLOCK-B'
        ELSE 'UNKNOWN'
    END
WHERE wgs84_geom IS NULL;

-- ================================================
-- SECTION 4: UPDATE PLOTS TABLE STRUCTURE
-- ================================================
-- Add columns if not already present

ALTER TABLE plots ADD COLUMN IF NOT EXISTS lo29_boundary_coords TEXT;
ALTER TABLE plots ADD COLUMN IF NOT EXISTS datum_source VARCHAR(100);
ALTER TABLE plots ADD COLUMN IF NOT EXISTS coordinate_confidence VARCHAR(20);
ALTER TABLE plots ADD COLUMN IF NOT EXISTS grid_station_count INTEGER;
ALTER TABLE plots ADD COLUMN IF NOT EXISTS grid_spacing_m NUMERIC(5, 2);
ALTER TABLE plots ADD COLUMN IF NOT EXISTS gross_area_ha NUMERIC(10, 4);

-- ================================================
-- SECTION 5: INSERT/UPDATE PLOTS WITH CORRECTED DATA
-- ================================================

-- BLOCK A: North Field
INSERT INTO plots (
    plot_code,
    plot_name,
    area_ha,
    planned_density,
    status,
    start_date,
    target_completion_date,
    budget_per_ha,
    geometry,
    lo29_boundary_coords,
    datum_source,
    coordinate_confidence,
    grid_station_count,
    grid_spacing_m,
    gross_area_ha,
    last_verified_date,
    notes
)
VALUES (
    'BLOCK-A',
    'North Field - Block A',
    6.10,  -- NET planting area from CAD
    494,   -- CORRECTED: 4.5m grid = 494 stations/ha
    'planting',
    '2026-01-20',
    '2026-02-28',
    179400,
    -- Transformed boundary (Lo29 corners → WGS84 polygon)
    transform_lo29_to_wgs84_polygon(ARRAY[
        ARRAY[81791.888, 2735641.903],  -- NW corner
        ARRAY[81346.388, 2735641.903],  -- NE corner
        ARRAY[81346.388, 2735281.903],  -- SE corner
        ARRAY[81791.888, 2735281.903],  -- SW corner
        ARRAY[81791.888, 2735641.903]   -- Close polygon
    ]),
    'Lo29: (81791.888, 2735641.903), (81346.388, 2735641.903), (81346.388, 2735281.903), (81791.888, 2735281.903)',
    'Lo29 (EPSG:22229) → WGS84 (EPSG:4326) via PostGIS transformation',
    'high',
    620,   -- Grid points in Block A
    4.50,  -- Grid spacing
    16.04, -- Gross envelope area
    CURRENT_DATE,
    'Survey-grade coordinate data from STEELPOORT_SET_OUT_GRIDS.csv. Grid dimensions: 445.5m (E-W) × 360.0m (N-S). Net planting area 6.1 ha per CAD drawing (38% of gross area). Coordinate transformation applied from South African Lo29 datum to WGS84 for mapping compatibility.'
)
ON CONFLICT (plot_code) 
DO UPDATE SET
    area_ha = EXCLUDED.area_ha,
    planned_density = EXCLUDED.planned_density,
    geometry = EXCLUDED.geometry,
    lo29_boundary_coords = EXCLUDED.lo29_boundary_coords,
    datum_source = EXCLUDED.datum_source,
    coordinate_confidence = EXCLUDED.coordinate_confidence,
    grid_station_count = EXCLUDED.grid_station_count,
    grid_spacing_m = EXCLUDED.grid_spacing_m,
    gross_area_ha = EXCLUDED.gross_area_ha,
    last_verified_date = CURRENT_DATE,
    notes = EXCLUDED.notes;

-- BLOCK B: South Field (3 sub-blocks)
INSERT INTO plots (
    plot_code,
    plot_name,
    area_ha,
    planned_density,
    status,
    start_date,
    target_completion_date,
    budget_per_ha,
    geometry,
    lo29_boundary_coords,
    datum_source,
    coordinate_confidence,
    grid_station_count,
    grid_spacing_m,
    gross_area_ha,
    last_verified_date,
    notes
)
VALUES (
    'BLOCK-B',
    'South Field - Block B',
    6.80,  -- NET planting area from CAD
    494,   -- CORRECTED: matches grid spacing
    'pending',
    '2026-02-15',
    '2026-03-31',
    179400,
    transform_lo29_to_wgs84_polygon(ARRAY[
        ARRAY[80824.388, 2735314.384],  -- NW corner
        ARRAY[80329.388, 2735314.384],  -- NE corner
        ARRAY[80329.388, 2735090.384],  -- SE corner
        ARRAY[80824.388, 2735090.384],  -- SW corner
        ARRAY[80824.388, 2735314.384]   -- Close polygon
    ]),
    'Lo29: (80824.388, 2735314.384), (80329.388, 2735314.384), (80329.388, 2735090.384), (80824.388, 2735090.384)',
    'Lo29 (EPSG:22229) → WGS84 (EPSG:4326) via PostGIS transformation',
    'high',
    496,   -- Grid points in Block B
    4.50,
    11.09, -- Gross envelope area
    CURRENT_DATE,
    'Survey-grade data. Grid dimensions: 495.0m (E-W) × 224.0m (N-S). Three non-contiguous sub-blocks within single cadastral unit. Net planting 6.8 ha per CAD (61% of gross). Coordinate transformation applied.'
)
ON CONFLICT (plot_code)
DO UPDATE SET
    area_ha = EXCLUDED.area_ha,
    planned_density = EXCLUDED.planned_density,
    geometry = EXCLUDED.geometry,
    lo29_boundary_coords = EXCLUDED.lo29_boundary_coords,
    datum_source = EXCLUDED.datum_source,
    coordinate_confidence = EXCLUDED.coordinate_confidence,
    grid_station_count = EXCLUDED.grid_station_count,
    grid_spacing_m = EXCLUDED.grid_spacing_m,
    gross_area_ha = EXCLUDED.gross_area_ha,
    last_verified_date = CURRENT_DATE,
    notes = EXCLUDED.notes;

-- ================================================
-- SECTION 6: VERIFY TRANSFORMATIONS
-- ================================================

-- Check plot boundaries were created successfully
SELECT 
    plot_code,
    plot_name,
    area_ha,
    planned_density,
    ST_AsText(ST_Centroid(geometry)) as wgs84_centroid,
    lo29_boundary_coords as original_lo29_coords,
    coordinate_confidence,
    grid_station_count
FROM plots
WHERE plot_code IN ('BLOCK-A', 'BLOCK-B')
ORDER BY plot_code;

-- Calculate area from transformed geometry (should match declared area_ha)
SELECT 
    plot_code,
    area_ha as declared_area_ha,
    ROUND(ST_Area(geometry::geography) / 10000, 2) as calculated_area_ha,
    ROUND(ABS(area_ha - (ST_Area(geometry::geography) / 10000)) / area_ha * 100, 1) as deviation_percent
FROM plots
WHERE plot_code IN ('BLOCK-A', 'BLOCK-B');

-- Generate GeoJSON for external verification (Google Earth, QGIS)
SELECT row_to_json(fc)
FROM (
    SELECT 'FeatureCollection' as type,
           array_to_json(array_agg(f)) as features
    FROM (
        SELECT 
            'Feature' as type,
            row_to_json(props) as properties,
            ST_AsGeoJSON(geometry)::json as geom
        FROM (
            SELECT
                plot_code,
                plot_name,
                area_ha,
                planned_density,
                status,
                grid_station_count,
                grid_spacing_m,
                gross_area_ha,
                coordinate_confidence,
                datum_source
            FROM plots
            WHERE plot_code IN ('BLOCK-A', 'BLOCK-B')
        ) props
    ) f
) fc;

-- ================================================
-- SECTION 7: UPDATE ACTIVITIES WITH PLOT REFERENCES
-- ================================================

-- Link existing activities to corrected plots
UPDATE activities a
SET plot_id = p.id
FROM plots p
WHERE p.plot_code = 'BLOCK-A'
  AND a.plot_id IS NULL
  AND a.activity_date BETWEEN '2026-01-20' AND '2026-01-31';

-- ================================================
-- SECTION 8: SUMMARY REPORT
-- ================================================

-- Generate transformation summary
SELECT 
    'TFA STEELPOORT COORDINATE TRANSFORMATION SUMMARY' as report_title,
    CURRENT_TIMESTAMP as generated_at;

SELECT 
    '=== PLOT SUMMARY ===' as section;

SELECT 
    plot_code,
    plot_name,
    area_ha || ' ha' as net_area,
    gross_area_ha || ' ha' as gross_area,
    grid_station_count || ' stations' as grid_points,
    planned_density || ' plants/ha' as density,
    (area_ha * planned_density)::INTEGER || ' plants' as target_quantity,
    status,
    coordinate_confidence as confidence
FROM plots
WHERE plot_code IN ('BLOCK-A', 'BLOCK-B')
ORDER BY plot_code;

SELECT 
    '=== SITE TOTALS ===' as section;

SELECT 
    SUM(area_ha) || ' ha' as total_net_area,
    SUM(gross_area_ha) || ' ha' as total_gross_area,
    SUM(grid_station_count) || ' stations' as total_grid_points,
    SUM(area_ha * planned_density)::INTEGER || ' plants' as total_target,
    ROUND(SUM(area_ha * planned_density * 179400) / 1000000, 2) || 'M ZAR' as total_budget
FROM plots
WHERE plot_code IN ('BLOCK-A', 'BLOCK-B');

SELECT 
    '=== COORDINATE SYSTEMS ===' as section;

SELECT DISTINCT
    datum_source,
    coordinate_confidence,
    COUNT(*) || ' plots' as count
FROM plots
WHERE plot_code IN ('BLOCK-A', 'BLOCK-B')
GROUP BY datum_source, coordinate_confidence;

-- ================================================
-- SECTION 9: CLEANUP & MAINTENANCE
-- ================================================

-- Drop helper functions if no longer needed
-- DROP FUNCTION IF EXISTS transform_lo29_to_wgs84_point(NUMERIC, NUMERIC, INTEGER);
-- DROP FUNCTION IF EXISTS transform_lo29_to_wgs84_polygon(NUMERIC[][], INTEGER);

-- Create index on transformed geometries for fast spatial queries
CREATE INDEX IF NOT EXISTS idx_plots_geometry ON plots USING GIST (geometry);

-- Vacuum analyze for optimal query performance
VACUUM ANALYZE plots;

-- ================================================
-- SECTION 10: NEXT STEPS & VALIDATION
-- ================================================

/*
VALIDATION CHECKLIST:

1. [ ] Verify PostGIS transformation succeeded (check query results above)
2. [ ] Export GeoJSON and load into Google Earth/QGIS
3. [ ] Visually confirm plot locations align with satellite imagery
4. [ ] Check centroid coordinates are near Steelpoort (-24.7°S, 29.9°E)
5. [ ] Verify calculated area matches declared area (within 5%)
6. [ ] Update application map component with transformed coordinates
7. [ ] Test field worker GPS photos align with plot boundaries

KNOWN ISSUES:
- If transformation returns NULL, EPSG:22229 may not be in your spatial_ref_sys
- Solution: Install PROJ library with South African datum definitions
- Alternative: Use online coordinate converter and manual entry

MANUAL TRANSFORMATION (if PostGIS fails):
1. Use https://epsg.io/transform or similar tool
2. Input: Lo29 coordinates from CSV
3. Output: WGS84 (EPSG:4326)
4. Manually update geometry with ST_GeomFromText()

CONTACT:
For assistance with coordinate transformation:
- Check PostGIS documentation: https://postgis.net/docs/
- PROJ coordinate operations: https://proj.org/
- South African datum info: https://www.geospatial.org.za/
*/

-- ================================================
-- END OF SCRIPT
-- ================================================
