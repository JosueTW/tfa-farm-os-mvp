'use client';

import { useEffect, useState } from 'react';

interface DashboardData {
  totalCladodes: number;
  totalStations: number;
  areaPlanted: number;
  avgStackHeight: number;
}

// Default data from database
const DEFAULT_DATA: DashboardData = {
  totalCladodes: 2419,
  totalStations: 591,
  areaPlanted: 0.98,
  avgStackHeight: 4.1,
};

export default function PlotsPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>(DEFAULT_DATA);
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
          setDashboardData({
            totalCladodes: m.totalCladodes || 0,
            totalStations: m.totalStations || 0,
            areaPlanted: m.areaPlanted || 0,
            avgStackHeight: m.avgStackHeight || 0,
          });
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        if (isMounted) setIsUpdating(false);
      }
    }

    fetchData();
    return () => { isMounted = false; };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'planting': return 'bg-blue-100 text-blue-800';
      case 'clearing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✓';
      case 'planting': return '🌱';
      case 'clearing': return '🔨';
      default: return '○';
    }
  };

  // Status counts based on current operations
  const statusCounts = {
    pending: 0,
    clearing: 0,
    planting: 1,
    completed: 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-tfa-text-primary md:text-3xl">
          Plot Management
        </h1>
        <p className="text-sm text-tfa-text-muted mt-1">
          Manage and monitor all plantation plots
          {isUpdating && ' • Updating...'}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="tfa-card p-4">
          <div className="text-2xl font-bold text-tfa-primary dark:text-tfa-accent">
            {dashboardData.areaPlanted.toFixed(2)} ha
          </div>
          <div className="text-sm text-tfa-text-muted">Area Planted</div>
          <div className="text-xs text-tfa-text-muted mt-1">of 2.0 ha total</div>
        </div>
        <div className="tfa-card p-4">
          <div className="text-2xl font-bold text-tfa-primary">
            {dashboardData.totalCladodes.toLocaleString()}
          </div>
          <div className="text-sm text-tfa-text-muted">Total Cladodes</div>
        </div>
        <div className="tfa-card p-4">
          <div className="text-2xl font-bold text-tfa-secondary">
            {dashboardData.totalStations.toLocaleString()}
          </div>
          <div className="text-sm text-tfa-text-muted">Total Stations</div>
        </div>
        <div className="tfa-card p-4">
          <div className="text-2xl font-bold text-tfa-tertiary">
            {dashboardData.avgStackHeight.toFixed(1)}
          </div>
          <div className="text-sm text-tfa-text-muted">Avg Stack Height</div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="tfa-card p-4">
        <h2 className="text-lg font-semibold text-tfa-text-primary mb-4">Plot Status Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['pending', 'clearing', 'planting', 'completed'].map((status) => (
            <div key={status} className="text-center p-3 rounded-lg bg-tfa-bg-secondary">
              <div className="text-2xl mb-1">{getStatusIcon(status)}</div>
              <div className="text-xl font-bold text-tfa-text-primary">
                {statusCounts[status as keyof typeof statusCounts]}
              </div>
              <div className="text-sm text-tfa-text-muted capitalize">{status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Plots Info */}
      <div className="tfa-card p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📍</div>
          <h3 className="text-lg font-medium text-tfa-text-primary mb-2">
            Steelpoort Nursery - Active Planting
          </h3>
          <p className="text-tfa-text-muted max-w-md mx-auto">
            Current operations are focused on the main nursery plot with hybrid density planting
            (4m primary grid + 2m in-fill rows).
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 max-w-sm mx-auto text-left">
            <div className="p-3 bg-tfa-bg-secondary rounded-lg">
              <div className="text-sm text-tfa-text-muted">Grid Pattern</div>
              <div className="font-medium text-tfa-text-primary">4m × 4m primary</div>
            </div>
            <div className="p-3 bg-tfa-bg-secondary rounded-lg">
              <div className="text-sm text-tfa-text-muted">In-fill Rows</div>
              <div className="font-medium text-tfa-text-primary">2m spacing</div>
            </div>
            <div className="p-3 bg-tfa-bg-secondary rounded-lg">
              <div className="text-sm text-tfa-text-muted">Target Density</div>
              <div className="font-medium text-tfa-text-primary">12,000/ha</div>
            </div>
            <div className="p-3 bg-tfa-bg-secondary rounded-lg">
              <div className="text-sm text-tfa-text-muted">Stack Height</div>
              <div className="font-medium text-tfa-text-primary">4-5 cladodes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
