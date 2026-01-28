import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Validation schema for creating a plot
const createPlotSchema = z.object({
  plot_code: z.string().min(1).max(10),
  plot_name: z.string().min(1).max(100).optional(),
  area_ha: z.number().positive(),
  planned_density: z.number().int().positive().default(12000),
  status: z
    .enum(['pending', 'clearing', 'planting', 'completed'])
    .default('pending'),
  target_completion_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  geometry: z
    .object({
      type: z.literal('Polygon'),
      coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
    })
    .optional(),
});

// GET /api/plots - List all plots
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const includeMetrics = searchParams.get('include_metrics') === 'true';

    // Query plots from database view (which converts geometry to GeoJSON)
    // Falls back to regular table if view doesn't exist
    let query = supabase
      .from('plots_with_geojson')
      .select('id, plot_code, plot_name, area_ha, planned_density, status, start_date, target_completion_date, actual_completion_date, created_at, geometry')
      .order('plot_code', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    let { data: plots, error } = await query;

    // If view doesn't exist, fall back to regular plots table
    if (error && error.message?.includes('does not exist')) {
      console.log('View not found, falling back to plots table');
      const fallbackQuery = supabase
        .from('plots')
        .select('id, plot_code, plot_name, area_ha, planned_density, status, start_date, target_completion_date, actual_completion_date, created_at, geometry')
        .order('plot_code', { ascending: true });

      if (status) {
        fallbackQuery.eq('status', status);
      }

      const fallbackResult = await fallbackQuery;
      plots = fallbackResult.data;
      error = fallbackResult.error;
    }

    if (error) {
      console.error('Error fetching plots:', error);
      return NextResponse.json(
        { error: 'Failed to fetch plots' },
        { status: 500 }
      );
    }

    // Process geometry: handle various formats PostGIS might return
    const processedPlots = plots?.map((plot: any) => {
      if (plot.geometry) {
        // If it's already an object with a type property, it's valid GeoJSON
        if (typeof plot.geometry === 'object' && plot.geometry.type) {
          return plot;
        }
        // If it's a string, try to parse it as JSON
        if (typeof plot.geometry === 'string') {
          try {
            plot.geometry = JSON.parse(plot.geometry);
          } catch (e) {
            // Might be WKB hex string - set to null for now
            console.warn('Geometry format not supported for plot', plot.id);
            plot.geometry = null;
          }
        }
      }
      return plot;
    }) || [];

    return processMetrics(supabase, processedPlots, includeMetrics);
  } catch (error) {
    console.error('Plots GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to process metrics
async function processMetrics(supabase: any, plots: any[], includeMetrics: boolean) {
  // If metrics are requested, calculate them for each plot
  if (includeMetrics && plots.length > 0) {
    const plotsWithMetrics = await Promise.all(
      plots.map(async (plot: any) => {
        // Get activity summary
        const { data: activities } = await supabase
          .from('activities')
          .select('cladodes_planted, workers_count, hours_worked')
          .eq('plot_id', plot.id)
          .eq('activity_type', 'planting');

        const totalPlanted =
          activities?.reduce(
            (sum: number, a: any) => sum + (a.cladodes_planted || 0),
            0
          ) || 0;

        const totalWorkerHours =
          activities?.reduce((sum: number, a: any) => {
            return sum + (a.workers_count || 0) * (a.hours_worked || 0);
          }, 0) || 0;

        // Get latest health assessment
        const { data: healthData } = await supabase
          .from('plant_health')
          .select('survival_rate')
          .eq('plot_id', plot.id)
          .order('assessment_date', { ascending: false })
          .limit(1)
          .single();

        return {
          ...plot,
          metrics: {
            total_planted: totalPlanted,
            total_worker_hours: totalWorkerHours,
            survival_rate: healthData?.survival_rate || null,
            progress_percent: plot.planned_density && plot.area_ha
              ? Math.round(
                (totalPlanted / (plot.area_ha * plot.planned_density)) * 100
              )
              : 0,
          },
        };
      })
    );

    return NextResponse.json({ data: plotsWithMetrics });
  }

  return NextResponse.json({ data: plots });
}

// POST /api/plots - Create a new plot
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();

    // Validate input
    const validationResult = createPlotSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const plotData = validationResult.data;

    // Check if plot_code already exists
    const { data: existingPlot } = await supabase
      .from('plots')
      .select('id')
      .eq('plot_code', plotData.plot_code)
      .single();

    if (existingPlot) {
      return NextResponse.json(
        { error: 'Plot code already exists' },
        { status: 409 }
      );
    }

    // Prepare the data for insertion
    const insertData: Record<string, unknown> = {
      plot_code: plotData.plot_code,
      plot_name: plotData.plot_name || `Plot ${plotData.plot_code}`,
      area_ha: plotData.area_ha,
      planned_density: plotData.planned_density,
      status: plotData.status,
      target_completion_date: plotData.target_completion_date,
    };

    // Handle geometry if provided
    if (plotData.geometry) {
      insertData.geometry = JSON.stringify(plotData.geometry);
    }

    const { data, error } = await supabase
      .from('plots')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating plot:', error);
      return NextResponse.json(
        { error: 'Failed to create plot' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Plot created successfully',
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Plots POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
