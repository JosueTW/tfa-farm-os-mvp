import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// GET /api/dashboard/metrics - Get detailed KPI calculations
export async function GET(request: NextRequest) {
  try {
    let supabase;
    try {
      supabase = createAdminClient();
    } catch (error) {
      console.warn('Admin client unavailable, using anon client');
      supabase = createClient();
    }
    const { searchParams } = new URL(request.url);

    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const plotId = searchParams.get('plot_id');

    // Default to last 30 days if no date range specified
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Build activity query
    let activityQuery = supabase
      .from('activities')
      .select('*')
      .gte('activity_date', start.toISOString().split('T')[0])
      .lte('activity_date', end.toISOString().split('T')[0]);

    if (plotId) {
      activityQuery = activityQuery.eq('plot_id', plotId);
    }

    const { data: activities, error: activitiesError } = await activityQuery;

    if (activitiesError) {
      console.error('Error fetching activities:', activitiesError);
      return NextResponse.json(
        { error: 'Failed to fetch activities' },
        { status: 500 }
      );
    }

    // Calculate daily metrics
    const dailyMetrics: Record<
      string,
      {
        date: string;
        cladodes_planted: number;
        workers: number;
        hours: number;
        activities_count: number;
      }
    > = {};

    activities?.forEach((activity: any) => {
      const date = activity.activity_date;
      if (!dailyMetrics[date]) {
        dailyMetrics[date] = {
          date,
          cladodes_planted: 0,
          workers: 0,
          hours: 0,
          activities_count: 0,
        };
      }

      if (activity.activity_type === 'planting') {
        dailyMetrics[date].cladodes_planted += activity.cladodes_planted || 0;
        dailyMetrics[date].workers += activity.workers_count || 0;
        dailyMetrics[date].hours += activity.hours_worked || 0;
      }
      dailyMetrics[date].activities_count += 1;
    });

    // Convert to array and sort by date
    const dailyData = Object.values(dailyMetrics).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    // Calculate totals
    const totals = dailyData.reduce(
      (acc, day) => {
        acc.total_planted += day.cladodes_planted;
        acc.total_worker_hours += day.workers * (day.hours || 8);
        acc.total_activities += day.activities_count;
        return acc;
      },
      { total_planted: 0, total_worker_hours: 0, total_activities: 0 }
    );

    // Calculate averages
    const daysWithData = dailyData.filter((d) => d.cladodes_planted > 0).length;
    const avgDailyPlanting =
      daysWithData > 0 ? Math.round(totals.total_planted / daysWithData) : 0;

    // Calculate productivity
    const totalWorkerDays = dailyData.reduce((sum, d) => sum + d.workers, 0);
    const avgProductivity =
      totalWorkerDays > 0
        ? Math.round(totals.total_planted / totalWorkerDays)
        : 0;

    // Get cost data (simplified - in production, join with labor_logs)
    const costPerWorkerHour = 30; // R30/hour estimate
    const estimatedLaborCost = totals.total_worker_hours * costPerWorkerHour;

    // Calculate trends (compare first half to second half of period)
    const midpoint = Math.floor(dailyData.length / 2);
    const firstHalf = dailyData.slice(0, midpoint);
    const secondHalf = dailyData.slice(midpoint);

    const firstHalfAvg =
      firstHalf.length > 0
        ? firstHalf.reduce((sum, d) => sum + d.cladodes_planted, 0) /
        firstHalf.length
        : 0;
    const secondHalfAvg =
      secondHalf.length > 0
        ? secondHalf.reduce((sum, d) => sum + d.cladodes_planted, 0) /
        secondHalf.length
        : 0;

    const trendPercent =
      firstHalfAvg > 0
        ? Math.round(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100)
        : 0;

    return NextResponse.json({
      period: {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
        days: dailyData.length,
      },
      totals: {
        ...totals,
        estimated_labor_cost: estimatedLaborCost,
      },
      averages: {
        daily_planting: avgDailyPlanting,
        productivity_per_worker: avgProductivity,
        hours_per_day:
          daysWithData > 0
            ? Math.round(totals.total_worker_hours / daysWithData)
            : 0,
      },
      trends: {
        planting_rate_change_percent: trendPercent,
        direction: trendPercent >= 0 ? 'up' : 'down',
      },
      daily_breakdown: dailyData,
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
