import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActivityDetailPageProps {
  params: { id: string };
}

export default function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  // Mock data - in production, fetch from API based on params.id
  const activity = {
    id: params.id,
    activityType: 'planting',
    plotCode: '2A',
    plotName: 'Main Field South',
    date: '2026-01-26',
    time: '10:30',
    description: 'Planted 400 cladodes with good spacing. Rows aligned properly.',
    cladodesPlanted: 400,
    workersCount: 6,
    hoursWorked: 8,
    rowSpacingCm: 250,
    plantSpacingCm: 83,
    reportedBy: 'Ansi',
    reporterPhone: '+27123456789',
    reportMethod: 'whatsapp',
    status: 'completed',
    notes: 'Weather was hot, need more water tomorrow.',
    aiConfidence: 0.92,
    sourceMessage:
      'Hi Nick, planted 400 cladodes in Plot 2A today. Had 6 workers. Rows look good but spacing a bit tight. Weather was hot, need more water tomorrow.',
  };

  if (!activity) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Link
        href="/activities"
        className="inline-flex items-center text-sm text-tfa-text-muted hover:text-tfa-text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Activities
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌱</span>
            <h1 className="text-2xl font-bold text-tfa-text-primary md:text-3xl capitalize">
              {activity.activityType} Activity
            </h1>
          </div>
          <p className="mt-1 text-tfa-text-muted">
            Plot {activity.plotCode} • {activity.date}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit</Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </div>

      {/* Activity Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Main Details */}
        <div className="tfa-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Activity Details</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-tfa-text-muted" />
              <div>
                <p className="text-sm text-tfa-text-muted">Location</p>
                <p className="font-medium">
                  Plot {activity.plotCode} - {activity.plotName}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 text-tfa-text-muted" />
              <div>
                <p className="text-sm text-tfa-text-muted">Date & Time</p>
                <p className="font-medium">
                  {activity.date} at {activity.time}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-5 w-5 text-tfa-text-muted" />
              <div>
                <p className="text-sm text-tfa-text-muted">Workforce</p>
                <p className="font-medium">
                  {activity.workersCount} workers • {activity.hoursWorked} hours
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Planting Metrics */}
        <div className="tfa-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Planting Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-tfa-text-muted">Cladodes Planted</p>
              <p className="text-2xl font-bold font-mono text-tfa-primary">
                {activity.cladodesPlanted}
              </p>
            </div>
            <div>
              <p className="text-sm text-tfa-text-muted">Row Spacing</p>
              <p className="text-2xl font-bold font-mono">
                {activity.rowSpacingCm} cm
              </p>
            </div>
            <div>
              <p className="text-sm text-tfa-text-muted">Plant Spacing</p>
              <p className="text-2xl font-bold font-mono">
                {activity.plantSpacingCm} cm
              </p>
            </div>
            <div>
              <p className="text-sm text-tfa-text-muted">Plants/Worker</p>
              <p className="text-2xl font-bold font-mono">
                {Math.round(activity.cladodesPlanted / activity.workersCount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Source Message */}
      <div className="tfa-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Source Message</h2>
          <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-500">
            via {activity.reportMethod}
          </span>
        </div>
        <div className="rounded-lg bg-tfa-bg-tertiary p-4">
          <div className="flex items-start gap-3">
            <MessageSquare className="mt-0.5 h-5 w-5 text-tfa-text-muted" />
            <div>
              <p className="text-sm text-tfa-text-muted">
                From: {activity.reportedBy}
              </p>
              <p className="mt-2 text-tfa-text-primary">
                "{activity.sourceMessage}"
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-tfa-text-muted">
          <span>AI Confidence:</span>
          <div className="h-2 w-24 rounded-full bg-tfa-bg-tertiary">
            <div
              className="h-2 rounded-full bg-tfa-primary"
              style={{ width: `${activity.aiConfidence * 100}%` }}
            />
          </div>
          <span className="font-mono">{(activity.aiConfidence * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Notes */}
      {activity.notes && (
        <div className="tfa-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Notes</h2>
          <p className="text-tfa-text-secondary">{activity.notes}</p>
        </div>
      )}
    </div>
  );
}
