/**
 * Twilio WhatsApp API helpers
 */

import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

interface SendMessageOptions {
  to: string;
  body: string;
  mediaUrl?: string;
}

/**
 * Send a WhatsApp message
 */
export async function sendWhatsAppMessage({
  to,
  body,
  mediaUrl,
}: SendMessageOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!WHATSAPP_NUMBER) {
    console.warn('Twilio WhatsApp number not configured');
    return { success: false, error: 'WhatsApp not configured' };
  }

  try {
    // Ensure the number is in WhatsApp format
    const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

    const messageOptions: {
      from: string;
      to: string;
      body: string;
      mediaUrl?: string[];
    } = {
      from: WHATSAPP_NUMBER,
      to: formattedTo,
      body,
    };

    if (mediaUrl) {
      messageOptions.mediaUrl = [mediaUrl];
    }

    const message = await client.messages.create(messageOptions);

    return {
      success: true,
      messageId: message.sid,
    };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send an acknowledgment message for a received report
 */
export async function sendAcknowledgment(
  to: string,
  activityType: string,
  plotCode?: string,
  quantity?: number
): Promise<void> {
  let message = `✅ Received your ${activityType} report`;

  if (plotCode) {
    message += ` for Plot ${plotCode}`;
  }

  if (quantity) {
    message += ` - ${quantity} cladodes logged`;
  }

  message += '. Thank you!';

  await sendWhatsAppMessage({ to, body: message });
}

/**
 * Send an alert notification
 */
export async function sendAlertNotification(
  to: string,
  alertTitle: string,
  alertDescription: string,
  severity: string
): Promise<void> {
  const severityEmoji =
    severity === 'critical' || severity === 'high' ? '🚨' : '⚠️';

  const message = `${severityEmoji} ALERT: ${alertTitle}

${alertDescription}

Please check the dashboard for details.`;

  await sendWhatsAppMessage({ to, body: message });
}

/**
 * Send a daily summary to supervisors
 */
export async function sendDailySummary(
  to: string,
  summary: {
    date: string;
    totalPlanted: number;
    workersActive: number;
    plotsWorked: string[];
    issuesReported: number;
  }
): Promise<void> {
  const message = `📊 Daily Summary - ${summary.date}

🌱 Cladodes Planted: ${summary.totalPlanted.toLocaleString()}
👷 Workers Active: ${summary.workersActive}
📍 Plots: ${summary.plotsWorked.join(', ') || 'None'}
⚠️ Issues: ${summary.issuesReported}

View full report in the dashboard.`;

  await sendWhatsAppMessage({ to, body: message });
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  // Remove 'whatsapp:' prefix if present
  let cleaned = phone.replace('whatsapp:', '');

  // Format South African numbers
  if (cleaned.startsWith('+27')) {
    return `0${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }

  return cleaned;
}

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  // E.164 format: +[country code][number]
  const e164Pattern = /^\+[1-9]\d{6,14}$/;

  // Remove whatsapp: prefix for validation
  const cleaned = phone.replace('whatsapp:', '');

  return e164Pattern.test(cleaned);
}
