import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Download, Calendar, FileText } from 'lucide-react';

export const metadata = {
  title: 'Reports',
};

// Mock data
const mockReports = [
  {
    id: '1',
    title: 'Weekly Operations Report',
    period: 'Jan 20-26, 2026',
    type: 'weekly',
    status: 'ready',
    generatedAt: '2026-01-26T06:00:00Z',
    metrics: {
      areaPlanted: '1.2 ha',
      cladodesPlanted: 4500,
      survivalRate: '94%',
      laborHours: 280,
    },
  },
  {
    id: '2',
    title: 'Weekly Operations Report',
    period: 'Jan 13-19, 2026',
    type: 'weekly',
    status: 'ready',
    generatedAt: '2026-01-19T06:00:00Z',
    metrics: {
      areaPlanted: '0.8 ha',
      cladodesPlanted: 3200,
      survivalRate: '96%',
      laborHours: 240,
    },
  },
  {
    id: '3',
    title: 'Monthly Summary',
    period: 'December 2025',
    type: 'monthly',
    status: 'ready',
    generatedAt: '2026-01-01T06:00:00Z',
    metrics: {
      areaPlanted: '3.5 ha',
      cladodesPlanted: 14000,
      survivalRate: '93%',
      laborHours: 1120,
    },
  },
];

const getReportIcon = (type: string) => {
  switch (type) {
    case 'weekly':
      return '📊';
    case 'monthly':
      return '📈';
    case 'quarterly':
      return '📉';
    default:
      return '📋';
  }
};

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tfa-text-primary md:text-3xl">
            Reports & Analytics
          </h1>
          <p className="text-sm text-tfa-text-muted">
            Automated reports and performance analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Custom Report
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="tfa-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Current Week Summary</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-tfa-text-muted">Area Planted</p>
            <p className="text-2xl font-bold font-mono text-tfa-primary">1.2 ha</p>
            <p className="text-xs text-tfa-text-muted">+50% vs last week</p>
          </div>
          <div>
            <p className="text-sm text-tfa-text-muted">Cladodes Planted</p>
            <p className="text-2xl font-bold font-mono">4,500</p>
            <p className="text-xs text-tfa-text-muted">+40% vs last week</p>
          </div>
          <div>
            <p className="text-sm text-tfa-text-muted">Labor Hours</p>
            <p className="text-2xl font-bold font-mono">280 hrs</p>
            <p className="text-xs text-tfa-text-muted">+17% vs last week</p>
          </div>
          <div>
            <p className="text-sm text-tfa-text-muted">Avg Survival</p>
            <p className="text-2xl font-bold font-mono text-tfa-primary">94%</p>
            <p className="text-xs text-tfa-text-muted">-2% vs last week</p>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Available Reports</h2>
        <Suspense fallback={<LoadingSpinner />}>
          <div className="space-y-3">
            {mockReports.map((report) => (
              <div
                key={report.id}
                className="tfa-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getReportIcon(report.type)}</span>
                  <div>
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-sm text-tfa-text-muted">{report.period}</p>
                    <p className="mt-1 text-xs text-tfa-text-muted">
                      Generated: {new Date(report.generatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="grid grid-cols-4 gap-4 text-center text-xs">
                    <div>
                      <p className="text-tfa-text-muted">Area</p>
                      <p className="font-semibold">{report.metrics.areaPlanted}</p>
                    </div>
                    <div>
                      <p className="text-tfa-text-muted">Planted</p>
                      <p className="font-semibold">
                        {report.metrics.cladodesPlanted.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-tfa-text-muted">Survival</p>
                      <p className="font-semibold">{report.metrics.survivalRate}</p>
                    </div>
                    <div>
                      <p className="text-tfa-text-muted">Hours</p>
                      <p className="font-semibold">{report.metrics.laborHours}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                    <Button size="sm">
                      <Download className="mr-1 h-3 w-3" />
                      PDF
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Suspense>
      </div>
    </div>
  );
}
