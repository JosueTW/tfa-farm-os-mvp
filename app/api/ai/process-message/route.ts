import { NextRequest, NextResponse } from 'next/server';
import { processMessage } from '@/lib/ai/claude';
import { z } from 'zod';

const processMessageSchema = z.object({
  message: z.string().min(1),
  from: z.string().optional(),
  timestamp: z.string().optional(),
});

// POST /api/ai/process-message - Process a message with Claude AI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = processMessageSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { message, from, timestamp } = validationResult.data;

    // Process the message with Claude
    const result = await processMessage(message, from);

    return NextResponse.json({
      success: true,
      extracted_data: result.extractedData,
      confidence: result.confidence,
      raw_response: result.rawResponse,
      processing_time_ms: result.processingTimeMs,
    });
  } catch (error) {
    console.error('AI process-message error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
