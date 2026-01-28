/**
 * Metric calculations for farm operations
 */

import { TARGETS } from './constants';

/**
 * Calculate planting progress percentage
 */
export function calculatePlantingProgress(
  planted: number,
  areaHa: number,
  targetDensity = TARGETS.PLANT_DENSITY_PER_HA
): number {
  const target = areaHa * targetDensity;
  if (target === 0) return 0;
  return Math.min(Math.round((planted / target) * 100), 100);
}

/**
 * Calculate actual plant density
 */
export function calculateDensity(planted: number, areaHa: number): number {
  if (areaHa === 0) return 0;
  return Math.round(planted / areaHa);
}

/**
 * Calculate planting rate (plants per day)
 */
export function calculatePlantingRate(
  totalPlanted: number,
  daysWorked: number
): number {
  if (daysWorked === 0) return 0;
  return Math.round(totalPlanted / daysWorked);
}

/**
 * Calculate labor productivity (plants per worker)
 */
export function calculateProductivity(
  planted: number,
  workerDays: number
): number {
  if (workerDays === 0) return 0;
  return Math.round(planted / workerDays);
}

/**
 * Calculate survival rate
 */
export function calculateSurvivalRate(
  alive: number,
  planted: number
): number {
  if (planted === 0) return 100;
  return Math.round((alive / planted) * 100);
}

/**
 * Calculate cost per hectare
 */
export function calculateCostPerHa(totalCost: number, areaHa: number): number {
  if (areaHa === 0) return 0;
  return Math.round(totalCost / areaHa);
}

/**
 * Calculate delta percentage between current and target
 */
export function calculateDelta(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.round(((current - target) / target) * 100);
}

/**
 * Determine status based on performance vs target
 */
export function determineStatus(
  current: number,
  target: number,
  warningThreshold = 0.9,
  errorThreshold = 0.7
): 'success' | 'warning' | 'error' {
  const ratio = target > 0 ? current / target : 0;

  if (ratio >= warningThreshold) return 'success';
  if (ratio >= errorThreshold) return 'warning';
  return 'error';
}

/**
 * Calculate estimated completion date
 */
export function estimateCompletionDate(
  remaining: number,
  dailyRate: number,
  startDate = new Date()
): Date | null {
  if (dailyRate <= 0 || remaining <= 0) return null;

  const daysNeeded = Math.ceil(remaining / dailyRate);
  const completionDate = new Date(startDate);
  completionDate.setDate(completionDate.getDate() + daysNeeded);

  return completionDate;
}

/**
 * Calculate days behind schedule
 */
export function calculateDaysBehind(
  currentDate: Date,
  targetDate: Date,
  progressPercent: number
): number {
  const totalDays = Math.ceil(
    (targetDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (totalDays <= 0) {
    // Already past target date
    return Math.ceil(
      (currentDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  // Expected progress based on time elapsed
  const expectedProgress = 100 - (totalDays / 30) * 100; // Assuming 30-day cycle
  const progressDiff = expectedProgress - progressPercent;

  if (progressDiff <= 0) return 0;

  // Convert progress difference to days
  return Math.ceil((progressDiff / 100) * 30);
}

/**
 * Calculate week-over-week change
 */
export function calculateWeekOverWeekChange(
  currentWeek: number,
  previousWeek: number
): { change: number; trend: 'up' | 'down' | 'neutral' } {
  if (previousWeek === 0) {
    return { change: 0, trend: 'neutral' };
  }

  const change = Math.round(((currentWeek - previousWeek) / previousWeek) * 100);

  return {
    change,
    trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
  };
}

/**
 * Calculate row count from area and spacing
 */
export function calculateRowCount(
  areaHa: number,
  rowSpacingCm = TARGETS.ROW_SPACING_CM
): number {
  // Convert ha to m² and row spacing to m
  const areaM2 = areaHa * 10000;
  const rowSpacingM = rowSpacingCm / 100;

  // Assuming square plot, calculate rows
  const sideLength = Math.sqrt(areaM2);
  return Math.floor(sideLength / rowSpacingM);
}

/**
 * Calculate plants per row from area and spacing
 */
export function calculatePlantsPerRow(
  areaHa: number,
  plantSpacingCm = TARGETS.PLANT_SPACING_CM
): number {
  const areaM2 = areaHa * 10000;
  const plantSpacingM = plantSpacingCm / 100;

  const sideLength = Math.sqrt(areaM2);
  return Math.floor(sideLength / plantSpacingM);
}

/**
 * Calculate labor cost estimate
 */
export function estimateLaborCost(
  workerHours: number,
  hourlyRate = 30 // R30/hour estimate
): number {
  return workerHours * hourlyRate;
}

/**
 * Format large numbers with K/M suffixes
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}
