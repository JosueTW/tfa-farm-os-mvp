'use client';

import { useEffect, useState } from 'react';

interface Metrics {
  totalCladodes: number;
  totalStations: number;
  avgStackHeight: number;
  avgDailyRate: number;
  areaPlanted: number;
  plantingDays: number;
}

// Targets
const TARGETS = {
  areaPlanted: 2.0,
  dailyRate: 1200,
  density: 12000,
  weeklyTarget: 8400,
};

// Default metrics from database
const DEFAULT_METRICS: Metrics = {
  totalCladodes: 2419,
  totalStations: 591,
  avgStackHeight: 4.1,
  avgDailyRate: 538,
  areaPlanted: 0.98,
  plantingDays: 5,
};

export default function ReportsPage() {
  const [metrics, setMetrics] = useState<Metrics>(DEFAULT_METRICS);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setIsUpdating(true);
      try {
        const response = await fetch('/api/dashboard/overview');
        const result = await response.json();

        if (!isMounted) return;

        if (result.success && result.data?.metrics) {
          const m = result.data.metrics;
          setMetrics({
            totalCladodes: m.totalCladodes || 0,
            totalStations: m.totalStations || 0,
            avgStackHeight: m.avgStackHeight || 0,
            avgDailyRate: m.avgDailyRate || 0,
            areaPlanted: m.areaPlanted || 0,
            plantingDays: m.plantingDays || 0,
          });
        }
      } catch (err) {
        console.error('Failed to fetch reports data:', err);
      } finally {
        if (isMounted) setIsUpdating(false);
      }
    }

    fetchData();
    return () => { isMounted = false; };
  }, []);

  const areaPercent = Math.round((metrics.areaPlanted / (TARGETS.areaPlanted * 0.5)) * 100) - 100;
  const densityActual = metrics.areaPlanted > 0 ? Math.round(metrics.totalCladodes / metrics.areaPlanted) : 0;
  const productivityPerWorker = metrics.plantingDays > 0 ? Math.round(metrics.totalCladodes / (metrics.plantingDays * 8)) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tfa-text-primary md:text-3xl">
            Reports & Analytics
          </h1>
          <p className="text-sm text-tfa-text-muted mt-1">
            Comprehensive operational insights and metrics
            {isUpdating && ' • Updating...'}
          </p>
        </div>
        <div className="text-sm text-tfa-text-muted">
          Last updated: {new Date().toLocaleString('en-ZA')}
        </div>
      </div>

      {/* Current Week Summary */}
      <div className="tfa-card p-6">
        <h2 className="text-lg font-semibold text-tfa-text-primary mb-4">Current Week Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-tfa-bg-secondary rounded-lg">
            <div className="text-sm text-tfa-text-muted">Area Planted</div>
            <div className="text-3xl font-bold text-tfa-primary mt-1">{metrics.areaPlanted.toFixed(2)} ha</div>
            <div className={`text-sm mt-1 ${areaPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {areaPercent >= 0 ? '+' : ''}{areaPercent}% of interim target
            </div>
          </div>

          <div className="p-4 bg-tfa-bg-secondary rounded-lg">
            <div className="text-sm text-tfa-text-muted">Cladodes Planted</div>
            <div className="text-3xl font-bold text-tfa-primary mt-1">{metrics.totalCladodes.toLocaleString()}</div>
            <div className="text-sm mt-1 text-tfa-text-muted">Total all-time</div>
          </div>

          <div className="p-4 bg-tfa-bg-secondary rounded-lg">
            <div className="text-sm text-tfa-text-muted">Daily Rate</div>
            <div className="text-3xl font-bold text-tfa-secondary mt-1">{metrics.avgDailyRate.toLocaleString()}/day</div>
            <div className={`text-sm mt-1 ${metrics.avgDailyRate >= TARGETS.dailyRate ? 'text-green-600' : 'text-red-600'}`}>
              {Math.round((metrics.avgDailyRate / TARGETS.dailyRate) * 100)}% of target
            </div>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="tfa-card p-4 text-center">
          <div className="text-3xl font-bold text-tfa-primary">{metrics.totalCladodes.toLocaleString()}</div>
          <div className="text-sm text-tfa-text-muted mt-1">Total Cladodes</div>
        </div>
        <div className="tfa-card p-4 text-center">
          <div className="text-3xl font-bold text-tfa-primary">{metrics.totalStations.toLocaleString()}</div>
          <div className="text-sm text-tfa-text-muted mt-1">Total Stations</div>
        </div>
        <div className="tfa-card p-4 text-center">
          <div className="text-3xl font-bold text-tfa-secondary">{metrics.avgStackHeight.toFixed(1)}</div>
          <div className="text-sm text-tfa-text-muted mt-1">Avg Stack Height</div>
        </div>
        <div className="tfa-card p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{productivityPerWorker}</div>
          <div className="text-sm text-tfa-text-muted mt-1">Plants/Worker/Day</div>
        </div>
      </div>

      {/* Operational Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weather Impact */}
        <div className="tfa-card p-6">
          <h3 className="text-lg font-semibold text-tfa-text-primary mb-4">Weather Impact</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-tfa-text-secondary">Clear Days</span>
              <span className="font-medium text-green-600">{metrics.plantingDays - 1} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-tfa-text-secondary">Weather Impact Days</span>
              <span className="font-medium text-yellow-600">1 day</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-tfa-text-secondary">Operational Rate</span>
              <span className="font-medium text-tfa-primary">
                {Math.round(((metrics.plantingDays - 1) / metrics.plantingDays) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Density Analysis */}
        <div className="tfa-card p-6">
          <h3 className="text-lg font-semibold text-tfa-text-primary mb-4">Density Analysis</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-tfa-text-secondary">Target Density</span>
              <span className="font-medium">{TARGETS.density.toLocaleString()}/ha</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-tfa-text-secondary">Current Density</span>
              <span className="font-medium text-tfa-primary">{densityActual.toLocaleString()}/ha</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-tfa-text-secondary">Achievement</span>
              <span className={`font-medium ${densityActual >= TARGETS.density ? 'text-green-600' : 'text-yellow-600'}`}>
                {Math.round((densityActual / TARGETS.density) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress to Target */}
      <div className="tfa-card p-6">
        <h3 className="text-lg font-semibold text-tfa-text-primary mb-4">Progress to Target</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-tfa-text-secondary">Area Planted</span>
              <span className="text-tfa-text-primary">{metrics.areaPlanted.toFixed(2)} / {TARGETS.areaPlanted} ha</span>
            </div>
            <div className="w-full bg-tfa-border-light dark:bg-tfa-bg-tertiary rounded-full h-3">
              <div
                className="bg-tfa-accent h-3 rounded-full transition-all"
                style={{ width: `${Math.min((metrics.areaPlanted / TARGETS.areaPlanted) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-tfa-text-secondary">Total Plants Target</span>
              <span className="text-tfa-text-primary">{metrics.totalCladodes.toLocaleString()} / {(TARGETS.areaPlanted * TARGETS.density).toLocaleString()}</span>
            </div>
            <div className="w-full bg-tfa-border-light dark:bg-tfa-bg-tertiary rounded-full h-3">
              <div
                className="bg-tfa-primary h-3 rounded-full transition-all"
                style={{ width: `${Math.min((metrics.totalCladodes / (TARGETS.areaPlanted * TARGETS.density)) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
