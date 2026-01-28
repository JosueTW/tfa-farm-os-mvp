# TFA Farm OS - Component Library

## Overview

Components are organized into four categories:
- **ui/** - Base shadcn/ui components
- **dashboard/** - Dashboard-specific components
- **field/** - Field worker app components
- **shared/** - Shared across all views

---

## UI Components (`/components/ui/`)

Base components from shadcn/ui, styled with TFA brand colors.

### Button

```tsx
import { Button } from '@/components/ui/button';

<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="tfa">TFA Primary</Button>
<Button variant="tfa-accent">TFA Accent</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Progress

```tsx
import { Progress } from '@/components/ui/progress';

<Progress value={75} />
```

### Input

```tsx
import { Input } from '@/components/ui/input';

<Input placeholder="Enter value..." />
<Input type="search" />
```

### Select

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

---

## Dashboard Components (`/components/dashboard/`)

### KPICard

Displays a key performance indicator with progress bar.

```tsx
import { KPICard } from '@/components/dashboard/KPICard';

<KPICard
  id="1"
  label="Area Planted"
  value="1.2 ha"
  target="2.0 ha"
  current={1.2}
  targetNum={2.0}
  delta={-40}
  trend="down"
  status="warning"
/>
```

**Props:**
- `label`: Metric name
- `value`: Current value (formatted string)
- `target`: Target value (formatted string)
- `current`: Current numeric value
- `targetNum`: Target numeric value
- `delta`: Percentage change
- `trend`: 'up' | 'down' | 'neutral'
- `status`: 'success' | 'warning' | 'error'

### AlertBanner

Displays active alerts with severity indicators.

```tsx
import { AlertBanner } from '@/components/dashboard/AlertBanner';

<AlertBanner
  alerts={[
    {
      id: '1',
      severity: 'high',
      title: 'Planting Behind Schedule',
      description: 'Current rate 29% below target',
      recommendation: 'Add more workers',
      createdAt: '2026-01-26T10:00:00Z'
    }
  ]}
/>
```

### ActivityTimeline

Shows recent activities in a timeline format.

```tsx
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';

<ActivityTimeline
  activities={[
    {
      id: '1',
      activityType: 'planting',
      plotCode: '2A',
      date: '2026-01-26',
      description: 'Planted 400 cladodes',
      status: 'completed'
    }
  ]}
  maxItems={5}
/>
```

### MapView

Interactive map showing plot boundaries and activities.

```tsx
import { MapView } from '@/components/dashboard/MapView';

<MapView className="h-[400px]" />
```

### WeeklyTrends

Charts showing planting rate and productivity trends.

```tsx
import { WeeklyTrends } from '@/components/dashboard/WeeklyTrends';

<WeeklyTrends />
```

### PlotCard

Summary card for a single plot.

```tsx
import { PlotCard } from '@/components/dashboard/PlotCard';

<PlotCard
  plot={{
    id: '1',
    plotCode: '2A',
    plotName: 'Main Field South',
    status: 'in_progress',
    areaHa: 0.5,
    plantedCount: 4800,
    survivalRate: 94,
    progress: 80
  }}
/>
```

---

## Field Components (`/components/field/`)

### VoiceRecorder

Voice note capture component.

```tsx
import { VoiceRecorder } from '@/components/field/VoiceRecorder';

<VoiceRecorder
  onRecordingComplete={(blob, duration) => {
    console.log('Recording complete', duration);
  }}
  maxDuration={120}
/>
```

### PhotoCapture

Camera capture with GPS tagging.

```tsx
import { PhotoCapture } from '@/components/field/PhotoCapture';

<PhotoCapture
  onPhotoCapture={(file, metadata) => {
    console.log('Photo captured', metadata);
  }}
  maxPhotos={5}
/>
```

### TaskChecklist

Interactive task list with progress tracking.

```tsx
import { TaskChecklist } from '@/components/field/TaskChecklist';

<TaskChecklist
  tasks={[
    { id: '1', title: 'Plant 400 cladodes', completed: false },
    { id: '2', title: 'Take photos', completed: true }
  ]}
  onTaskToggle={(taskId, completed) => {
    console.log('Task toggled', taskId, completed);
  }}
/>
```

### ProgressBar

Visual progress indicator.

```tsx
import { ProgressBar } from '@/components/field/ProgressBar';

<ProgressBar
  value={147}
  max={400}
  label="Daily Progress"
  showValues={true}
  size="lg"
/>
```

---

## Shared Components (`/components/shared/`)

### Header

Main application header with search and user menu.

```tsx
import { Header } from '@/components/shared/Header';

<Header />
```

### Sidebar

Navigation sidebar with collapsible state.

```tsx
import { Sidebar } from '@/components/shared/Sidebar';

<Sidebar />
```

### LoadingSpinner

Loading indicator.

```tsx
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

<LoadingSpinner size="md" />
<LoadingSpinner size="lg" />
```

### ErrorBoundary

Error boundary for graceful error handling.

```tsx
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

<ErrorBoundary>
  <ComponentThatMightError />
</ErrorBoundary>
```

### ThemeProvider

Theme context provider for dark/light mode.

```tsx
import { ThemeProvider } from '@/components/shared/ThemeProvider';

<ThemeProvider attribute="class" defaultTheme="dark">
  <App />
</ThemeProvider>
```

---

## Styling

All components use Tailwind CSS with TFA brand colors:

```css
/* Primary colors */
.bg-tfa-primary     /* #2B7035 - Cactus Green */
.bg-tfa-secondary   /* #025373 - TerraFerm Blue */
.bg-tfa-accent      /* #01E3C2 - Teal Cyan */
.bg-tfa-tertiary    /* #A37A51 - Earth Gold */

/* Dark mode surfaces */
.bg-tfa-bg-primary    /* #0A0F0A */
.bg-tfa-bg-secondary  /* #141A14 */
.bg-tfa-bg-tertiary   /* #1E261E */

/* Status colors */
.text-tfa-primary   /* Success */
.text-warning       /* Warning - #D35230 */
.text-error         /* Error - #D94848 */
```

Use the `cn()` utility for conditional classes:

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  isError && 'error-classes'
)} />
```
