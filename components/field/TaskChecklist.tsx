'use client';

import { useState } from 'react';
import { Check, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueTime?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface TaskChecklistProps {
  tasks: Task[];
  onTaskToggle: (taskId: string, completed: boolean) => void;
  onTaskClick?: (taskId: string) => void;
}

export function TaskChecklist({
  tasks,
  onTaskToggle,
  onTaskClick,
}: TaskChecklistProps) {
  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const getPriorityColor = (priority?: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-error';
      case 'medium':
        return 'border-l-warning';
      case 'low':
        return 'border-l-info';
      default:
        return 'border-l-transparent';
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress header */}
      <div className="tfa-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-tfa-text-muted">Today's Progress</span>
          <span className="text-sm font-medium">
            {completedCount}/{tasks.length} tasks
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
        {progressPercent === 100 && (
          <p className="mt-2 text-center text-sm text-tfa-primary font-medium">
            All tasks completed!
          </p>
        )}
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              'tfa-card flex items-center gap-3 p-3 border-l-4 transition-all',
              getPriorityColor(task.priority),
              task.completed && 'opacity-60'
            )}
          >
            {/* Checkbox */}
            <button
              onClick={() => onTaskToggle(task.id, !task.completed)}
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors flex-shrink-0',
                task.completed
                  ? 'border-tfa-primary bg-tfa-primary text-white'
                  : 'border-tfa-border hover:border-tfa-primary'
              )}
            >
              {task.completed && <Check className="h-4 w-4" />}
            </button>

            {/* Task content */}
            <div
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() => onTaskClick?.(task.id)}
            >
              <p
                className={cn(
                  'font-medium truncate',
                  task.completed && 'line-through text-tfa-text-muted'
                )}
              >
                {task.title}
              </p>
              {task.description && (
                <p className="text-sm text-tfa-text-muted truncate">
                  {task.description}
                </p>
              )}
              {task.dueTime && !task.completed && (
                <div className="flex items-center gap-1 mt-1 text-xs text-tfa-text-muted">
                  <Clock className="h-3 w-3" />
                  <span>Due by {task.dueTime}</span>
                </div>
              )}
            </div>

            {/* Chevron */}
            {onTaskClick && (
              <ChevronRight className="h-4 w-4 text-tfa-text-muted flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {tasks.length === 0 && (
        <div className="tfa-card p-8 text-center">
          <p className="text-tfa-text-muted">No tasks assigned for today</p>
        </div>
      )}
    </div>
  );
}
