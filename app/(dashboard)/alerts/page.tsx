import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Bell, Check, Filter } from 'lucide-react';

export const metadata = {
  title: 'Alerts',
};

// Mock data
const mockAlerts = [
  {
    id: '1',
    severity: 'high',
    type: 'schedule_delay',
    title: 'Planting Behind Schedule',
    description: 'Current rate 29% below target for 3 consecutive days',
    recommendation: 'Add 2 workers or extend hours',
    plotCode: null,
    createdAt: '2026-01-26T08:00:00Z',
    status: 'active',
  },
  {
    id: '2',
    severity: 'medium',
    type: 'quality_issue',
    title: 'Row Spacing Variance in Plot 3B',
    description: 'Detected 248cm avg (target: 250cm)',
    recommendation: 'Supervisor inspection required',
    plotCode: '3B',
    createdAt: '2026-01-25T14:30:00Z',
    status: 'active',
  },
  {
    id: '3',
    severity: 'low',
    type: 'weather_warning',
    title: 'Rain Forecast',
    description: '15mm rainfall expected in next 48 hours',
    recommendation: 'Consider adjusting planting schedule',
    plotCode: null,
    createdAt: '2026-01-25T06:00:00Z',
    status: 'acknowledged',
  },
  {
    id: '4',
    severity: 'high',
    type: 'resource_shortage',
    title: 'Low Cladode Inventory',
    description: 'Only 3 days supply remaining',
    recommendation: 'Contact supplier immediately',
    plotCode: null,
    createdAt: '2026-01-24T10:00:00Z',
    status: 'resolved',
  },
  {
    id: '5',
    severity: 'medium',
    type: 'survival_rate',
    title: 'Survival Rate Drop in Plot 1A',
    description: 'Survival rate dropped to 89% (target: 95%)',
    recommendation: 'Agronomist review needed',
    plotCode: '1A',
    createdAt: '2026-01-23T16:00:00Z',
    status: 'resolved',
  },
];

const getSeverityStyles = (severity: string) => {
  switch (severity) {
    case 'critical':
      return {
        bg: 'bg-error/10',
        border: 'border-l-error',
        badge: 'bg-error text-white',
        icon: '🔴',
      };
    case 'high':
      return {
        bg: 'bg-warning/10',
        border: 'border-l-warning',
        badge: 'bg-warning text-white',
        icon: '🟠',
      };
    case 'medium':
      return {
        bg: 'bg-tfa-tertiary/10',
        border: 'border-l-tfa-tertiary',
        badge: 'bg-tfa-tertiary text-white',
        icon: '🟡',
      };
    case 'low':
      return {
        bg: 'bg-info/10',
        border: 'border-l-info',
        badge: 'bg-info text-white',
        icon: '🔵',
      };
    default:
      return {
        bg: 'bg-gray-500/10',
        border: 'border-l-gray-500',
        badge: 'bg-gray-500 text-white',
        icon: '⚪',
      };
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-error/20 text-error';
    case 'acknowledged':
      return 'bg-tfa-accent/20 text-tfa-accent';
    case 'resolved':
      return 'bg-tfa-primary/20 text-tfa-primary';
    default:
      return 'bg-gray-500/20 text-gray-500';
  }
};

export default function AlertsPage() {
  const activeCount = mockAlerts.filter((a) => a.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tfa-text-primary md:text-3xl">
            Alert Center
          </h1>
          <p className="text-sm text-tfa-text-muted">
            {activeCount} active alerts requiring attention
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Check className="mr-2 h-4 w-4" />
            Acknowledge All
          </Button>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="tfa-card p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔴</span>
            <div>
              <p className="text-sm text-tfa-text-muted">Critical/High</p>
              <p className="text-xl font-bold">
                {mockAlerts.filter((a) => ['critical', 'high'].includes(a.severity) && a.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="tfa-card p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🟡</span>
            <div>
              <p className="text-sm text-tfa-text-muted">Medium</p>
              <p className="text-xl font-bold">
                {mockAlerts.filter((a) => a.severity === 'medium' && a.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="tfa-card p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔵</span>
            <div>
              <p className="text-sm text-tfa-text-muted">Low</p>
              <p className="text-xl font-bold">
                {mockAlerts.filter((a) => a.severity === 'low' && a.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="tfa-card p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-sm text-tfa-text-muted">Resolved (7d)</p>
              <p className="text-xl font-bold">
                {mockAlerts.filter((a) => a.status === 'resolved').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <Suspense fallback={<LoadingSpinner />}>
        <div className="space-y-3">
          {mockAlerts.map((alert) => {
            const styles = getSeverityStyles(alert.severity);
            return (
              <div
                key={alert.id}
                className={`tfa-card border-l-4 p-4 ${styles.border} ${
                  alert.status === 'resolved' ? 'opacity-60' : ''
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{styles.icon}</span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{alert.title}</h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles.badge}`}
                        >
                          {alert.severity.toUpperCase()}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadge(
                            alert.status
                          )}`}
                        >
                          {alert.status}
                        </span>
                        {alert.plotCode && (
                          <span className="rounded bg-tfa-bg-tertiary px-2 py-0.5 text-xs font-mono">
                            Plot {alert.plotCode}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-tfa-text-secondary">
                        {alert.description}
                      </p>
                      {alert.recommendation && (
                        <p className="mt-2 text-sm">
                          <span className="font-medium text-tfa-accent">
                            Recommendation:
                          </span>{' '}
                          {alert.recommendation}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-tfa-text-muted">
                        {new Date(alert.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {alert.status === 'active' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Acknowledge
                      </Button>
                      <Button size="sm">Resolve</Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Suspense>
    </div>
  );
}
