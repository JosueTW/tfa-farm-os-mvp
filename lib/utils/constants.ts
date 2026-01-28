/**
 * Application constants
 */

// Farm operation targets
export const TARGETS = {
  PLANTING_RATE_PER_DAY: 1200, // cladodes per day
  PLANT_DENSITY_PER_HA: 12000, // plants per hectare
  SURVIVAL_RATE_TARGET: 95, // percentage
  COST_PER_HA_BUDGET: 179400, // ZAR
  LABOR_PRODUCTIVITY: 400, // plants per worker per day
  ROW_SPACING_CM: 250, // centimeters between rows
  PLANT_SPACING_CM: 83, // centimeters between plants
} as const;

// Alert thresholds
export const ALERT_THRESHOLDS = {
  PLANTING_RATE_WARNING: 0.8, // 80% of target
  SURVIVAL_RATE_WARNING: 0.93, // 93%
  SURVIVAL_RATE_CRITICAL: 0.90, // 90%
  COST_OVERRUN_WARNING: 1.05, // 5% over budget
  DENSITY_VARIANCE: 0.10, // 10% variance from target
  CONSECUTIVE_DAYS_BEHIND: 2, // days behind before high alert
} as const;

// Activity types
export const ACTIVITY_TYPES = [
  { value: 'planting', label: 'Planting', icon: '🌱' },
  { value: 'site_clearing', label: 'Site Clearing', icon: '🪓' },
  { value: 'inspection', label: 'Inspection', icon: '🔍' },
  { value: 'weeding', label: 'Weeding', icon: '🌿' },
  { value: 'watering', label: 'Watering', icon: '💧' },
  { value: 'fertilizing', label: 'Fertilizing', icon: '🧪' },
  { value: 'harvesting', label: 'Harvesting', icon: '🧺' },
  { value: 'other', label: 'Other', icon: '📋' },
] as const;

// Plot statuses
export const PLOT_STATUSES = [
  { value: 'pending', label: 'Pending', color: '#9AA89A' },
  { value: 'clearing', label: 'Clearing', color: '#A37A51' },
  { value: 'in_progress', label: 'In Progress', color: '#01E3C2' },
  { value: 'completed', label: 'Completed', color: '#2B7035' },
] as const;

// Alert severities
export const ALERT_SEVERITIES = [
  { value: 'low', label: 'Low', color: '#025373', icon: '🔵' },
  { value: 'medium', label: 'Medium', color: '#A37A51', icon: '🟡' },
  { value: 'high', label: 'High', color: '#D35230', icon: '🟠' },
  { value: 'critical', label: 'Critical', color: '#D94848', icon: '🔴' },
] as const;

// Report methods
export const REPORT_METHODS = [
  { value: 'whatsapp', label: 'WhatsApp', color: '#25D366' },
  { value: 'app', label: 'Mobile App', color: '#01E3C2' },
  { value: 'manual', label: 'Manual Entry', color: '#025373' },
] as const;

// Worker roles
export const WORKER_ROLES = [
  { value: 'planter', label: 'Planter' },
  { value: 'digger', label: 'Digger' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'quality_checker', label: 'Quality Checker' },
  { value: 'driver', label: 'Driver' },
] as const;

// Date formats
export const DATE_FORMATS = {
  SHORT: 'MMM d', // Jan 26
  MEDIUM: 'MMM d, yyyy', // Jan 26, 2026
  LONG: 'EEEE, MMMM d, yyyy', // Monday, January 26, 2026
  ISO: 'yyyy-MM-dd', // 2026-01-26
  TIME: 'HH:mm', // 14:30
  DATETIME: 'MMM d, yyyy HH:mm', // Jan 26, 2026 14:30
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Cache durations (in seconds)
export const CACHE_DURATIONS = {
  WEATHER: 3600, // 1 hour
  DASHBOARD: 60, // 1 minute
  PLOTS: 300, // 5 minutes
  ACTIVITIES: 60, // 1 minute
} as const;

// Feature flags
export const FEATURES = {
  VOICE_NOTES: true,
  PHOTO_CAPTURE: true,
  OFFLINE_MODE: true,
  AI_EXTRACTION: true,
  COMPUTER_VISION: false, // Phase 2
  PREDICTIVE_ANALYTICS: false, // Phase 2
} as const;
