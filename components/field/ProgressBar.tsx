'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showValues?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

export function ProgressBar({
  value,
  max,
  label,
  showValues = true,
  size = 'md',
  variant = 'default',
  className,
}: ProgressBarProps) {
  const percent = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4',
  };

  const variantClasses = {
    default: 'bg-tfa-primary',
    success: 'bg-tfa-primary',
    warning: 'bg-warning',
    error: 'bg-error',
  };

  // Auto-determine variant based on progress if not specified
  const effectiveVariant =
    variant === 'default'
      ? percent >= 80
        ? 'success'
        : percent >= 50
        ? 'warning'
        : 'error'
      : variant;

  return (
    <div className={cn('w-full', className)}>
      {/* Label row */}
      {(label || showValues) && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <span className="text-sm text-tfa-text-muted">{label}</span>
          )}
          {showValues && (
            <span className="text-sm font-medium font-mono">
              {value.toLocaleString()} / {max.toLocaleString()}
            </span>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-tfa-bg-tertiary',
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            'h-full transition-all duration-500 rounded-full',
            variantClasses[effectiveVariant]
          )}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Percentage */}
      {size === 'lg' && (
        <div className="flex justify-between mt-1 text-xs text-tfa-text-muted">
          <span>0%</span>
          <span
            className={cn(
              'font-medium',
              percent >= 80
                ? 'text-tfa-primary'
                : percent >= 50
                ? 'text-warning'
                : 'text-error'
            )}
          >
            {percent}%
          </span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
}
