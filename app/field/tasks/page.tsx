'use client';

import { useState } from 'react';
import { Check, Circle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueTime?: string;
}

export default function FieldTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Plant 400 cladodes in Plot 2A',
      description: 'Row spacing: 250cm, Plant spacing: 83cm',
      completed: false,
      dueTime: '12:00',
    },
    {
      id: '2',
      title: 'Take photos of planted rows',
      description: 'At least 3 photos for documentation',
      completed: true,
    },
    {
      id: '3',
      title: 'Report water needs',
      description: 'Check soil moisture and report',
      completed: false,
      dueTime: '15:00',
    },
    {
      id: '4',
      title: 'End of day check-in',
      description: 'Record voice note with progress',
      completed: false,
      dueTime: '17:00',
    },
  ]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-tfa-text-primary">My Tasks</h1>
        <p className="text-sm text-tfa-text-muted">
          {completedCount} of {tasks.length} completed
        </p>
      </div>

      {/* Progress */}
      <div className="tfa-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-tfa-text-muted">Daily Progress</span>
          <span className="text-sm font-medium">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-3" />
        {progressPercent === 100 && (
          <p className="mt-2 text-center text-sm text-tfa-primary font-medium">
            🎉 All tasks completed!
          </p>
        )}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`tfa-card p-4 transition-all ${
              task.completed ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleTask(task.id)}
                className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                  task.completed
                    ? 'border-tfa-primary bg-tfa-primary text-white'
                    : 'border-tfa-border hover:border-tfa-primary'
                }`}
              >
                {task.completed && <Check className="h-4 w-4" />}
              </button>
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    task.completed
                      ? 'text-tfa-text-muted line-through'
                      : 'text-tfa-text-primary'
                  }`}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="mt-1 text-sm text-tfa-text-muted">
                    {task.description}
                  </p>
                )}
                {task.dueTime && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-tfa-text-muted">
                    <Clock className="h-3 w-3" />
                    <span>Due by {task.dueTime}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Button */}
      <Button className="w-full" variant="outline">
        + Add Custom Task
      </Button>
    </div>
  );
}
