'use client';

import { useState, useEffect, useCallback } from 'react';
import { getClient } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/types';

type Plot = Tables<'plots'>;

interface UsePlotsOptions {
  status?: string;
}

interface UsePlotsReturn {
  plots: Plot[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  getPlotById: (id: string) => Plot | undefined;
  getPlotByCode: (code: string) => Plot | undefined;
}

export function usePlots(options: UsePlotsOptions = {}): UsePlotsReturn {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = getClient();
  const { status } = options;

  const fetchPlots = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('plots')
        .select('*')
        .order('plot_code', { ascending: true });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setPlots(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch plots'));
    } finally {
      setIsLoading(false);
    }
  }, [supabase, status]);

  const getPlotById = useCallback(
    (id: string) => plots.find((p) => p.id === id),
    [plots]
  );

  const getPlotByCode = useCallback(
    (code: string) => plots.find((p) => p.plot_code === code),
    [plots]
  );

  useEffect(() => {
    fetchPlots();
  }, [fetchPlots]);

  return {
    plots,
    isLoading,
    error,
    refetch: fetchPlots,
    getPlotById,
    getPlotByCode,
  };
}
