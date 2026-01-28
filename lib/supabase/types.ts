/**
 * Database types for Supabase
 * These types are generated from the database schema
 * Run `npm run types:generate` to update
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      plots: {
        Row: {
          id: string;
          plot_code: string;
          plot_name: string | null;
          geometry: unknown | null;
          area_ha: number | null;
          planned_density: number | null;
          status: string | null;
          start_date: string | null;
          target_completion_date: string | null;
          actual_completion_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          plot_code: string;
          plot_name?: string | null;
          geometry?: unknown | null;
          area_ha?: number | null;
          planned_density?: number | null;
          status?: string | null;
          start_date?: string | null;
          target_completion_date?: string | null;
          actual_completion_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          plot_code?: string;
          plot_name?: string | null;
          geometry?: unknown | null;
          area_ha?: number | null;
          planned_density?: number | null;
          status?: string | null;
          start_date?: string | null;
          target_completion_date?: string | null;
          actual_completion_date?: string | null;
          created_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          plot_id: string | null;
          activity_type: string | null;
          activity_date: string;
          created_at: string;
          cladodes_planted: number | null;
          workers_count: number | null;
          hours_worked: number | null;
          area_covered_ha: number | null;
          row_spacing_cm: number | null;
          plant_spacing_cm: number | null;
          actual_density: number | null;
          reported_by: string | null;
          report_method: string | null;
          gps_location: unknown | null;
          notes: string | null;
          ai_extracted: boolean | null;
          ai_confidence: number | null;
          source_message_id: string | null;
        };
        Insert: {
          id?: string;
          plot_id?: string | null;
          activity_type?: string | null;
          activity_date: string;
          created_at?: string;
          cladodes_planted?: number | null;
          workers_count?: number | null;
          hours_worked?: number | null;
          area_covered_ha?: number | null;
          row_spacing_cm?: number | null;
          plant_spacing_cm?: number | null;
          actual_density?: number | null;
          reported_by?: string | null;
          report_method?: string | null;
          gps_location?: unknown | null;
          notes?: string | null;
          ai_extracted?: boolean | null;
          ai_confidence?: number | null;
          source_message_id?: string | null;
        };
        Update: {
          id?: string;
          plot_id?: string | null;
          activity_type?: string | null;
          activity_date?: string;
          created_at?: string;
          cladodes_planted?: number | null;
          workers_count?: number | null;
          hours_worked?: number | null;
          area_covered_ha?: number | null;
          row_spacing_cm?: number | null;
          plant_spacing_cm?: number | null;
          actual_density?: number | null;
          reported_by?: string | null;
          report_method?: string | null;
          gps_location?: unknown | null;
          notes?: string | null;
          ai_extracted?: boolean | null;
          ai_confidence?: number | null;
          source_message_id?: string | null;
        };
      };
      field_observations: {
        Row: {
          id: string;
          activity_id: string | null;
          plot_id: string | null;
          observation_date: string;
          created_at: string;
          observation_type: string | null;
          severity: string | null;
          description: string | null;
          action_required: string | null;
          status: string | null;
          resolved_at: string | null;
          photos: Json | null;
          voice_notes: Json | null;
          ai_detected: boolean | null;
          ai_analysis: Json | null;
        };
        Insert: {
          id?: string;
          activity_id?: string | null;
          plot_id?: string | null;
          observation_date: string;
          created_at?: string;
          observation_type?: string | null;
          severity?: string | null;
          description?: string | null;
          action_required?: string | null;
          status?: string | null;
          resolved_at?: string | null;
          photos?: Json | null;
          voice_notes?: Json | null;
          ai_detected?: boolean | null;
          ai_analysis?: Json | null;
        };
        Update: {
          id?: string;
          activity_id?: string | null;
          plot_id?: string | null;
          observation_date?: string;
          created_at?: string;
          observation_type?: string | null;
          severity?: string | null;
          description?: string | null;
          action_required?: string | null;
          status?: string | null;
          resolved_at?: string | null;
          photos?: Json | null;
          voice_notes?: Json | null;
          ai_detected?: boolean | null;
          ai_analysis?: Json | null;
        };
      };
      plant_health: {
        Row: {
          id: string;
          plot_id: string | null;
          assessment_date: string;
          created_at: string;
          plants_alive: number | null;
          plants_dead: number | null;
          survival_rate: number | null;
          avg_height_cm: number | null;
          health_score: number | null;
          pest_detected: boolean | null;
          disease_detected: boolean | null;
          weed_pressure: string | null;
          assessed_by: string | null;
          photos: Json | null;
        };
        Insert: {
          id?: string;
          plot_id?: string | null;
          assessment_date: string;
          created_at?: string;
          plants_alive?: number | null;
          plants_dead?: number | null;
          survival_rate?: number | null;
          avg_height_cm?: number | null;
          health_score?: number | null;
          pest_detected?: boolean | null;
          disease_detected?: boolean | null;
          weed_pressure?: string | null;
          assessed_by?: string | null;
          photos?: Json | null;
        };
        Update: {
          id?: string;
          plot_id?: string | null;
          assessment_date?: string;
          created_at?: string;
          plants_alive?: number | null;
          plants_dead?: number | null;
          survival_rate?: number | null;
          avg_height_cm?: number | null;
          health_score?: number | null;
          pest_detected?: boolean | null;
          disease_detected?: boolean | null;
          weed_pressure?: string | null;
          assessed_by?: string | null;
          photos?: Json | null;
        };
      };
      alerts: {
        Row: {
          id: string;
          created_at: string;
          alert_type: string | null;
          severity: string | null;
          title: string | null;
          description: string | null;
          related_plot_id: string | null;
          related_activity_id: string | null;
          status: string | null;
          acknowledged_by: string | null;
          acknowledged_at: string | null;
          resolved_at: string | null;
          notification_sent: boolean | null;
          notification_channels: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          alert_type?: string | null;
          severity?: string | null;
          title?: string | null;
          description?: string | null;
          related_plot_id?: string | null;
          related_activity_id?: string | null;
          status?: string | null;
          acknowledged_by?: string | null;
          acknowledged_at?: string | null;
          resolved_at?: string | null;
          notification_sent?: boolean | null;
          notification_channels?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          alert_type?: string | null;
          severity?: string | null;
          title?: string | null;
          description?: string | null;
          related_plot_id?: string | null;
          related_activity_id?: string | null;
          status?: string | null;
          acknowledged_by?: string | null;
          acknowledged_at?: string | null;
          resolved_at?: string | null;
          notification_sent?: boolean | null;
          notification_channels?: Json | null;
        };
      };
      whatsapp_messages: {
        Row: {
          id: string;
          received_at: string;
          from_number: string | null;
          message_id: string | null;
          message_type: string | null;
          body: string | null;
          media_url: string | null;
          media_content_type: string | null;
          processed: boolean | null;
          processed_at: string | null;
          extracted_data: Json | null;
          linked_activity_id: string | null;
          media_stored_path: string | null;
        };
        Insert: {
          id?: string;
          received_at?: string;
          from_number?: string | null;
          message_id?: string | null;
          message_type?: string | null;
          body?: string | null;
          media_url?: string | null;
          media_content_type?: string | null;
          processed?: boolean | null;
          processed_at?: string | null;
          extracted_data?: Json | null;
          linked_activity_id?: string | null;
          media_stored_path?: string | null;
        };
        Update: {
          id?: string;
          received_at?: string;
          from_number?: string | null;
          message_id?: string | null;
          message_type?: string | null;
          body?: string | null;
          media_url?: string | null;
          media_content_type?: string | null;
          processed?: boolean | null;
          processed_at?: string | null;
          extracted_data?: Json | null;
          linked_activity_id?: string | null;
          media_stored_path?: string | null;
        };
      };
      weather_data: {
        Row: {
          id: string;
          recorded_at: string;
          latitude: number | null;
          longitude: number | null;
          temperature_c: number | null;
          humidity_percent: number | null;
          rainfall_mm: number | null;
          wind_speed_kmh: number | null;
          conditions: string | null;
          source: string | null;
          is_forecast: boolean | null;
          forecast_date: string | null;
        };
        Insert: {
          id?: string;
          recorded_at?: string;
          latitude?: number | null;
          longitude?: number | null;
          temperature_c?: number | null;
          humidity_percent?: number | null;
          rainfall_mm?: number | null;
          wind_speed_kmh?: number | null;
          conditions?: string | null;
          source?: string | null;
          is_forecast?: boolean | null;
          forecast_date?: string | null;
        };
        Update: {
          id?: string;
          recorded_at?: string;
          latitude?: number | null;
          longitude?: number | null;
          temperature_c?: number | null;
          humidity_percent?: number | null;
          rainfall_mm?: number | null;
          wind_speed_kmh?: number | null;
          conditions?: string | null;
          source?: string | null;
          is_forecast?: boolean | null;
          forecast_date?: string | null;
        };
      };
      labor_logs: {
        Row: {
          id: string;
          work_date: string;
          created_at: string;
          worker_name: string | null;
          worker_phone: string | null;
          role: string | null;
          activity_id: string | null;
          hours_worked: number | null;
          tasks_completed: Json | null;
          output_quantity: number | null;
          check_in_time: string | null;
          check_out_time: string | null;
          present: boolean | null;
        };
        Insert: {
          id?: string;
          work_date: string;
          created_at?: string;
          worker_name?: string | null;
          worker_phone?: string | null;
          role?: string | null;
          activity_id?: string | null;
          hours_worked?: number | null;
          tasks_completed?: Json | null;
          output_quantity?: number | null;
          check_in_time?: string | null;
          check_out_time?: string | null;
          present?: boolean | null;
        };
        Update: {
          id?: string;
          work_date?: string;
          created_at?: string;
          worker_name?: string | null;
          worker_phone?: string | null;
          role?: string | null;
          activity_id?: string | null;
          hours_worked?: number | null;
          tasks_completed?: Json | null;
          output_quantity?: number | null;
          check_in_time?: string | null;
          check_out_time?: string | null;
          present?: boolean | null;
        };
      };
      resource_inventory: {
        Row: {
          id: string;
          resource_type: string | null;
          quantity: number | null;
          unit: string | null;
          location: string | null;
          transaction_type: string | null;
          transaction_date: string;
          related_activity_id: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          resource_type?: string | null;
          quantity?: number | null;
          unit?: string | null;
          location?: string | null;
          transaction_type?: string | null;
          transaction_date: string;
          related_activity_id?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          resource_type?: string | null;
          quantity?: number | null;
          unit?: string | null;
          location?: string | null;
          transaction_type?: string | null;
          transaction_date?: string;
          related_activity_id?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

// Convenience types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type Insertable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type Updatable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
