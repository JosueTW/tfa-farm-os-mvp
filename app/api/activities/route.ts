import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Validation schema for creating an activity
const createActivitySchema = z.object({
  plot_id: z.string().uuid(),
  activity_type: z.enum([
    'site_clearing',
    'planting',
    'inspection',
    'weeding',
    'watering',
    'fertilizing',
    'harvesting',
    'other',
  ]),
  activity_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  cladodes_planted: z.number().int().positive().optional(),
  workers_count: z.number().int().positive().optional(),
  hours_worked: z.number().positive().optional(),
  area_covered_ha: z.number().positive().optional(),
  row_spacing_cm: z.number().int().positive().optional(),
  plant_spacing_cm: z.number().int().positive().optional(),
  reported_by: z.string().optional(),
  report_method: z.enum(['whatsapp', 'app', 'manual']).optional(),
  notes: z.string().optional(),
  gps_location: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

// GET /api/activities - List activities
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);

    const plotId = searchParams.get('plot_id');
    const date = searchParams.get('date');
    const activityType = searchParams.get('activity_type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('activities')
      .select(
        `
        *,
        plots (
          id,
          plot_code,
          plot_name
        )
      `
      )
      .order('activity_date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (plotId) {
      query = query.eq('plot_id', plotId);
    }

    if (date) {
      query = query.eq('activity_date', date);
    }

    if (activityType) {
      query = query.eq('activity_type', activityType);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching activities:', error);
      return NextResponse.json(
        { error: 'Failed to fetch activities' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      pagination: {
        limit,
        offset,
        total: count,
      },
    });
  } catch (error) {
    console.error('Activities GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/activities - Create a new activity
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();

    // Validate input
    const validationResult = createActivitySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const activityData = validationResult.data;

    // Prepare the data for insertion
    const insertData: Record<string, unknown> = {
      plot_id: activityData.plot_id,
      activity_type: activityData.activity_type,
      activity_date: activityData.activity_date,
      cladodes_planted: activityData.cladodes_planted,
      workers_count: activityData.workers_count,
      hours_worked: activityData.hours_worked,
      area_covered_ha: activityData.area_covered_ha,
      row_spacing_cm: activityData.row_spacing_cm,
      plant_spacing_cm: activityData.plant_spacing_cm,
      reported_by: activityData.reported_by,
      report_method: activityData.report_method || 'manual',
      notes: activityData.notes,
    };

    // Handle GPS location if provided
    if (activityData.gps_location) {
      insertData.gps_location = `POINT(${activityData.gps_location.lng} ${activityData.gps_location.lat})`;
    }

    const { data, error } = await supabase
      .from('activities')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating activity:', error);
      return NextResponse.json(
        { error: 'Failed to create activity' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Activity created successfully',
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Activities POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
