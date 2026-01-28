'use client';

import { useState, useEffect, useCallback } from 'react';

// Alert type - generated from dashboard metrics, not from database
export interface Alert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation: string | null;
  category: string;
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: string;
}

interface UseAlertsOptions {
  status?: 'active' | 'acknowledged' | 'resolved';
  severity?: string;
  limit?: number;
}

interface UseAlertsReturn {
  alerts: Alert[];
  activeCount: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  acknowledgeAlert: (id: string) => Promise<boolean>;
  resolveAlert: (id: string) => Promise<boolean>;
}

// Targets for generating alerts
const TARGETS = {
  dailyRate: 1200,
  areaPlanted: 2.0,
  density: 12000,
  stackHeight: 4.0
};

export function useAlerts(options: UseAlertsOptions = {}): UseAlertsReturn {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { status, severity, limit = 50 } = options;

  const fetchAlerts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch dashboard metrics and generate alerts from them
      const response = await fetch('/api/dashboard/overview');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      if (!data.success || !data.data) {
        throw new Error('Invalid dashboard response');
      }

      const m = data.data.metrics;
      const generatedAlerts: Alert[] = [];

      // Planting rate alert
      const ratePercent = (m.avgDailyRate / TARGETS.dailyRate) * 100;
      if (ratePercent < 100) {
        generatedAlerts.push({
          id: 'rate-1',
          severity: ratePercent < 50 ? 'critical' : ratePercent < 70 ? 'high' : 'medium',
          title: 'Planting Rate Below Target',
          description: `Current rate: ${m.avgDailyRate}/day (${Math.round(ratePercent)}% of ${TARGETS.dailyRate}/day target)`,
          recommendation: ratePercent < 50
            ? 'Urgent: Add additional workers or extend work hours immediately'
            : 'Consider adding 1-2 workers or optimizing planting process',
          category: 'performance',
          createdAt: new Date().toISOString(),
          status: 'active'
        });
      }

      // Area progress alert
      const areaPercent = (m.areaPlanted / TARGETS.areaPlanted) * 100;
      if (areaPercent < 50) {
        generatedAlerts.push({
          id: 'area-1',
          severity: areaPercent < 25 ? 'high' : 'medium',
          title: 'Area Planted Behind Schedule',
          description: `${m.areaPlanted.toFixed(2)} ha planted (${Math.round(areaPercent)}% of ${TARGETS.areaPlanted} ha target)`,
          recommendation: 'Focus resources on expanding planted area coverage',
          category: 'progress',
          createdAt: new Date().toISOString(),
          status: 'active'
        });
      }

      // Stack height achievement
      if (m.avgStackHeight >= TARGETS.stackHeight) {
        generatedAlerts.push({
          id: 'stack-1',
          severity: 'low',
          title: 'Stack Height Target Achieved',
          description: `Average ${m.avgStackHeight.toFixed(1)} cladodes per station (Target: ${TARGETS.stackHeight})`,
          recommendation: 'Continue current multi-cladode stacking practice',
          category: 'achievement',
          createdAt: new Date().toISOString(),
          status: 'acknowledged'
        });
      }

      // Filter alerts based on options
      let filteredAlerts = generatedAlerts;
      if (status) {
        filteredAlerts = filteredAlerts.filter(a => a.status === status);
      }
      if (severity) {
        filteredAlerts = filteredAlerts.filter(a => a.severity === severity);
      }

      setAlerts(filteredAlerts.slice(0, limit));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch alerts'));
    } finally {
      setIsLoading(false);
    }
  }, [status, severity, limit]);

  const acknowledgeAlert = async (id: string): Promise<boolean> => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'acknowledged' as const } : a
      )
    );
    return true;
  };

  const resolveAlert = async (id: string): Promise<boolean> => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'resolved' as const } : a
      )
    );
    return true;
  };

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const activeCount = alerts.filter((a) => a.status === 'active').length;

  return {
    alerts,
    activeCount,
    isLoading,
    error,
    refetch: fetchAlerts,
    acknowledgeAlert,
    resolveAlert,
  };
}
