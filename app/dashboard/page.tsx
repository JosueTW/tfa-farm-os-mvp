'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertBanner } from '@/components/dashboard/AlertBanner';
import { KPICard } from '@/components/dashboard/KPICard';
import { MapView } from '@/components/dashboard/MapView';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { WeeklyTrends } from '@/components/dashboard/WeeklyTrends';
import { Button } from '@/components/ui/button';
import { Camera, Plus } from 'lucide-react';

interface DashboardMetrics {
  totalCladodes: number;
  totalStations: number;
  avgStackHeight: number;
  avgDailyRate: number;
  areaPlanted: number;
  plantingDays: number;
  weatherImpactDays: number;
}

interface Alert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation?: string;
  createdAt: string;
}

interface Activity {
  id: string;
  activityType: string;
  plotCode: string;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'issue';
}

// Targets
const TARGETS = {
  areaPlanted: 2.0,
  dailyRate: 1200,
  density: 12000,
};

// Default metrics to show immediately
const DEFAULT_METRICS: DashboardMetrics = {
  totalCladodes: 2419,
  totalStations: 591,
  avgStackHeight: 4.1,
  avgDailyRate: 538,
  areaPlanted: 0.98,
  plantingDays: 5,
  weatherImpactDays: 0,
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(DEFAULT_METRICS);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setIsLoading(true);

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
            weatherImpactDays: m.weatherImpactDays || 0,
          });

          // Transform activities
          const acts = result.data.recentActivities || [];
          setActivities(acts.slice(0, 5).map((a: any) => ({
            id: a.id,
            activityType: a.activity_type || 'planting',
            plotCode: 'N1-A',
            date: formatDate(a.activity_date),
            description: a.notes || `${a.cladodes_planted} cladodes`,
            status: a.cladodes_planted > 0 ? 'completed' : 'pending',
          })));

          // Generate alerts
          const newAlerts: Alert[] = [];
          const ratePercent = (m.avgDailyRate / TARGETS.dailyRate) * 100;
          if (ratePercent < 80) {
            newAlerts.push({
              id: '1',
              severity: ratePercent < 50 ? 'critical' : 'high',
              title: 'Planting Behind Schedule',
              description: `Current rate ${Math.round(100 - ratePercent)}% below target`,
              recommendation: 'Add workers or extend hours',
              createdAt: new Date().toISOString(),
            });
          }
          setAlerts(newAlerts);
          setDataLoaded(true);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setLastUpdated(new Date());
        }
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' });
  }

  const getWeekNumber = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((date.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
  };

  useEffect(() => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentWeek(getWeekNumber(now));
    if (!lastUpdated) {
      setLastUpdated(now);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate KPI percentages
  const areaPercent = (metrics.areaPlanted / TARGETS.areaPlanted) * 100;
  const ratePercent = (metrics.avgDailyRate / TARGETS.dailyRate) * 100;
  const densityActual = metrics.areaPlanted > 0 ? Math.round(metrics.totalCladodes / metrics.areaPlanted) : 0;
  const densityPercent = (densityActual / TARGETS.density) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-tfa-text-primary md:text-3xl">
            Steelpoort Nursery — Operations Command Center
          </h1>
          <p className="text-sm text-tfa-text-muted mt-1">
            {currentWeek ? `Week ${currentWeek},` : 'Week —,'}{' '}
            {currentYear ?? '—'} |
            {isLoading
              ? ' Updating...'
              : lastUpdated
                ? ` Last Updated: ${lastUpdated.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })} at ${lastUpdated.toLocaleTimeString('en-ZA')}`
                : ' Last Updated: —'}
            {!dataLoaded && ' (showing cached data)'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild className="bg-[#01AB93] text-white hover:bg-[#01E3C2]">
            <Link href="/dashboard/add-media">
              <Camera className="mr-2 h-4 w-4" />
              Add Media
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-tfa-border text-tfa-text-primary">
            <Link href="/dashboard/activities">
              <Plus className="mr-2 h-4 w-4" />
              Log Activity
            </Link>
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && <AlertBanner alerts={alerts} />}

      {/* Critical Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-tfa-text-primary mb-3">Critical Metrics</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KPICard
            id="area-planted"
            label="Area Planted"
            value={`${metrics.areaPlanted.toFixed(2)} ha`}
            target={`${TARGETS.areaPlanted} ha`}
            current={metrics.areaPlanted}
            targetNum={TARGETS.areaPlanted}
            delta={Math.round(areaPercent - 100)}
            trend={areaPercent >= 100 ? 'up' : 'down'}
            status={areaPercent >= 80 ? 'success' : areaPercent >= 50 ? 'warning' : 'error'}
          />
          <KPICard
            id="planting-rate"
            label="Planting Rate"
            value={`${metrics.avgDailyRate}/day`}
            target={`${TARGETS.dailyRate}/day`}
            current={metrics.avgDailyRate}
            targetNum={TARGETS.dailyRate}
            delta={Math.round(ratePercent - 100)}
            trend={ratePercent >= 100 ? 'up' : 'down'}
            status={ratePercent >= 80 ? 'success' : ratePercent >= 50 ? 'warning' : 'error'}
          />
          <KPICard
            id="plant-density"
            label="Plant Density"
            value={`${(densityActual / 1000).toFixed(1)}k/ha`}
            target={`${TARGETS.density / 1000}k/ha`}
            current={densityActual}
            targetNum={TARGETS.density}
            delta={Math.round(densityPercent - 100)}
            trend={densityPercent >= 100 ? 'up' : 'down'}
            status={densityPercent >= 90 ? 'success' : densityPercent >= 70 ? 'warning' : 'error'}
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="tfa-card p-4 text-center">
          <div className="text-2xl font-bold text-tfa-primary dark:text-tfa-accent">
            {metrics.totalCladodes.toLocaleString()}
          </div>
          <div className="text-sm text-tfa-text-muted">Total Cladodes</div>
        </div>
        <div className="tfa-card p-4 text-center">
          <div className="text-2xl font-bold text-tfa-primary">{metrics.totalStations.toLocaleString()}</div>
          <div className="text-sm text-tfa-text-muted">Total Stations</div>
        </div>
        <div className="tfa-card p-4 text-center">
          <div className="text-2xl font-bold text-tfa-secondary">{metrics.avgStackHeight.toFixed(1)}</div>
          <div className="text-sm text-tfa-text-muted">Avg Stack Height</div>
        </div>
        <div className="tfa-card p-4 text-center">
          <div className="text-2xl font-bold text-tfa-tertiary">{metrics.plantingDays}</div>
          <div className="text-sm text-tfa-text-muted">Planting Days</div>
        </div>
      </div>

      {/* Field Map */}
      <div>
        <h2 className="text-lg font-semibold text-tfa-text-primary mb-3">Field Map</h2>
        <MapView className="h-[300px] md:h-[400px]" />
      </div>

      {/* Activity Timeline & Trends */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold text-tfa-text-primary mb-3">Recent Activity</h2>
          <ActivityTimeline activities={activities} maxItems={5} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-tfa-text-primary mb-3">Weekly Trends</h2>
          <WeeklyTrends />
        </div>
      </div>
    </div>
  );
}
