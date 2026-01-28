/**
 * Mapbox utilities
 */

// Default center: Steelpoort, Limpopo, South Africa
export const DEFAULT_CENTER: [number, number] = [
  parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LNG || '30.194722'),
  parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LAT || '-24.721643'),
];

export const DEFAULT_ZOOM = 15;

/**
 * Plot status colors for map visualization
 */
export const PLOT_STATUS_COLORS: Record<string, string> = {
  completed: '#2B7035', // TFA Primary Green
  in_progress: '#01E3C2', // TFA Accent Teal
  clearing: '#A37A51', // TFA Tertiary Gold
  pending: '#9AA89A', // Muted gray-green
};

/**
 * Generate GeoJSON for a plot
 */
export function plotToGeoJSON(plot: {
  id: string;
  plot_code: string;
  status: string;
  geometry?: {
    type: string;
    coordinates: number[][][];
  };
}): GeoJSON.Feature | null {
  if (!plot.geometry) return null;

  return {
    type: 'Feature',
    id: plot.id,
    properties: {
      plotCode: plot.plot_code,
      status: plot.status,
      color: PLOT_STATUS_COLORS[plot.status] || PLOT_STATUS_COLORS.pending,
    },
    geometry: plot.geometry as GeoJSON.Geometry,
  };
}

/**
 * Generate a FeatureCollection from multiple plots
 */
export function plotsToGeoJSON(
  plots: Array<{
    id: string;
    plot_code: string;
    status: string;
    geometry?: {
      type: string;
      coordinates: number[][][];
    };
  }>
): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: plots
      .map(plotToGeoJSON)
      .filter((f): f is GeoJSON.Feature => f !== null),
  };
}

/**
 * Calculate the center of a polygon
 */
export function calculatePolygonCenter(
  coordinates: number[][][]
): [number, number] {
  const ring = coordinates[0]; // Use outer ring
  let sumLng = 0;
  let sumLat = 0;

  for (const coord of ring) {
    sumLng += coord[0];
    sumLat += coord[1];
  }

  return [sumLng / ring.length, sumLat / ring.length];
}

/**
 * Calculate the bounds of a polygon
 */
export function calculatePolygonBounds(
  coordinates: number[][][]
): [[number, number], [number, number]] {
  const ring = coordinates[0];

  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (const coord of ring) {
    minLng = Math.min(minLng, coord[0]);
    maxLng = Math.max(maxLng, coord[0]);
    minLat = Math.min(minLat, coord[1]);
    maxLat = Math.max(maxLat, coord[1]);
  }

  return [
    [minLng, minLat], // Southwest
    [maxLng, maxLat], // Northeast
  ];
}

/**
 * Calculate bounds that contain all plots
 */
export function calculateAllPlotsBounds(
  plots: Array<{
    geometry?: {
      type: string;
      coordinates: number[][][];
    };
  }>
): [[number, number], [number, number]] | null {
  const plotsWithGeometry = plots.filter((p) => p.geometry);
  if (plotsWithGeometry.length === 0) return null;

  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (const plot of plotsWithGeometry) {
    const bounds = calculatePolygonBounds(plot.geometry!.coordinates);
    minLng = Math.min(minLng, bounds[0][0]);
    maxLng = Math.max(maxLng, bounds[1][0]);
    minLat = Math.min(minLat, bounds[0][1]);
    maxLat = Math.max(maxLat, bounds[1][1]);
  }

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}

/**
 * Create a marker element for activities
 */
export function createActivityMarkerElement(activityType: string): HTMLElement {
  const el = document.createElement('div');
  el.className = 'activity-marker';
  el.style.cssText = `
    width: 24px;
    height: 24px;
    background: #2B7035;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: pointer;
  `;

  // Activity type icons
  const icons: Record<string, string> = {
    planting: '🌱',
    inspection: '🔍',
    site_clearing: '🪓',
    weeding: '🌿',
    watering: '💧',
  };

  el.innerHTML = icons[activityType] || '📍';

  return el;
}

/**
 * Convert decimal degrees to DMS format
 */
export function toDMS(
  decimal: number,
  isLat: boolean
): { degrees: number; minutes: number; seconds: number; direction: string } {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.round((minutesNotTruncated - minutes) * 60 * 100) / 100;

  let direction: string;
  if (isLat) {
    direction = decimal >= 0 ? 'N' : 'S';
  } else {
    direction = decimal >= 0 ? 'E' : 'W';
  }

  return { degrees, minutes, seconds, direction };
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDMS = toDMS(lat, true);
  const lngDMS = toDMS(lng, false);

  return `${latDMS.degrees}°${latDMS.minutes}'${latDMS.seconds}"${latDMS.direction}, ${lngDMS.degrees}°${lngDMS.minutes}'${lngDMS.seconds}"${lngDMS.direction}`;
}
