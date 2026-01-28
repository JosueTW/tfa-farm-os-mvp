/**
 * Seed script for development data
 * Run with: npm run db:seed
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('🌱 Seeding development data...\n');

  try {
    // 1. Create sample plots
    console.log('Creating plots...');
    const plotsData = [
      {
        plot_code: '1A',
        plot_name: 'Main Field North',
        area_ha: 0.5,
        planned_density: 12000,
        status: 'completed',
        start_date: '2026-01-15',
        target_completion_date: '2026-01-22',
        actual_completion_date: '2026-01-21',
      },
      {
        plot_code: '2A',
        plot_name: 'Main Field South',
        area_ha: 0.5,
        planned_density: 12000,
        status: 'in_progress',
        start_date: '2026-01-20',
        target_completion_date: '2026-01-28',
      },
      {
        plot_code: '3B',
        plot_name: 'East Section',
        area_ha: 0.75,
        planned_density: 12000,
        status: 'in_progress',
        start_date: '2026-01-22',
        target_completion_date: '2026-02-02',
      },
      {
        plot_code: '4A',
        plot_name: 'West Section',
        area_ha: 0.6,
        planned_density: 12000,
        status: 'pending',
        target_completion_date: '2026-02-10',
      },
      {
        plot_code: '5A',
        plot_name: 'Extension North',
        area_ha: 0.8,
        planned_density: 12000,
        status: 'pending',
        target_completion_date: '2026-02-20',
      },
    ];

    const { data: plots, error: plotsError } = await supabase
      .from('plots')
      .upsert(plotsData, { onConflict: 'plot_code' })
      .select();

    if (plotsError) {
      console.error('Error creating plots:', plotsError);
    } else {
      console.log(`  ✅ Created ${plots?.length} plots`);
    }

    // 2. Create sample activities
    console.log('Creating activities...');
    const plot1 = plots?.find((p) => p.plot_code === '1A');
    const plot2 = plots?.find((p) => p.plot_code === '2A');
    const plot3 = plots?.find((p) => p.plot_code === '3B');

    const activitiesData = [
      {
        plot_id: plot2?.id,
        activity_type: 'planting',
        activity_date: '2026-01-26',
        cladodes_planted: 400,
        workers_count: 6,
        hours_worked: 8,
        row_spacing_cm: 250,
        plant_spacing_cm: 83,
        reported_by: 'Ansi',
        report_method: 'whatsapp',
        notes: 'Planted 400 cladodes. Rows look good but spacing a bit tight.',
      },
      {
        plot_id: plot2?.id,
        activity_type: 'planting',
        activity_date: '2026-01-25',
        cladodes_planted: 850,
        workers_count: 6,
        hours_worked: 8,
        row_spacing_cm: 250,
        plant_spacing_cm: 83,
        reported_by: 'Ansi',
        report_method: 'app',
        notes: 'Good progress today.',
      },
      {
        plot_id: plot3?.id,
        activity_type: 'inspection',
        activity_date: '2026-01-24',
        workers_count: 1,
        hours_worked: 2,
        reported_by: 'Terence',
        report_method: 'app',
        notes: 'Quality check - spacing variance detected at 248cm avg.',
      },
      {
        plot_id: plot2?.id,
        activity_type: 'planting',
        activity_date: '2026-01-23',
        cladodes_planted: 950,
        workers_count: 7,
        hours_worked: 9,
        row_spacing_cm: 250,
        plant_spacing_cm: 83,
        reported_by: 'Ansi',
        report_method: 'whatsapp',
      },
      {
        plot_id: plot3?.id,
        activity_type: 'site_clearing',
        activity_date: '2026-01-22',
        workers_count: 8,
        hours_worked: 6,
        area_covered_ha: 0.3,
        reported_by: 'Team Lead',
        report_method: 'manual',
        notes: 'Cleared vegetation and prepared soil.',
      },
      {
        plot_id: plot1?.id,
        activity_type: 'planting',
        activity_date: '2026-01-21',
        cladodes_planted: 1200,
        workers_count: 8,
        hours_worked: 10,
        row_spacing_cm: 250,
        plant_spacing_cm: 83,
        reported_by: 'Ansi',
        report_method: 'whatsapp',
        notes: 'Final planting for Plot 1A. Completed!',
      },
    ];

    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .insert(activitiesData)
      .select();

    if (activitiesError) {
      console.error('Error creating activities:', activitiesError);
    } else {
      console.log(`  ✅ Created ${activities?.length} activities`);
    }

    // 3. Create sample field observations
    console.log('Creating field observations...');
    const observationsData = [
      {
        plot_id: plot3?.id,
        observation_date: '2026-01-24',
        observation_type: 'spacing_error',
        severity: 'medium',
        description: 'Row spacing at 248cm average, 2cm below target of 250cm.',
        action_required: 'Supervisor inspection required. Adjust spacing for remaining rows.',
        status: 'open',
      },
      {
        plot_id: plot2?.id,
        observation_date: '2026-01-25',
        observation_type: 'weed',
        severity: 'low',
        description: 'Light weed pressure observed in south section.',
        action_required: 'Schedule weeding for next week.',
        status: 'open',
      },
      {
        plot_id: plot1?.id,
        observation_date: '2026-01-20',
        observation_type: 'quality_issue',
        severity: 'low',
        description: 'Some cladodes showing minor sun damage.',
        action_required: 'Monitor and report in 3 days.',
        status: 'resolved',
        resolved_at: '2026-01-23T10:00:00Z',
      },
    ];

    const { data: observations, error: observationsError } = await supabase
      .from('field_observations')
      .insert(observationsData)
      .select();

    if (observationsError) {
      console.error('Error creating observations:', observationsError);
    } else {
      console.log(`  ✅ Created ${observations?.length} field observations`);
    }

    // 4. Create sample plant health records
    console.log('Creating plant health records...');
    const healthData = [
      {
        plot_id: plot1?.id,
        assessment_date: '2026-01-26',
        plants_alive: 5664,
        plants_dead: 236,
        survival_rate: 96,
        avg_height_cm: 15.5,
        health_score: 0.92,
        weed_pressure: 'low',
        assessed_by: 'Agronomist',
      },
      {
        plot_id: plot2?.id,
        assessment_date: '2026-01-26',
        plants_alive: 4512,
        plants_dead: 288,
        survival_rate: 94,
        avg_height_cm: 12.3,
        health_score: 0.88,
        weed_pressure: 'low',
        assessed_by: 'Agronomist',
      },
      {
        plot_id: plot3?.id,
        assessment_date: '2026-01-26',
        plants_alive: 3220,
        plants_dead: 280,
        survival_rate: 92,
        avg_height_cm: 8.5,
        health_score: 0.85,
        weed_pressure: 'moderate',
        assessed_by: 'Agronomist',
      },
    ];

    const { data: health, error: healthError } = await supabase
      .from('plant_health')
      .insert(healthData)
      .select();

    if (healthError) {
      console.error('Error creating health records:', healthError);
    } else {
      console.log(`  ✅ Created ${health?.length} plant health records`);
    }

    // 5. Create sample alerts
    console.log('Creating alerts...');
    const alertsData = [
      {
        alert_type: 'schedule_delay',
        severity: 'high',
        title: 'Planting Behind Schedule',
        description: 'Current rate 29% below target for 3 consecutive days',
        status: 'active',
      },
      {
        alert_type: 'quality_issue',
        severity: 'medium',
        title: 'Row Spacing Variance in Plot 3B',
        description: 'Detected 248cm avg (target: 250cm)',
        related_plot_id: plot3?.id,
        status: 'active',
      },
      {
        alert_type: 'weather_warning',
        severity: 'low',
        title: 'Rain Forecast',
        description: '15mm rainfall expected in next 48 hours',
        status: 'acknowledged',
        acknowledged_at: '2026-01-25T10:00:00Z',
      },
    ];

    const { data: alerts, error: alertsError } = await supabase
      .from('alerts')
      .insert(alertsData)
      .select();

    if (alertsError) {
      console.error('Error creating alerts:', alertsError);
    } else {
      console.log(`  ✅ Created ${alerts?.length} alerts`);
    }

    // 6. Create sample weather data
    console.log('Creating weather data...');
    const weatherData = [
      {
        latitude: -24.7333,
        longitude: 29.9167,
        temperature_c: 28,
        humidity_percent: 45,
        rainfall_mm: 0,
        wind_speed_kmh: 12,
        conditions: 'clear',
        source: 'openweathermap',
        is_forecast: false,
      },
    ];

    const { data: weather, error: weatherError } = await supabase
      .from('weather_data')
      .insert(weatherData)
      .select();

    if (weatherError) {
      console.error('Error creating weather data:', weatherError);
    } else {
      console.log(`  ✅ Created ${weather?.length} weather records`);
    }

    console.log('\n🎉 Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
