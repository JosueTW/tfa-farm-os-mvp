'use client';

import Link from 'next/link';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  activityType: string;
  plotCode: string;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'issue';
}

interface ActivityTimelineProps {
  activities: Activity[];
  maxItems?: number;
}

export function ActivityTimeline({ activities, maxItems = 5 }: ActivityTimelineProps) {
  const displayActivities = activities.slice(0, maxItems);

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
      case 'watering':
        return '💧';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-tfa-primary';
      case 'issue':
        return 'bg-warning';
      case 'pending':
        return 'bg-tfa-text-muted';
    }
  };

  return (
    <div className="tfa-card p-4">
      <div className="space-y-4">
        {displayActivities.map((activity, index) => (
          <div key={activity.id} className="flex gap-3">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <span className="text-lg">{getActivityIcon(activity.activityType)}</span>
              {index < displayActivities.length - 1 && (
                <div className="mt-1 h-full w-0.5 bg-tfa-border" />
              )}
            </div>

            {/* Activity content */}
            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">
                      {activity.activityType.replace('_', ' ')}
                    </span>
                    <span className="rounded bg-tfa-bg-tertiary px-1.5 py-0.5 text-xs font-mono">
                      {activity.plotCode}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-tfa-text-secondary">
                    {activity.description}
                  </p>
                </div>
                <div
                  className={cn('h-2 w-2 rounded-full', getStatusColor(activity.status))}
                  title={activity.status}
                />
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-tfa-text-muted">
                <Clock className="h-3 w-3" />
                <span>{activity.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length > maxItems && (
        <Link
          href="/activities"
          className="mt-4 block text-center text-sm text-tfa-accent hover:underline"
        >
          View all {activities.length} activities →
        </Link>
      )}

      {activities.length === 0 && (
        <div className="py-8 text-center text-tfa-text-muted">
          <p>No recent activities</p>
        </div>
      )}
    </div>
  );
}
