'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { cn } from '@/lib/utils';
import { getClient } from '@/lib/supabase/client';
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  PLOT_STATUS_COLORS,
  plotsToGeoJSON,
  calculateAllPlotsBounds,
} from '@/lib/api/maps';

interface MapViewProps {
  className?: string;
}

interface Plot {
  id: string;
  plot_code: string;
  plot_name: string | null;
  geometry: {
    type: string;
    coordinates: number[][][];
  } | null;
  area_ha: number | null;
  status: string | null;
  planned_density: number | null;
}

export function MapView({ className }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plots, setPlots] = useState<Plot[]>([]);

  // Fetch plot data
  useEffect(() => {
    async function fetchPlots() {
      try {
        const supabase = getClient();
        const { data, error: fetchError } = await supabase
          .from('plots_with_geojson')
          .select('id, plot_code, plot_name, area_ha, planned_density, status, geometry')
          .order('plot_code', { ascending: true });

        if (fetchError) {
          setError('Failed to load plot data');
          return;
        }

        setPlots(data || []);
      } catch (err) {
        console.error('Failed to fetch plots:', err);
        setError('Failed to load plot data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlots();
  }, []);

  // Initialize map
  useEffect(() => {
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!mapboxToken) {
      setError('Mapbox token not configured');
      return;
    }

    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapboxToken;

    // Initialize map
    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    });

    // Add navigation controls
    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add attribution
    mapInstance.addControl(
      new mapboxgl.AttributionControl({
        compact: true,
      }),
      'bottom-right'
    );

    map.current = mapInstance;

    // Add center marker for Steelpoort Nursery
    new mapboxgl.Marker({
      color: '#01E3C2', // TFA Accent color
    })
      .setLngLat(DEFAULT_CENTER)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div class="p-2">
            <h3 class="font-semibold text-sm">Steelpoort Nursery</h3>
            <p class="text-xs text-gray-600">-24.721643, 30.194722</p>
          </div>`
        )
      )
      .addTo(mapInstance);

    // Wait for map to load before adding sources
    mapInstance.on('load', () => {
      // Add empty GeoJSON source for plots
      mapInstance.addSource('plots', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      // Add plot polygons layer
      mapInstance.addLayer({
        id: 'plot-fills',
        type: 'fill',
        source: 'plots',
        paint: {
          'fill-color': [
            'match',
            ['get', 'status'],
            'completed',
            PLOT_STATUS_COLORS.completed,
            'planting',
            PLOT_STATUS_COLORS.in_progress,
            'in_progress',
            PLOT_STATUS_COLORS.in_progress,
            'clearing',
            PLOT_STATUS_COLORS.clearing,
            'pending',
            PLOT_STATUS_COLORS.pending,
            PLOT_STATUS_COLORS.pending, // default
          ],
          'fill-opacity': 0.5,
        },
      });

      // Add plot borders
      mapInstance.addLayer({
        id: 'plot-borders',
        type: 'line',
        source: 'plots',
        paint: {
          'line-color': [
            'match',
            ['get', 'status'],
            'completed',
            PLOT_STATUS_COLORS.completed,
            'planting',
            PLOT_STATUS_COLORS.in_progress,
            'in_progress',
            PLOT_STATUS_COLORS.in_progress,
            'clearing',
            PLOT_STATUS_COLORS.clearing,
            'pending',
            PLOT_STATUS_COLORS.pending,
            PLOT_STATUS_COLORS.pending, // default
          ],
          'line-width': 2,
        },
      });

      // Add click handler for popups
      mapInstance.on('click', 'plot-fills', (e) => {
        if (!e.features || e.features.length === 0) return;

        const feature = e.features[0];
        const props = feature?.properties;

        if (!props) return;

        const popupContent = `
          <div class="p-3 min-w-[200px]">
            <h3 class="font-semibold text-base mb-2">${props.plotCode || 'Unknown Plot'}</h3>
            ${props.plotName ? `<p class="text-sm text-gray-600 mb-2">${props.plotName}</p>` : ''}
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Status:</span>
                <span class="font-medium capitalize">${props.status || 'Unknown'}</span>
              </div>
              ${props.areaHa ? `
                <div class="flex justify-between">
                  <span class="text-gray-600">Area:</span>
                  <span class="font-medium">${Number(props.areaHa).toFixed(2)} ha</span>
                </div>
              ` : ''}
              ${props.plannedDensity ? `
                <div class="flex justify-between">
                  <span class="text-gray-600">Target Density:</span>
                  <span class="font-medium">${props.plannedDensity.toLocaleString()}/ha</span>
                </div>
              ` : ''}
            </div>
          </div>
        `;

        new mapboxgl.Popup({ offset: 25 })
          .setLngLat(e.lngLat)
          .setHTML(popupContent)
          .addTo(mapInstance);
      });

      // Change cursor on hover
      mapInstance.on('mouseenter', 'plot-fills', () => {
        mapInstance.getCanvas().style.cursor = 'pointer';
      });

      mapInstance.on('mouseleave', 'plot-fills', () => {
        mapInstance.getCanvas().style.cursor = '';
      });
    });

    // Cleanup
    return () => {
      mapInstance.remove();
      map.current = null;
    };
  }, []);

  // Update map with plot data
  useEffect(() => {
    if (!map.current || !plots.length) return;

    const plotsWithGeometry = plots.filter((p) => p.geometry);
    if (plotsWithGeometry.length === 0) return;

    // Convert plots to GeoJSON
    const geoJSON = plotsToGeoJSON(
      plotsWithGeometry.map((plot) => ({
        id: plot.id,
        plot_code: plot.plot_code,
        status: plot.status || 'pending',
        geometry: plot.geometry!,
      }))
    );

    // Add additional properties for popup
    geoJSON.features = geoJSON.features.map((feature) => {
      const plot = plots.find((p) => p.id === feature.id);
      return {
        ...feature,
        properties: {
          ...feature.properties,
          plotName: plot?.plot_name || null,
          areaHa: plot?.area_ha || null,
          plannedDensity: plot?.planned_density || null,
        },
      };
    });

    // Update map source
    const source = map.current.getSource('plots') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(geoJSON);

      // Fit map to bounds if we have plots
      const bounds = calculateAllPlotsBounds(plotsWithGeometry);
      if (bounds && map.current) {
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 16,
        });
      }
    }
  }, [plots]);

  return (
    <div
      className={cn(
        'tfa-card overflow-hidden bg-tfa-border-light dark:bg-tfa-bg-tertiary relative',
        className
      )}
    >
      <div ref={mapContainer} className="h-full w-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
          <div className="text-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tfa-accent mx-auto mb-2"></div>
            <p className="text-sm text-tfa-text-muted">Loading map...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
          <div className="text-center p-6">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="text-sm text-tfa-text-muted">{error}</p>
          </div>
        </div>
      )}
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-tfa-bg-secondary rounded-lg shadow-lg p-3 text-xs z-10 border border-tfa-border">
        <div className="font-semibold mb-2 text-tfa-text-primary">Plot Status</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded"
              style={{ backgroundColor: PLOT_STATUS_COLORS.completed }}
            />
            <span className="text-tfa-text-secondary">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded"
              style={{ backgroundColor: PLOT_STATUS_COLORS.in_progress }}
            />
            <span className="text-tfa-text-secondary">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded"
              style={{ backgroundColor: PLOT_STATUS_COLORS.clearing }}
            />
            <span className="text-tfa-text-secondary">Clearing</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded"
              style={{ backgroundColor: PLOT_STATUS_COLORS.pending }}
            />
            <span className="text-tfa-text-secondary">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
}
