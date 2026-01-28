import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage } from '@/lib/ai/claude';
import { z } from 'zod';

const analyzeImageSchema = z.object({
  image_url: z.string().url(),
  image_type: z.enum(['row', 'plant', 'issue', 'general']).optional(),
  context: z.string().optional(),
});

// POST /api/ai/analyze-image - Analyze an image with Claude Vision
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = analyzeImageSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { image_url, image_type, context } = validationResult.data;

    // Analyze the image with Claude Vision
    const result = await analyzeImage(image_url, image_type, context);

    return NextResponse.json({
      success: true,
      analysis: result.analysis,
      confidence: result.confidence,
      processing_time_ms: result.processingTimeMs,
    });
  } catch (error) {
    console.error('AI analyze-image error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
