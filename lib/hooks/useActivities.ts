'use client';

import { useState, useEffect, useCallback } from 'react';
import { getClient } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/types';

type Activity = Tables<'activities'>;

interface UseActivitiesOptions {
  plotId?: string;
  activityType?: string;
  date?: string;
  limit?: number;
}

interface UseActivitiesReturn {
  activities: Activity[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  createActivity: (data: Partial<Activity>) => Promise<Activity | null>;
}

export function useActivities(
  options: UseActivitiesOptions = {}
): UseActivitiesReturn {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = getClient();
  const { plotId, activityType, date, limit = 50 } = options;

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('activities')
        .select('*')
        .order('activity_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (plotId) {
        query = query.eq('plot_id', plotId);
      }

      if (activityType) {
        query = query.eq('activity_type', activityType);
      }

      if (date) {
        query = query.eq('activity_date', date);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setActivities(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch activities'));
    } finally {
      setIsLoading(false);
    }
  }, [supabase, plotId, activityType, date, limit]);

  const createActivity = async (data: Partial<Activity>): Promise<Activity | null> => {
    try {
      const { data: newActivity, error: createError } = await supabase
        .from('activities')
        .insert(data as any)
        .select()
        .single();

      if (createError) {
        throw new Error(createError.message);
      }

      // Add to local state
      setActivities((prev) => [newActivity, ...prev]);

      return newActivity;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create activity'));
      return null;
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    isLoading,
    error,
    refetch: fetchActivities,
    createActivity,
  };
}
