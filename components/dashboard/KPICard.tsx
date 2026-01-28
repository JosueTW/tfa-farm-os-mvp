'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  id: string;
  label: string;
  value: string;
  target: string;
  current: number;
  targetNum: number;
  delta: number;
  trend: 'up' | 'down' | 'neutral';
  status: 'success' | 'warning' | 'error';
}

export function KPICard({
  label,
  value,
  target,
  current,
  targetNum,
  delta,
  trend,
  status,
}: KPICardProps) {
  const progressPercent = targetNum > 0 ? Math.min((current / targetNum) * 100, 100) : 0;

  const statusColors = {
    success: 'text-tfa-primary',
    warning: 'text-warning',
    error: 'text-error',
  };

  const statusBgColors = {
    success: 'bg-tfa-primary',
    warning: 'bg-warning',
    error: 'bg-error',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className="tfa-card p-4">
      <div className="flex items-start justify-between">
        <span className="text-sm text-tfa-text-muted">{label}</span>
        <div
          className={cn(
            'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
            status === 'success' && 'bg-tfa-primary/20 text-tfa-primary',
            status === 'warning' && 'bg-warning/20 text-warning',
            status === 'error' && 'bg-error/20 text-error'
          )}
        >
          <TrendIcon className="h-3 w-3" />
          <span>
            {delta > 0 ? '+' : ''}
            {delta}%
          </span>
        </div>
      </div>

      <div className="mt-2">
        <span className="text-2xl font-bold font-mono text-tfa-text-primary">
          {value}
        </span>
        <span className="ml-2 text-sm text-tfa-text-muted">/ {target}</span>
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-tfa-bg-tertiary">
          <div
            className={cn('h-full transition-all duration-500', statusBgColors[status])}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-tfa-text-muted">
          <span>0%</span>
          <span>{Math.round(progressPercent)}%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
