'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

// Mock data for the chart
const plantingData = [
  { date: 'Mon', actual: 650, target: 1200 },
  { date: 'Tue', actual: 780, target: 1200 },
  { date: 'Wed', actual: 920, target: 1200 },
  { date: 'Thu', actual: 850, target: 1200 },
  { date: 'Fri', actual: 750, target: 1200 },
  { date: 'Sat', actual: 600, target: 1200 },
  { date: 'Sun', actual: 0, target: 0 },
];

const productivityData = [
  { date: 'Mon', productivity: 270 },
  { date: 'Tue', productivity: 312 },
  { date: 'Wed', productivity: 368 },
  { date: 'Thu', productivity: 340 },
  { date: 'Fri', productivity: 300 },
  { date: 'Sat', productivity: 240 },
  { date: 'Sun', productivity: 0 },
];

export function WeeklyTrends() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Planting Rate Chart */}
      <div className="tfa-card p-4">
        <h3 className="mb-4 font-semibold">Daily Planting Rate</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={plantingData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--tfa-border)"
                opacity={0.5}
              />
              <XAxis
                dataKey="date"
                stroke="var(--tfa-text-muted)"
                fontSize={12}
              />
              <YAxis stroke="var(--tfa-text-muted)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--tfa-bg-secondary)',
                  border: '1px solid var(--tfa-border)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--tfa-text-primary)' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#9AA89A"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
                name="Target"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#01E3C2"
                strokeWidth={2}
                dot={{ fill: '#01E3C2', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                name="Actual"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex justify-center gap-4 text-xs text-tfa-text-muted">
          <span className="flex items-center gap-1">
            <span className="h-0.5 w-4 bg-tfa-accent" /> Actual
          </span>
          <span className="flex items-center gap-1">
            <span className="h-0.5 w-4 bg-tfa-text-muted border-dashed border-t-2" /> Target
          </span>
        </div>
      </div>

      {/* Labor Productivity Chart */}
      <div className="tfa-card p-4">
        <h3 className="mb-4 font-semibold">Labor Productivity (Plants/Worker/Day)</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={productivityData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--tfa-border)"
                opacity={0.5}
              />
              <XAxis
                dataKey="date"
                stroke="var(--tfa-text-muted)"
                fontSize={12}
              />
              <YAxis stroke="var(--tfa-text-muted)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--tfa-bg-secondary)',
                  border: '1px solid var(--tfa-border)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--tfa-text-primary)' }}
              />
              <Bar
                dataKey="productivity"
                fill="#2B7035"
                radius={[4, 4, 0, 0]}
                name="Plants/Worker"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-center text-xs text-tfa-text-muted">
          Target: 400 plants/worker/day
        </div>
      </div>
    </div>
  );
}
