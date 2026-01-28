'use client';

import { useEffect, useState } from 'react';

interface Alert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation?: string;
  category: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

interface Metrics {
  avgDailyRate: number;
  areaPlanted: number;
  totalCladodes: number;
  avgStackHeight: number;
}

// Targets for generating alerts
const TARGETS = {
  dailyRate: 1200,
  areaPlanted: 2.0,
  stackHeight: 4.0,
};

// Default metrics from database
const DEFAULT_METRICS: Metrics = {
  avgDailyRate: 538,
  areaPlanted: 0.98,
  totalCladodes: 2419,
  avgStackHeight: 4.1,
};

function generateAlerts(m: Metrics): Alert[] {
  const alerts: Alert[] = [];

  const ratePercent = (m.avgDailyRate / TARGETS.dailyRate) * 100;
  if (ratePercent < 100) {
    alerts.push({
      id: 'rate-1',
      severity: ratePercent < 50 ? 'critical' : ratePercent < 70 ? 'high' : 'medium',
      title: 'Planting Rate Below Target',
      description: `Current rate: ${m.avgDailyRate}/day (${Math.round(ratePercent)}% of ${TARGETS.dailyRate}/day target)`,
      recommendation: ratePercent < 50 ? 'Urgent: Add workers or extend hours' : 'Consider adding workers',
      category: 'performance',
      status: 'active',
    });
  }

  const areaPercent = (m.areaPlanted / TARGETS.areaPlanted) * 100;
  if (areaPercent < 50) {
    alerts.push({
      id: 'area-1',
      severity: areaPercent < 25 ? 'high' : 'medium',
      title: 'Area Planted Behind Schedule',
      description: `${m.areaPlanted.toFixed(2)} ha planted (${Math.round(areaPercent)}% of ${TARGETS.areaPlanted} ha target)`,
      recommendation: 'Focus resources on expanding planted area',
      category: 'progress',
      status: 'active',
    });
  }

  if (m.avgStackHeight >= TARGETS.stackHeight) {
    alerts.push({
      id: 'stack-1',
      severity: 'low',
      title: 'Stack Height Target Achieved',
      description: `Average ${m.avgStackHeight.toFixed(1)} cladodes per station (Target: ${TARGETS.stackHeight})`,
      recommendation: 'Continue current multi-cladode stacking practice',
      category: 'achievement',
      status: 'acknowledged',
    });
  }

  return alerts;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(generateAlerts(DEFAULT_METRICS));
  const [metrics, setMetrics] = useState<Metrics>(DEFAULT_METRICS);
  const [isUpdating, setIsUpdating] = useState(false);
  const [filter, setFilter] = useState<string>('all');

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
          const newMetrics = {
            avgDailyRate: m.avgDailyRate || 0,
            areaPlanted: m.areaPlanted || 0,
            totalCladodes: m.totalCladodes || 0,
            avgStackHeight: m.avgStackHeight || 0,
          };
          setMetrics(newMetrics);
          setAlerts(generateAlerts(newMetrics));
        }
      } catch (err) {
        console.error('Failed to fetch alerts data:', err);
      } finally {
        if (isMounted) setIsUpdating(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-400 dark:text-red-100';
      case 'high':
        return 'bg-orange-100 border-orange-500 text-orange-800 dark:bg-orange-900/30 dark:border-orange-400 dark:text-orange-100';
      case 'medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-400 dark:text-yellow-100';
      default:
        return 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:border-green-400 dark:text-green-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      default: return '✓';
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'active') return a.status === 'active';
    return a.severity === filter;
  });

  const alertCounts = {
    critical: alerts.filter(a => a.severity === 'critical').length,
    high: alerts.filter(a => a.severity === 'high').length,
    medium: alerts.filter(a => a.severity === 'medium').length,
    low: alerts.filter(a => a.severity === 'low').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-tfa-text-primary md:text-3xl">
          Alerts & Notifications
        </h1>
        <p className="text-sm text-tfa-text-muted mt-1">
          Real-time alerts based on operational metrics
          {isUpdating && ' • Updating...'}
        </p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="tfa-card p-4 border-l-4 border-red-500">
          <div className="text-2xl font-bold text-red-600">{alertCounts.critical}</div>
          <div className="text-sm text-tfa-text-muted">Critical</div>
        </div>
        <div className="tfa-card p-4 border-l-4 border-orange-500">
          <div className="text-2xl font-bold text-orange-600">{alertCounts.high}</div>
          <div className="text-sm text-tfa-text-muted">High</div>
        </div>
        <div className="tfa-card p-4 border-l-4 border-yellow-500">
          <div className="text-2xl font-bold text-yellow-600">{alertCounts.medium}</div>
          <div className="text-sm text-tfa-text-muted">Medium</div>
        </div>
        <div className="tfa-card p-4 border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">{alertCounts.low}</div>
          <div className="text-sm text-tfa-text-muted">Low / Info</div>
        </div>
      </div>

      {/* Current Metrics */}
      <div className="tfa-card p-4 bg-tfa-bg-secondary">
        <h3 className="font-medium text-tfa-text-primary mb-3">Current Metrics (Alert Basis)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-tfa-text-secondary">Daily Rate:</span>
            <span className="ml-2 font-medium">{metrics.avgDailyRate}/day</span>
          </div>
          <div>
            <span className="text-tfa-text-secondary">Area Planted:</span>
            <span className="ml-2 font-medium">{metrics.areaPlanted.toFixed(2)} ha</span>
          </div>
          <div>
            <span className="text-tfa-text-secondary">Total Cladodes:</span>
            <span className="ml-2 font-medium">{metrics.totalCladodes.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-tfa-text-secondary">Stack Height:</span>
            <span className="ml-2 font-medium">{metrics.avgStackHeight.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'active', 'critical', 'high', 'medium', 'low'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
              ? 'bg-[#01AB93] text-white hover:bg-[#01E3C2]'
              : 'bg-tfa-bg-secondary text-tfa-text-secondary hover:bg-tfa-bg-tertiary'
              }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="tfa-card p-8 text-center">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-tfa-text-muted">No alerts in this category</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div key={alert.id} className={`tfa-card p-4 border-l-4 ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">{getSeverityIcon(alert.severity)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-tfa-text-primary">{alert.title}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${alert.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-sm text-tfa-text-secondary mt-1">{alert.description}</p>
                  {alert.recommendation && (
                    <p className="text-sm text-tfa-accent mt-2">💡 {alert.recommendation}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
