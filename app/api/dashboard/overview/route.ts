import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  // Use admin client to bypass RLS for dashboard data
  const supabase = createAdminClient();

  try {
    // Fetch recent activities (all types, ordered by date)
    const { data: recentActivities, error: activitiesError } = await supabase
      .from('activities')
      .select('*')
      .order('activity_date', { ascending: false })
      .limit(10);

    if (activitiesError) {
      console.warn('Warning: Could not fetch activities:', activitiesError.message);
    }

    // Fetch ALL activities for metrics calculation
    const { data: allActivities, error: allActivitiesError } = await supabase
      .from('activities')
      .select('activity_date, cladodes_planted, stations_planted, avg_cladodes_per_station, workers_count');

    if (allActivitiesError) {
      console.warn('Warning: Could not fetch all activities:', allActivitiesError.message);
    }

    // Fetch weather events (optional table)
    let weatherEvents: any[] = [];
    try {
      const { data, error } = await supabase
        .from('weather_events')
        .select('*')
        .order('event_date', { ascending: false })
        .limit(5);

      if (!error && data) {
        weatherEvents = data;
      }
    } catch (e) {
      console.warn('Note: Could not query weather_events table');
    }

    // Fetch featured field media (optional table)
    let fieldMedia: any[] = [];
    try {
      const { data, error } = await supabase
        .from('field_media')
        .select('*')
        .eq('featured', true)
        .order('media_date', { ascending: false })
        .limit(6);

      if (!error && data) {
        fieldMedia = data;
      }
    } catch (e) {
      console.warn('Note: Could not query field_media table');
    }

    // Calculate metrics from activities
    const activities = allActivities || [];

    // Filter out records with no planting data
    const plantingActivities = activities.filter(a =>
      (a.cladodes_planted && a.cladodes_planted > 0) ||
      (a.stations_planted && a.stations_planted > 0)
    );

    const totalCladodes = plantingActivities.reduce((sum, a) => sum + (a.cladodes_planted || 0), 0);
    const totalStations = plantingActivities.reduce((sum, a) => sum + (a.stations_planted || 0), 0);

    // Calculate average stack height from avg_cladodes_per_station or from totals
    let avgStackHeight = 0;
    const activitiesWithAvg = plantingActivities.filter(a => a.avg_cladodes_per_station && a.avg_cladodes_per_station > 0);
    if (activitiesWithAvg.length > 0) {
      avgStackHeight = activitiesWithAvg.reduce((sum, a) => sum + (a.avg_cladodes_per_station || 0), 0) / activitiesWithAvg.length;
    } else if (totalStations > 0) {
      avgStackHeight = totalCladodes / totalStations;
    }

    // Calculate planting rate (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    const recentPlantingActivities = plantingActivities.filter(a =>
      a.activity_date && a.activity_date >= sevenDaysAgoStr
    );

    const avgDailyRate = recentPlantingActivities.length > 0
      ? Math.round(recentPlantingActivities.reduce((sum, a) => sum + (a.cladodes_planted || 0), 0) / recentPlantingActivities.length)
      : (plantingActivities.length > 0
        ? Math.round(totalCladodes / plantingActivities.length)
        : 0);

    // Area planted estimate
    // Using hybrid density: 494 stations/ha for primary grid, but with in-fill it's higher
    // Estimate ~600 effective stations per ha with in-fill
    const stationsPerHa = 600;
    let areaPlanted = 0;
    if (totalStations > 0) {
      areaPlanted = parseFloat((totalStations / stationsPerHa).toFixed(2));
    } else if (totalCladodes > 0 && avgStackHeight > 0) {
      const estimatedStations = totalCladodes / avgStackHeight;
      areaPlanted = parseFloat((estimatedStations / stationsPerHa).toFixed(2));
    }

    // Calculate total planting days
    const plantingDays = plantingActivities.length;

    // Weather impact days
    const weatherImpactDays = weatherEvents?.filter((w: any) =>
      w.productivity_impact_percent !== undefined && w.productivity_impact_percent < 0
    ).length || 0;

    console.log('Dashboard metrics calculated:', {
      totalCladodes,
      totalStations,
      avgStackHeight: parseFloat(avgStackHeight.toFixed(2)),
      avgDailyRate,
      areaPlanted,
      plantingDays,
      activitiesCount: activities.length,
      plantingActivitiesCount: plantingActivities.length
    });

    return NextResponse.json({
      success: true,
      data: {
        recentActivities: recentActivities || [],
        weatherEvents: weatherEvents,
        fieldMedia: fieldMedia,
        metrics: {
          totalCladodes,
          totalStations,
          avgStackHeight: parseFloat(avgStackHeight.toFixed(2)),
          avgDailyRate,
          areaPlanted,
          plantingDays,
          weatherImpactDays
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard data',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
