/**
 * Data formatting utilities
 */

import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format a date string for display
 */
export function formatDate(
  date: string | Date,
  formatStr = 'MMM d, yyyy'
): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr);
}

/**
 * Format a date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Format time only
 */
export function formatTime(date: string | Date, formatStr = 'HH:mm'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr);
}

/**
 * Format a number with thousands separators
 */
export function formatNumber(num: number, locale = 'en-ZA'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format currency (South African Rand)
 */
export function formatCurrency(
  amount: number,
  options?: { decimals?: number; locale?: string }
): string {
  const { decimals = 0, locale = 'en-ZA' } = options || {};

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Format a percentage
 */
export function formatPercentage(
  value: number,
  options?: { decimals?: number; includeSign?: boolean }
): string {
  const { decimals = 0, includeSign = false } = options || {};

  let formatted = `${value.toFixed(decimals)}%`;

  if (includeSign && value > 0) {
    formatted = `+${formatted}`;
  }

  return formatted;
}

/**
 * Format an area in hectares
 */
export function formatArea(hectares: number, decimals = 2): string {
  return `${hectares.toFixed(decimals)} ha`;
}

/**
 * Format a phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  // Remove whatsapp: prefix if present
  let cleaned = phone.replace('whatsapp:', '').replace(/\D/g, '');

  // Format South African numbers
  if (cleaned.startsWith('27')) {
    cleaned = cleaned.slice(2);
    return `0${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  }

  // Return as-is for other formats
  return phone.replace('whatsapp:', '');
}

/**
 * Format activity type for display
 */
export function formatActivityType(type: string): string {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format plot status for display
 */
export function formatPlotStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    clearing: 'Clearing',
    in_progress: 'In Progress',
    completed: 'Completed',
  };

  return statusMap[status] || status;
}

/**
 * Format severity for display
 */
export function formatSeverity(severity: string): string {
  const severityMap: Record<string, { label: string; emoji: string }> = {
    low: { label: 'Low', emoji: '🔵' },
    medium: { label: 'Medium', emoji: '🟡' },
    high: { label: 'High', emoji: '🟠' },
    critical: { label: 'Critical', emoji: '🔴' },
  };

  const info = severityMap[severity];
  return info ? `${info.emoji} ${info.label}` : severity;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Format a duration in seconds to human-readable string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes > 0
    ? `${hours}h ${remainingMinutes}m`
    : `${hours}h`;
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(
  lat: number,
  lng: number,
  precision = 4
): string {
  return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
}
