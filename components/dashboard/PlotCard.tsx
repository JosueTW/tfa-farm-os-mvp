'use client';

import Link from 'next/link';
import { MapPin, TrendingUp, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Plot {
  id: string;
  plotCode: string;
  plotName: string;
  status: 'pending' | 'clearing' | 'in_progress' | 'completed';
  areaHa: number;
  plannedDensity: number;
  actualDensity?: number;
  plantedCount?: number;
  survivalRate?: number;
  startDate?: string;
  targetCompletionDate?: string;
  actualCompletionDate?: string;
  progress?: number;
}

interface PlotCardProps {
  plot: Plot;
}

export function PlotCard({ plot }: PlotCardProps) {
  const getStatusColor = (status: Plot['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-tfa-primary text-white';
      case 'in_progress':
        return 'bg-tfa-accent text-white';
      case 'clearing':
        return 'bg-tfa-tertiary text-white';
      case 'pending':
        return 'bg-tfa-text-muted text-white';
    }
  };

  const getStatusLabel = (status: Plot['status']) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const progressPercent =
    plot.progress ??
    (plot.plantedCount && plot.plannedDensity && plot.areaHa
      ? Math.round((plot.plantedCount / (plot.plannedDensity * plot.areaHa)) * 100)
      : 0);

  return (
    <Link href={`/plots/${plot.id}`}>
      <div className="tfa-card p-4 transition-all hover:border-tfa-accent hover:shadow-md">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold font-mono">{plot.plotCode}</span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  getStatusColor(plot.status)
                )}
              >
                {getStatusLabel(plot.status)}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-tfa-text-muted">{plot.plotName}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{plot.areaHa} ha</p>
          </div>
        </div>

        {/* Progress (for in-progress plots) */}
        {(plot.status === 'in_progress' || plot.status === 'clearing') && (
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-tfa-text-muted">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-tfa-border pt-3">
          <div className="text-center">
            <p className="text-xs text-tfa-text-muted">Density</p>
            <p className="font-mono text-sm font-medium">
              {plot.actualDensity?.toLocaleString() || '—'}/ha
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-tfa-text-muted">Planted</p>
            <p className="font-mono text-sm font-medium">
              {plot.plantedCount?.toLocaleString() || '—'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-tfa-text-muted">Survival</p>
            <p
              className={cn(
                'font-mono text-sm font-medium',
                plot.survivalRate && plot.survivalRate >= 93
                  ? 'text-tfa-primary'
                  : plot.survivalRate && plot.survivalRate < 90
                  ? 'text-error'
                  : ''
              )}
            >
              {plot.survivalRate ? `${plot.survivalRate}%` : '—'}
            </p>
          </div>
        </div>

        {/* Target Date */}
        {plot.targetCompletionDate && (
          <div className="mt-3 flex items-center gap-1 text-xs text-tfa-text-muted">
            <Calendar className="h-3 w-3" />
            <span>
              Target:{' '}
              {plot.actualCompletionDate
                ? `Completed ${plot.actualCompletionDate}`
                : plot.targetCompletionDate}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
