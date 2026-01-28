import { Suspense } from 'react';
import { PlotCard } from '@/components/dashboard/PlotCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const metadata = {
  title: 'Plots',
};

// Mock data for plots
const mockPlots = [
  {
    id: '1',
    plotCode: '1A',
    plotName: 'Main Field North',
    status: 'completed' as const,
    areaHa: 0.5,
    plannedDensity: 12000,
    actualDensity: 11800,
    plantedCount: 5900,
    survivalRate: 96,
    startDate: '2026-01-15',
    targetCompletionDate: '2026-01-22',
    actualCompletionDate: '2026-01-21',
  },
  {
    id: '2',
    plotCode: '2A',
    plotName: 'Main Field South',
    status: 'in_progress' as const,
    areaHa: 0.5,
    plannedDensity: 12000,
    actualDensity: 11500,
    plantedCount: 4800,
    survivalRate: 94,
    startDate: '2026-01-20',
    targetCompletionDate: '2026-01-28',
    progress: 80,
  },
  {
    id: '3',
    plotCode: '3B',
    plotName: 'East Section',
    status: 'in_progress' as const,
    areaHa: 0.75,
    plannedDensity: 12000,
    actualDensity: 11200,
    plantedCount: 3500,
    survivalRate: 92,
    startDate: '2026-01-22',
    targetCompletionDate: '2026-02-02',
    progress: 39,
  },
  {
    id: '4',
    plotCode: '4A',
    plotName: 'West Section',
    status: 'pending' as const,
    areaHa: 0.6,
    plannedDensity: 12000,
    targetCompletionDate: '2026-02-10',
  },
  {
    id: '5',
    plotCode: '5A',
    plotName: 'Extension North',
    status: 'pending' as const,
    areaHa: 0.8,
    plannedDensity: 12000,
    targetCompletionDate: '2026-02-20',
  },
];

export default function PlotsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tfa-text-primary md:text-3xl">
            Plots Management
          </h1>
          <p className="text-sm text-tfa-text-muted">
            {mockPlots.length} plots • {mockPlots.reduce((sum, p) => sum + p.areaHa, 0).toFixed(2)} ha total
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add New Plot
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="tfa-card p-4">
          <p className="text-sm text-tfa-text-muted">Completed</p>
          <p className="text-2xl font-bold text-tfa-primary">
            {mockPlots.filter((p) => p.status === 'completed').length}
          </p>
        </div>
        <div className="tfa-card p-4">
          <p className="text-sm text-tfa-text-muted">In Progress</p>
          <p className="text-2xl font-bold text-tfa-accent">
            {mockPlots.filter((p) => p.status === 'in_progress').length}
          </p>
        </div>
        <div className="tfa-card p-4">
          <p className="text-sm text-tfa-text-muted">Pending</p>
          <p className="text-2xl font-bold text-tfa-text-muted">
            {mockPlots.filter((p) => p.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Plots Grid */}
      <Suspense fallback={<LoadingSpinner />}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockPlots.map((plot) => (
            <PlotCard key={plot.id} plot={plot} />
          ))}
        </div>
      </Suspense>
    </div>
  );
}
