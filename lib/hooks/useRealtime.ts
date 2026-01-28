'use client';

import { useEffect, useCallback, useRef } from 'react';
import { getClient } from '@/lib/supabase/client';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type TableName = 'activities' | 'alerts' | 'plots' | 'field_observations';
type EventType = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseRealtimeOptions<T> {
  table: TableName;
  event?: EventType;
  filter?: string;
  onInsert?: (payload: T) => void;
  onUpdate?: (payload: T) => void;
  onDelete?: (payload: { old: T }) => void;
  enabled?: boolean;
}

/**
 * Hook for subscribing to Supabase Realtime changes
 */
export function useRealtime<T extends Record<string, unknown>>({
  table,
  event = '*',
  filter,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
}: UseRealtimeOptions<T>) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabase = getClient();

  const handleChange = useCallback(
    (payload: RealtimePostgresChangesPayload<T>) => {
      switch (payload.eventType) {
        case 'INSERT':
          onInsert?.(payload.new as T);
          break;
        case 'UPDATE':
          onUpdate?.(payload.new as T);
          break;
        case 'DELETE':
          onDelete?.({ old: payload.old as T });
          break;
      }
    },
    [onInsert, onUpdate, onDelete]
  );

  useEffect(() => {
    if (!enabled) return;

    const channelName = `${table}-changes-${Date.now()}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes' as any,
        {
          event,
          schema: 'public',
          table,
          filter,
        },
        handleChange as any
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [supabase, table, event, filter, handleChange, enabled]);

  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, [supabase]);

  return { unsubscribe };
}

/**
 * Convenience hook for activity updates
 */
export function useRealtimeActivities(
  callbacks: {
    onNew?: (activity: Record<string, unknown>) => void;
    onUpdate?: (activity: Record<string, unknown>) => void;
  }
) {
  return useRealtime({
    table: 'activities',
    onInsert: callbacks.onNew,
    onUpdate: callbacks.onUpdate,
  });
}

/**
 * Convenience hook for alert updates
 */
export function useRealtimeAlerts(
  callbacks: {
    onNew?: (alert: Record<string, unknown>) => void;
    onUpdate?: (alert: Record<string, unknown>) => void;
  }
) {
  return useRealtime({
    table: 'alerts',
    onInsert: callbacks.onNew,
    onUpdate: callbacks.onUpdate,
  });
}
