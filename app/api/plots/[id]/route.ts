import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Validation schema for updating a plot
const updatePlotSchema = z.object({
  plot_code: z.string().min(1).max(10).optional(),
  plot_name: z.string().min(1).max(100).optional(),
  area_ha: z.number().positive().optional(),
  planned_density: z.number().int().positive().optional(),
  status: z.enum(['pending', 'clearing', 'planting', 'completed']).optional(),
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable(),
  target_completion_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable(),
  actual_completion_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable(),
  geometry: z
    .object({
      type: z.literal('Polygon'),
      coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
    })
    .optional()
    .nullable(),
});

interface RouteParams {
  params: { id: string };
}

// GET /api/plots/[id] - Get a single plot
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createClient();
    const { id } = params;

    // Validate UUID
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid plot ID' }, { status: 400 });
    }

    const { data: plot, error } = await supabase
      .from('plots')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !plot) {
      return NextResponse.json({ error: 'Plot not found' }, { status: 404 });
    }

    // Get related activities
    const { data: activities } = await supabase
      .from('activities')
      .select('*')
      .eq('plot_id', id)
      .order('activity_date', { ascending: false })
      .limit(10);

    // Get plant health data
    const { data: healthData } = await supabase
      .from('plant_health')
      .select('*')
      .eq('plot_id', id)
      .order('assessment_date', { ascending: false })
      .limit(5);

    // Get field observations
    const { data: observations } = await supabase
      .from('field_observations')
      .select('*')
      .eq('plot_id', id)
      .order('observation_date', { ascending: false })
      .limit(10);

    // Calculate metrics
    const totalPlanted =
      activities
        ?.filter((a: any) => a.activity_type === 'planting')
        .reduce((sum: number, a: any) => sum + (a.cladodes_planted || 0), 0) || 0;

    const latestHealth = healthData?.[0];

    return NextResponse.json({
      data: {
        ...plot,
        metrics: {
          total_planted: totalPlanted,
          survival_rate: latestHealth?.survival_rate || null,
          health_score: latestHealth?.health_score || null,
          progress_percent: plot.planned_density && plot.area_ha
            ? Math.round(
                (totalPlanted / (plot.area_ha * plot.planned_density)) * 100
              )
            : 0,
        },
        recent_activities: activities || [],
        health_history: healthData || [],
        observations: observations || [],
      },
    });
  } catch (error) {
    console.error('Plot GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/plots/[id] - Update a plot
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createClient();
    const { id } = params;
    const body = await request.json();

    // Validate UUID
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid plot ID' }, { status: 400 });
    }

    // Validate input
    const validationResult = updatePlotSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Check if plot exists
    const { data: existingPlot } = await supabase
      .from('plots')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingPlot) {
      return NextResponse.json({ error: 'Plot not found' }, { status: 404 });
    }

    // Prepare update data
    const preparedData: Record<string, unknown> = { ...updateData };

    // Handle geometry conversion
    if (updateData.geometry) {
      preparedData.geometry = JSON.stringify(updateData.geometry);
    }

    const { data, error } = await supabase
      .from('plots')
      .update(preparedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating plot:', error);
      return NextResponse.json(
        { error: 'Failed to update plot' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Plot updated successfully',
      data,
    });
  } catch (error) {
    console.error('Plot PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/plots/[id] - Delete a plot
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createClient();
    const { id } = params;

    // Validate UUID
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid plot ID' }, { status: 400 });
    }

    // Check if plot exists
    const { data: existingPlot } = await supabase
      .from('plots')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingPlot) {
      return NextResponse.json({ error: 'Plot not found' }, { status: 404 });
    }

    // Check for related activities
    const { count: activityCount } = await supabase
      .from('activities')
      .select('id', { count: 'exact', head: true })
      .eq('plot_id', id);

    if (activityCount && activityCount > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete plot with existing activities',
          activities_count: activityCount,
        },
        { status: 409 }
      );
    }

    const { error } = await supabase.from('plots').delete().eq('id', id);

    if (error) {
      console.error('Error deleting plot:', error);
      return NextResponse.json(
        { error: 'Failed to delete plot' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Plot deleted successfully',
    });
  } catch (error) {
    console.error('Plot DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
