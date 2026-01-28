'use client';

import { useState } from 'react';
import { Mic, Camera, CheckSquare, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function FieldHomePage() {
  const [isRecording, setIsRecording] = useState(false);

  // Mock data
  const workerName = 'Ansi';
  const todayGoal = 400;
  const todayProgress = 147;
  const progressPercent = Math.round((todayProgress / todayGoal) * 100);
  const pendingSync = 2;

  const currentTime = new Date();
  const greeting =
    currentTime.getHours() < 12
      ? 'Good Morning'
      : currentTime.getHours() < 18
      ? 'Good Afternoon'
      : 'Good Evening';

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-tfa-text-primary">
          {greeting}, {workerName}! 🌅
        </h1>
        <p className="text-sm text-tfa-text-muted">
          {currentTime.toLocaleDateString('en-ZA', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Today's Goal */}
      <div className="tfa-card p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-tfa-text-muted">Today's Goal</span>
          <span className="text-sm font-medium">Plant {todayGoal} cladodes</span>
        </div>
        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-2xl font-bold font-mono">
              {todayProgress} / {todayGoal}
            </span>
            <span className="text-sm font-medium text-tfa-primary">
              {progressPercent}%
            </span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>
      </div>

      {/* Record Update Button */}
      <div className="tfa-card p-6 text-center">
        <p className="mb-4 text-sm text-tfa-text-muted">
          Tap to tell us what you did today
        </p>
        <Button
          size="lg"
          className={cn(
            'h-24 w-24 rounded-full text-white',
            isRecording
              ? 'animate-pulse bg-error'
              : 'bg-tfa-primary hover:bg-tfa-primary-dark'
          )}
          onClick={() => setIsRecording(!isRecording)}
        >
          <Mic className="h-10 w-10" />
        </Button>
        <p className="mt-4 font-semibold">
          {isRecording ? '🎤 Recording...' : '🎤 Record Update'}
        </p>
        {isRecording && (
          <p className="mt-2 font-mono text-sm text-tfa-text-muted">00:00</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="flex h-20 flex-col items-center justify-center gap-2"
        >
          <Camera className="h-6 w-6" />
          <span>Take Photos</span>
        </Button>
        <Button
          variant="outline"
          className="flex h-20 flex-col items-center justify-center gap-2"
        >
          <CheckSquare className="h-6 w-6" />
          <span>My Tasks (3)</span>
        </Button>
      </div>

      {/* Pending Sync */}
      {pendingSync > 0 && (
        <div className="flex items-center justify-center gap-2 text-sm text-tfa-text-muted">
          <Clock className="h-4 w-4" />
          <span>Offline Mode: {pendingSync} items queued</span>
        </div>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
