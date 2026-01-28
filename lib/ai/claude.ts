import Anthropic from '@anthropic-ai/sdk';
import { PROMPTS } from './prompts';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ExtractedData {
  activity_type?: string;
  plot_id?: string;
  cladodes_planted?: number;
  workers?: number;
  hours_worked?: number;
  date?: string;
  issues?: Array<{
    type: string;
    severity: string;
    description: string;
    action_required?: string;
  }>;
  resources_needed?: Array<{
    item: string;
    urgency: string;
    quantity?: number;
  }>;
  weather_conditions?: string;
  sentiment?: string;
  notes?: string;
}

interface ProcessMessageResult {
  extractedData: ExtractedData | null;
  confidence: number;
  rawResponse: string;
  processingTimeMs: number;
}

/**
 * Process a field message using Claude AI to extract structured data
 */
export async function processMessage(
  message: string,
  from?: string
): Promise<ProcessMessageResult> {
  const startTime = Date.now();

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: PROMPTS.EXTRACT_ACTIVITY(message, from),
        },
      ],
    });

    const rawResponse =
      response.content[0].type === 'text' ? response.content[0].text : '';

    // Parse the JSON response
    let extractedData: ExtractedData | null = null;
    let confidence = 0;

    try {
      // Extract JSON from the response (Claude sometimes adds explanation text)
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        confidence = parsed.confidence || 0.5;
        delete parsed.confidence;
        extractedData = parsed;
      }
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
    }

    return {
      extractedData,
      confidence,
      rawResponse,
      processingTimeMs: Date.now() - startTime,
    };
  } catch (error) {
    console.error('Error processing message with Claude:', error);
    throw error;
  }
}

interface ImageAnalysisResult {
  analysis: {
    row_spacing_cm?: number;
    plants_visible?: number;
    plant_health_score?: number;
    weed_pressure?: string;
    issues_detected?: string[];
    recommended_actions?: string[];
  };
  confidence: number;
  processingTimeMs: number;
}

/**
 * Analyze an image using Claude Vision
 */
export async function analyzeImage(
  imageUrl: string,
  imageType?: string,
  context?: string
): Promise<ImageAnalysisResult> {
  const startTime = Date.now();

  try {
    // Fetch the image and convert to base64
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const mediaType = imageResponse.headers.get('content-type') || 'image/jpeg';

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as
                  | 'image/jpeg'
                  | 'image/png'
                  | 'image/gif'
                  | 'image/webp',
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: PROMPTS.ANALYZE_IMAGE(imageType, context),
            },
          ],
        },
      ],
    });

    const rawResponse =
      response.content[0].type === 'text' ? response.content[0].text : '';

    // Parse the JSON response
    let analysis = {};
    let confidence = 0;

    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        confidence = parsed.confidence || 0.5;
        delete parsed.confidence;
        analysis = parsed;
      }
    } catch (parseError) {
      console.error('Error parsing image analysis response:', parseError);
    }

    return {
      analysis,
      confidence,
      processingTimeMs: Date.now() - startTime,
    };
  } catch (error) {
    console.error('Error analyzing image with Claude:', error);
    throw error;
  }
}

/**
 * Transcribe a voice note (placeholder - would use Whisper or similar)
 */
export async function transcribeVoiceNote(
  audioUrl: string
): Promise<{ text: string; confidence: number }> {
  // In production, this would use Whisper API or similar
  // For now, return a placeholder
  console.log('Voice transcription requested for:', audioUrl);
  return {
    text: 'Voice transcription not yet implemented',
    confidence: 0,
  };
}
