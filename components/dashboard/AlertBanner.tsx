'use client';

import { useState } from 'react';
import { AlertTriangle, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation?: string;
  createdAt: string;
}

interface AlertBannerProps {
  alerts: Alert[];
}

export function AlertBanner({ alerts }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState(false);

  const activeAlerts = alerts.filter((a) => !dismissed.has(a.id));
  const highPriorityAlerts = activeAlerts.filter(
    (a) => a.severity === 'high' || a.severity === 'critical'
  );

  if (activeAlerts.length === 0) return null;

  const primaryAlert = highPriorityAlerts[0] || activeAlerts[0];

  const getSeverityStyles = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-error/10 border-error text-error';
      case 'high':
        return 'bg-warning/10 border-warning text-warning';
      case 'medium':
        return 'bg-tfa-tertiary/10 border-tfa-tertiary text-tfa-tertiary';
      case 'low':
        return 'bg-info/10 border-info text-info';
    }
  };

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      case 'low':
        return '🔵';
    }
  };

  return (
    <div className="space-y-2">
      {/* Primary Alert */}
      <div
        className={cn(
          'rounded-lg border-l-4 p-4',
          getSeverityStyles(primaryAlert.severity)
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">{getSeverityIcon(primaryAlert.severity)}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{primaryAlert.title}</span>
                <span className="rounded-full bg-current/20 px-2 py-0.5 text-xs uppercase">
                  {primaryAlert.severity}
                </span>
              </div>
              <p className="mt-1 text-sm opacity-90">{primaryAlert.description}</p>
              {primaryAlert.recommendation && (
                <p className="mt-2 text-sm">
                  <span className="font-medium">Recommendation:</span>{' '}
                  {primaryAlert.recommendation}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setDismissed((prev) => new Set(prev).add(primaryAlert.id))}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Additional Alerts Count */}
      {activeAlerts.length > 1 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between rounded-lg bg-tfa-bg-tertiary p-3 text-sm text-tfa-text-muted hover:bg-tfa-bg-elevated transition-colors"
        >
          <span>
            {activeAlerts.length - 1} more alert{activeAlerts.length - 1 > 1 ? 's' : ''}
          </span>
          <ChevronRight
            className={cn('h-4 w-4 transition-transform', expanded && 'rotate-90')}
          />
        </button>
      )}

      {/* Expanded Alerts */}
      {expanded && (
        <div className="space-y-2 pl-4">
          {activeAlerts.slice(1).map((alert) => (
            <div
              key={alert.id}
              className={cn(
                'rounded-lg border-l-4 p-3',
                getSeverityStyles(alert.severity)
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-2">
                  <span>{getSeverityIcon(alert.severity)}</span>
                  <div>
                    <span className="font-medium">{alert.title}</span>
                    <p className="mt-0.5 text-sm opacity-90">{alert.description}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setDismissed((prev) => new Set(prev).add(alert.id))
                  }
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
