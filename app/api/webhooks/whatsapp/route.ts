import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { processMessage } from '@/lib/ai/claude';
import twilio from 'twilio';

// POST /api/webhooks/whatsapp - Handle incoming WhatsApp messages
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract Twilio webhook data
    const messageId = formData.get('MessageSid') as string;
    const from = formData.get('From') as string;
    const body = formData.get('Body') as string;
    const numMedia = parseInt((formData.get('NumMedia') as string) || '0');
    const mediaUrl = formData.get('MediaUrl0') as string | null;
    const mediaContentType = formData.get('MediaContentType0') as string | null;

    console.log('Received WhatsApp message:', {
      messageId,
      from,
      body: body?.substring(0, 100),
      numMedia,
    });

    const supabase = createClient();

    // Store the raw message
    const { data: storedMessage, error: storeError } = await supabase
      .from('whatsapp_messages')
      .insert({
        message_id: messageId,
        from_number: from,
        body: body,
        message_type: numMedia > 0 ? 'image' : 'text',
        media_url: mediaUrl,
        media_content_type: mediaContentType,
        processed: false,
      })
      .select()
      .single();

    if (storeError) {
      console.error('Error storing WhatsApp message:', storeError);
    }

    // Process the message with Claude AI
    let extractedData: any = null;
    let aiConfidence = 0;

    if (body && body.trim().length > 0) {
      try {
        const aiResult = await processMessage(body, from);
        extractedData = aiResult.extractedData;
        aiConfidence = aiResult.confidence;

        // Update the stored message with AI extraction
        if (storedMessage) {
          await supabase
            .from('whatsapp_messages')
            .update({
              processed: true,
              processed_at: new Date().toISOString(),
              extracted_data: extractedData,
            })
            .eq('id', storedMessage.id);
        }

        // If we extracted activity data, create an activity record
        if (extractedData && extractedData.activity_type) {
          // Find the plot by code
          let plotId = null;
          if (extractedData.plot_id) {
            const { data: plot } = await supabase
              .from('plots')
              .select('id')
              .eq('plot_code', extractedData.plot_id)
              .single();
            plotId = plot?.id;
          }

          if (plotId) {
            const { data: activity, error: activityError } = await supabase
              .from('activities')
              .insert({
                plot_id: plotId,
                activity_type: extractedData.activity_type,
                activity_date:
                  extractedData.date || new Date().toISOString().split('T')[0],
                cladodes_planted: extractedData.cladodes_planted,
                workers_count: extractedData.workers,
                reported_by: from,
                report_method: 'whatsapp',
                notes: extractedData.notes || body,
                ai_extracted: true,
                ai_confidence: aiConfidence,
                source_message_id: messageId,
              })
              .select()
              .single();

            if (activityError) {
              console.error('Error creating activity:', activityError);
            } else {
              // Link the activity to the message
              if (storedMessage) {
                await supabase
                  .from('whatsapp_messages')
                  .update({ linked_activity_id: activity?.id })
                  .eq('id', storedMessage.id);
              }
            }

            // If issues were detected, create field observations
            if (extractedData.issues && extractedData.issues.length > 0) {
              for (const issue of extractedData.issues) {
                await supabase.from('field_observations').insert({
                  activity_id: activity?.id,
                  plot_id: plotId,
                  observation_date: new Date().toISOString().split('T')[0],
                  observation_type: issue.type,
                  severity: issue.severity,
                  description: issue.description,
                  action_required: issue.action_required,
                  ai_detected: true,
                  ai_analysis: issue,
                });
              }

              // Create alerts for high-severity issues
              const highSeverityIssues = extractedData.issues.filter(
                (i: { severity: string }) =>
                  i.severity === 'high' || i.severity === 'critical'
              );

              for (const issue of highSeverityIssues) {
                await supabase.from('alerts').insert({
                  alert_type: issue.type,
                  severity: issue.severity,
                  title: `${issue.type.replace('_', ' ')} Detected`,
                  description: issue.description,
                  related_plot_id: plotId,
                  related_activity_id: activity?.id,
                });
              }
            }
          }
        }
      } catch (aiError) {
        console.error('AI processing error:', aiError);
      }
    }

    // Send acknowledgment back via WhatsApp
    const responseMessage = extractedData
      ? `✅ Received! Logged ${
          extractedData.cladodes_planted || 'activity'
        } in Plot ${extractedData.plot_id || 'unknown'}. AI confidence: ${Math.round(
          aiConfidence * 100
        )}%`
      : '✅ Message received. Please include activity details like: "Planted 400 cladodes in Plot 2A with 6 workers"';

    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioWhatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    if (twilioAccountSid && twilioAuthToken && twilioWhatsappNumber) {
      try {
        const twilioClient = twilio(twilioAccountSid, twilioAuthToken);
        await twilioClient.messages.create({
          from: twilioWhatsappNumber,
          to: from,
          body: responseMessage,
        });
      } catch (twilioError) {
        console.error('Error sending WhatsApp response:', twilioError);
      }
    } else {
      console.warn(
        'Twilio env vars missing. Skipping WhatsApp response send.'
      );
    }

    // Return TwiML response
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      }
    );
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      }
    );
  }
}

// GET /api/webhooks/whatsapp - Twilio webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json({ status: 'WhatsApp webhook active' });
}
