// Supabase Edge Function: Process WhatsApp Messages
// This function can be triggered by database webhooks or called directly

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProcessMessageRequest {
  messageId: string;
  body: string;
  from: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { messageId, body, from }: ProcessMessageRequest = await req.json();

    if (!messageId || !body) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Claude API for extraction
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Extract structured data from this farm field message:

MESSAGE: "${body}"
FROM: ${from}

Extract: activity_type, plot_id, cladodes_planted, workers, issues, date
Return JSON only.`,
          },
        ],
      }),
    });

    const claudeData = await claudeResponse.json();
    const extractedText = claudeData.content?.[0]?.text || '';

    // Parse the extracted JSON
    let extractedData = null;
    try {
      const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse Claude response:', e);
    }

    // Update the message with extracted data
    const { error: updateError } = await supabaseClient
      .from('whatsapp_messages')
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
        extracted_data: extractedData,
      })
      .eq('message_id', messageId);

    if (updateError) {
      throw updateError;
    }

    // If we extracted activity data, create an activity record
    if (extractedData?.activity_type && extractedData?.plot_id) {
      // Find the plot
      const { data: plot } = await supabaseClient
        .from('plots')
        .select('id')
        .eq('plot_code', extractedData.plot_id)
        .single();

      if (plot) {
        const { data: activity, error: activityError } = await supabaseClient
          .from('activities')
          .insert({
            plot_id: plot.id,
            activity_type: extractedData.activity_type,
            activity_date: extractedData.date || new Date().toISOString().split('T')[0],
            cladodes_planted: extractedData.cladodes_planted,
            workers_count: extractedData.workers,
            reported_by: from,
            report_method: 'whatsapp',
            notes: body,
            ai_extracted: true,
            ai_confidence: extractedData.confidence || 0.5,
            source_message_id: messageId,
          })
          .select()
          .single();

        if (activityError) {
          console.error('Failed to create activity:', activityError);
        } else {
          // Link activity to message
          await supabaseClient
            .from('whatsapp_messages')
            .update({ linked_activity_id: activity?.id })
            .eq('message_id', messageId);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        extracted_data: extractedData,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing message:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
