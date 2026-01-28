'use client';

import { useEffect, useState } from 'react';

interface Activity {
  id: string;
  activity_type: string;
  activity_date: string;
  cladodes_planted: number;
  stations_planted: number;
  avg_cladodes_per_station: number;
  workers_count: number;
  weather_condition: string;
  notes: string;
  reported_by: string;
}

interface Summary {
  totalActivities: number;
  totalCladodes: number;
  totalStations: number;
  avgDailyRate: number;
  totalWorkerDays: number;
}

// Default data from database
const DEFAULT_ACTIVITIES: Activity[] = [
  { id: '1', activity_type: 'planting', activity_date: '2026-01-22', cladodes_planted: 540, stations_planted: 135, avg_cladodes_per_station: 4, workers_count: 10, weather_condition: 'clear', notes: 'Multi-cladode photo evidence. 8 photos showing 3-5 cladodes per station.', reported_by: 'Nick Shapley' },
  { id: '2', activity_type: 'planting', activity_date: '2026-01-21', cladodes_planted: 535, stations_planted: 134, avg_cladodes_per_station: 4, workers_count: 10, weather_condition: 'clear', notes: 'Steady-state: 520-550/day sustained. Experienced crew operations.', reported_by: 'Nick Shapley' },
  { id: '3', activity_type: 'planting', activity_date: '2025-12-31', cladodes_planted: 498, stations_planted: 124, avg_cladodes_per_station: 4, workers_count: 9, weather_condition: 'clear', notes: 'Workforce expansion: 3 teams, 9 workers. Cumulative: ~2,137 plants.', reported_by: 'Nick Shapley' },
  { id: '4', activity_type: 'planting', activity_date: '2025-12-29', cladodes_planted: 486, stations_planted: 108, avg_cladodes_per_station: 4.5, workers_count: 6, weather_condition: 'clear', notes: 'HYBRID DENSITY DAY: Started 2m in-fill rows. Peak productivity 81/worker.', reported_by: 'Nick Shapley' },
  { id: '5', activity_type: 'planting', activity_date: '2025-12-23', cladodes_planted: 360, stations_planted: 90, avg_cladodes_per_station: 4, workers_count: 6, weather_condition: 'moderate_rain', notes: 'Rain day operations. Productivity reduced 25%. Audio log available.', reported_by: 'Nick Shapley' },
];

const DEFAULT_SUMMARY: Summary = {
  totalActivities: 7,
  totalCladodes: 2419,
  totalStations: 591,
  avgDailyRate: 538,
  totalWorkerDays: 47,
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>(DEFAULT_ACTIVITIES);
  const [summary, setSummary] = useState<Summary>(DEFAULT_SUMMARY);
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

        if (result.success && result.data) {
          const m = result.data.metrics;
          const acts = result.data.recentActivities || [];

          if (acts.length > 0) {
            setActivities(acts);
          }

          setSummary({
            totalActivities: acts.length,
            totalCladodes: m.totalCladodes || 0,
            totalStations: m.totalStations || 0,
            avgDailyRate: m.avgDailyRate || 0,
            totalWorkerDays: acts.reduce((sum: number, a: any) => sum + (a.workers_count || 0), 0),
          });
        }
      } catch (err) {
        console.error('Failed to fetch activities:', err);
      } finally {
        if (isMounted) setIsUpdating(false);
      }
    }

    fetchData();
    return () => { isMounted = false; };
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'planting': return '🌱';
      case 'inspection': return '🔍';
      case 'site_clearing': return '🔨';
      default: return '📋';
    }
  };

  const getWeatherIcon = (weather: string) => {
    if (weather?.includes('rain')) return '🌧️';
    if (weather?.includes('clear')) return '☀️';
    return '🌤️';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-ZA', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredActivities = activities.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'planting') return a.cladodes_planted > 0;
    if (filter === 'weather') return a.weather_condition?.includes('rain');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-tfa-text-primary md:text-3xl">
          Activities Log
        </h1>
        <p className="text-sm text-tfa-text-muted mt-1">
          Complete history of all field operations
          {isUpdating && ' • Updating...'}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="tfa-card p-4 text-center">
          <div className="text-2xl font-bold text-tfa-primary dark:text-tfa-accent">
            {summary.totalActivities}
          </div>
          <div className="text-sm text-tfa-text-muted">Total Activities</div>
        </div>
        <div className="tfa-card p-4 text-center">
          <div className="text-2xl font-bold text-tfa-primary">{summary.totalCladodes.toLocaleString()}</div>
          <div className="text-sm text-tfa-text-muted">Total Cladodes</div>
        </div>
        <div className="tfa-card p-4 text-center">
          <div className="text-2xl font-bold text-tfa-secondary">{summary.totalStations.toLocaleString()}</div>
          <div className="text-sm text-tfa-text-muted">Total Stations</div>
        </div>
        <div className="tfa-card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{summary.avgDailyRate.toLocaleString()}</div>
          <div className="text-sm text-tfa-text-muted">Avg Daily Rate</div>
        </div>
        <div className="tfa-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{summary.totalWorkerDays}</div>
          <div className="text-sm text-tfa-text-muted">Worker-Days</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'planting', 'weather'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
              ? 'bg-[#01AB93] text-white hover:bg-[#01E3C2]'
              : 'bg-tfa-bg-secondary text-tfa-text-secondary hover:bg-tfa-bg-tertiary'
              }`}
          >
            {f === 'all' ? 'All Activities' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Activities List */}
      <div className="space-y-3">
        {filteredActivities.map((activity) => (
          <div key={activity.id} className="tfa-card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{getActivityIcon(activity.activity_type)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-tfa-text-primary capitalize">
                      {activity.activity_type?.replace('_', ' ') || 'Activity'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${activity.cladodes_planted > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {activity.cladodes_planted > 0 ? 'Completed' : 'Logged'}
                    </span>
                    <span className="text-lg">{getWeatherIcon(activity.weather_condition)}</span>
                  </div>
                  <p className="text-sm text-tfa-text-secondary mt-1">{activity.notes}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-tfa-text-muted">
                    <span>📅 {formatDate(activity.activity_date)}</span>
                    {activity.cladodes_planted > 0 && <span>🌱 {activity.cladodes_planted} cladodes</span>}
                    {activity.stations_planted > 0 && <span>📍 {activity.stations_planted} stations</span>}
                    {activity.workers_count > 0 && <span>👥 {activity.workers_count} workers</span>}
                    <span>📝 {activity.reported_by}</span>
                  </div>
                </div>
              </div>
              {activity.cladodes_planted > 0 && (
                <div className="text-right">
                  <div className="text-lg font-bold text-tfa-primary dark:text-tfa-accent">
                    {activity.cladodes_planted}
                  </div>
                  {activity.avg_cladodes_per_station > 0 && (
                    <div className="text-xs text-tfa-text-muted">{activity.avg_cladodes_per_station} per station</div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
