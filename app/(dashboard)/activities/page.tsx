import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';

export const metadata = {
  title: 'Activities',
};

// Mock data
const mockActivities = [
  {
    id: '1',
    activityType: 'planting',
    plotCode: '2A',
    date: '2026-01-26',
    time: '10:30',
    description: 'Planted 400 cladodes',
    workersCount: 6,
    hoursWorked: 8,
    reportedBy: 'Ansi',
    reportMethod: 'whatsapp',
    status: 'completed',
  },
  {
    id: '2',
    activityType: 'planting',
    plotCode: '2A',
    date: '2026-01-25',
    time: '09:00',
    description: 'Planted 850 cladodes',
    workersCount: 6,
    hoursWorked: 8,
    reportedBy: 'Ansi',
    reportMethod: 'app',
    status: 'completed',
  },
  {
    id: '3',
    activityType: 'inspection',
    plotCode: '3B',
    date: '2026-01-24',
    time: '14:00',
    description: 'Quality check - spacing variance detected',
    workersCount: 1,
    hoursWorked: 2,
    reportedBy: 'Terence',
    reportMethod: 'app',
    status: 'issue',
  },
  {
    id: '4',
    activityType: 'planting',
    plotCode: '2A',
    date: '2026-01-23',
    time: '08:00',
    description: 'Planted 950 cladodes',
    workersCount: 7,
    hoursWorked: 9,
    reportedBy: 'Ansi',
    reportMethod: 'whatsapp',
    status: 'completed',
  },
  {
    id: '5',
    activityType: 'site_clearing',
    plotCode: '3B',
    date: '2026-01-22',
    time: '07:30',
    description: 'Cleared vegetation and prepared soil',
    workersCount: 8,
    hoursWorked: 6,
    reportedBy: 'Team Lead',
    reportMethod: 'manual',
    status: 'completed',
  },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'planting':
      return '🌱';
    case 'inspection':
      return '🔍';
    case 'site_clearing':
      return '🪓';
    case 'weeding':
      return '🌿';
    default:
      return '📋';
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-tfa-primary/20 text-tfa-primary';
    case 'issue':
      return 'bg-warning/20 text-warning';
    case 'pending':
      return 'bg-tfa-text-muted/20 text-tfa-text-muted';
    default:
      return 'bg-gray-500/20 text-gray-500';
  }
};

const getMethodBadge = (method: string) => {
  switch (method) {
    case 'whatsapp':
      return 'bg-green-500/20 text-green-500';
    case 'app':
      return 'bg-tfa-accent/20 text-tfa-accent';
    case 'manual':
      return 'bg-tfa-secondary/20 text-tfa-secondary';
    default:
      return 'bg-gray-500/20 text-gray-500';
  }
};

export default function ActivitiesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tfa-text-primary md:text-3xl">
            Activities Log
          </h1>
          <p className="text-sm text-tfa-text-muted">
            All field operations and observations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Log Activity
          </Button>
        </div>
      </div>

      {/* Activities Table */}
      <Suspense fallback={<LoadingSpinner />}>
        <div className="tfa-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-tfa-border bg-tfa-bg-tertiary">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-tfa-text-muted">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-tfa-text-muted">
                    Plot
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-tfa-text-muted">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-tfa-text-muted">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-tfa-text-muted">
                    Workers
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-tfa-text-muted">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-tfa-text-muted">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tfa-border">
                {mockActivities.map((activity) => (
                  <tr
                    key={activity.id}
                    className="hover:bg-tfa-bg-secondary transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {getActivityIcon(activity.activityType)}
                        </span>
                        <span className="text-sm font-medium capitalize">
                          {activity.activityType.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-tfa-bg-tertiary px-2 py-1 text-sm font-mono">
                        {activity.plotCode}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>{activity.date}</div>
                      <div className="text-tfa-text-muted">{activity.time}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{activity.description}</td>
                    <td className="px-4 py-3 text-sm">
                      {activity.workersCount} ({activity.hoursWorked}h)
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getMethodBadge(
                          activity.reportMethod
                        )}`}
                      >
                        {activity.reportMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(
                          activity.status
                        )}`}
                      >
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
