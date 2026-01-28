import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface PlotDetailPageProps {
  params: { id: string };
}

// Mock data - in production, fetch from API
const mockPlotData = {
  id: '2',
  plotCode: '2A',
  plotName: 'Main Field South',
  status: 'in_progress' as const,
  areaHa: 0.5,
  plannedDensity: 12000,
  actualDensity: 11800,
  plantedCount: 5900,
  targetPlants: 6000,
  survivalRate: 94,
  survivingPlants: 5546,
  startDate: '2026-01-20',
  targetCompletionDate: '2026-01-28',
  progress: 80,
  budget: 89700,
  actualCost: 71760,
  daysRemaining: 2,
  activities: [
    {
      id: '1',
      date: '2026-01-26',
      type: 'Planting',
      details: '400 cladodes',
      workers: 6,
      status: 'completed',
    },
    {
      id: '2',
      date: '2026-01-25',
      type: 'Planting',
      details: '850 cladodes',
      workers: 6,
      status: 'completed',
    },
    {
      id: '3',
      date: '2026-01-24',
      type: 'Inspection',
      details: 'Quality check',
      workers: 1,
      status: 'issue',
    },
    {
      id: '4',
      date: '2026-01-23',
      type: 'Planting',
      details: '950 cladodes',
      workers: 7,
      status: 'completed',
    },
  ],
};

export default function PlotDetailPage({ params }: PlotDetailPageProps) {
  const plot = mockPlotData;

  if (!plot) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-tfa-primary text-white';
      case 'in_progress':
        return 'bg-tfa-accent text-white';
      case 'pending':
        return 'bg-tfa-text-muted text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getActivityStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'issue':
        return '⚠️';
      default:
        return '🔄';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Link
        href="/plots"
        className="inline-flex items-center text-sm text-tfa-text-muted hover:text-tfa-text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Plots
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-tfa-text-primary md:text-3xl">
              Plot {plot.plotCode}
            </h1>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                plot.status
              )}`}
            >
              {plot.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <p className="mt-1 text-tfa-text-muted">{plot.plotName}</p>
        </div>
        <Button variant="outline">Edit Plot</Button>
      </div>

      {/* Plot Info Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="tfa-card p-4">
          <div className="flex items-center gap-2 text-tfa-text-muted">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Area</span>
          </div>
          <p className="mt-1 text-xl font-bold">{plot.areaHa} ha</p>
        </div>
        <div className="tfa-card p-4">
          <div className="flex items-center gap-2 text-tfa-text-muted">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Density</span>
          </div>
          <p className="mt-1 text-xl font-bold">
            {plot.actualDensity?.toLocaleString() || '—'}/ha
          </p>
        </div>
        <div className="tfa-card p-4">
          <div className="flex items-center gap-2 text-tfa-text-muted">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Target Date</span>
          </div>
          <p className="mt-1 text-xl font-bold">{plot.targetCompletionDate}</p>
        </div>
        <div className="tfa-card p-4">
          <div className="flex items-center gap-2 text-tfa-text-muted">
            <Users className="h-4 w-4" />
            <span className="text-sm">Survival Rate</span>
          </div>
          <p className="mt-1 text-xl font-bold">{plot.survivalRate}%</p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="tfa-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Planting Progress</h2>
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span>
                {plot.plantedCount?.toLocaleString()} / {plot.targetPlants?.toLocaleString()} cladodes
              </span>
              <span className="font-medium">{plot.progress}%</span>
            </div>
            <Progress value={plot.progress} className="h-3" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-tfa-text-muted">Surviving Plants</p>
              <p className="text-lg font-semibold">
                {plot.survivingPlants?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-tfa-text-muted">Budget Used</p>
              <p className="text-lg font-semibold">
                R{plot.actualCost?.toLocaleString()} / R{plot.budget?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-tfa-text-muted">Days Remaining</p>
              <p className="text-lg font-semibold">{plot.daysRemaining}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="tfa-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Activities</h2>
          <Button variant="link" size="sm">
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {plot.activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 rounded-lg border border-tfa-border p-3"
            >
              <span className="text-xl">
                {getActivityStatusIcon(activity.status)}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{activity.type}</span>
                  <span className="text-sm text-tfa-text-muted">
                    {activity.details}
                  </span>
                </div>
                <p className="text-sm text-tfa-text-muted">
                  {activity.date} • {activity.workers} workers
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
