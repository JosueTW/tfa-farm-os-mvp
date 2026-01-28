/**
 * Input validation utilities
 */

import { z } from 'zod';

/**
 * Validate a plot code (e.g., "2A", "3B", "10C")
 */
export function isValidPlotCode(code: string): boolean {
  return /^[0-9]+[A-Za-z]?$/.test(code);
}

/**
 * Validate a phone number (E.164 format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace('whatsapp:', '');
  return /^\+[1-9]\d{6,14}$/.test(cleaned);
}

/**
 * Validate an email address
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate a date string (ISO format)
 */
export function isValidDateString(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date));
}

/**
 * Validate a UUID
 */
export function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id
  );
}

/**
 * Validate GPS coordinates
 */
export function isValidCoordinates(
  lat: number,
  lng: number
): { valid: boolean; error?: string } {
  if (lat < -90 || lat > 90) {
    return { valid: false, error: 'Latitude must be between -90 and 90' };
  }
  if (lng < -180 || lng > 180) {
    return { valid: false, error: 'Longitude must be between -180 and 180' };
  }
  return { valid: true };
}

/**
 * Validate area in hectares (must be positive and reasonable)
 */
export function isValidArea(areaHa: number): boolean {
  return areaHa > 0 && areaHa <= 1000; // Max 1000 ha
}

/**
 * Validate plant density
 */
export function isValidDensity(density: number): boolean {
  return density >= 1000 && density <= 50000; // 1K-50K plants per ha
}

/**
 * Validate worker count
 */
export function isValidWorkerCount(count: number): boolean {
  return Number.isInteger(count) && count > 0 && count <= 200;
}

/**
 * Validate cladode count
 */
export function isValidCladodeCount(count: number): boolean {
  return Number.isInteger(count) && count > 0 && count <= 100000;
}

// Zod schemas for form validation

export const plotSchema = z.object({
  plot_code: z
    .string()
    .min(1, 'Plot code is required')
    .max(10, 'Plot code too long')
    .refine(isValidPlotCode, 'Invalid plot code format'),
  plot_name: z.string().max(100).optional(),
  area_ha: z.number().positive('Area must be positive').max(1000),
  planned_density: z
    .number()
    .int()
    .min(1000)
    .max(50000)
    .default(12000),
  status: z
    .enum(['pending', 'clearing', 'planting', 'completed'])
    .default('pending'),
  target_completion_date: z.string().optional(),
});

export const activitySchema = z.object({
  plot_id: z.string().uuid('Invalid plot ID'),
  activity_type: z.enum([
    'site_clearing',
    'planting',
    'inspection',
    'weeding',
    'watering',
    'fertilizing',
    'harvesting',
    'other',
  ]),
  activity_date: z.string().refine(isValidDateString, 'Invalid date'),
  cladodes_planted: z
    .number()
    .int()
    .positive()
    .max(100000)
    .optional(),
  workers_count: z.number().int().positive().max(200).optional(),
  hours_worked: z.number().positive().max(24).optional(),
  notes: z.string().max(1000).optional(),
});

export const observationSchema = z.object({
  plot_id: z.string().uuid('Invalid plot ID'),
  observation_date: z.string().refine(isValidDateString, 'Invalid date'),
  observation_type: z.enum([
    'quality_issue',
    'pest',
    'disease',
    'weed',
    'spacing_error',
    'other',
  ]),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string().min(10).max(500),
  action_required: z.string().max(500).optional(),
});

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Sanitize numeric input
 */
export function sanitizeNumber(input: unknown): number | null {
  if (typeof input === 'number' && !isNaN(input)) {
    return input;
  }
  if (typeof input === 'string') {
    const parsed = parseFloat(input.replace(/,/g, ''));
    return isNaN(parsed) ? null : parsed;
  }
  return null;
}
