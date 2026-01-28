/**
 * Prompt templates for Claude AI
 */

export const PROMPTS = {
  /**
   * Extract structured activity data from a field message
   */
  EXTRACT_ACTIVITY: (message: string, from?: string) => `
You are an AI assistant for TerraFerm Africa's farm operations system.
You help extract structured data from field messages sent by farm workers.

The farm grows Opuntia (prickly pear cactus) and workers report activities like:
- Planting cladodes (cactus paddles)
- Site clearing/preparation
- Inspections and quality checks
- Weeding and maintenance
- Watering and fertilizing

Extract structured data from this field message:

MESSAGE: "${message}"
${from ? `FROM: ${from}` : ''}
TIMESTAMP: ${new Date().toISOString()}

Extract the following information if present:
1. Activity type (planting, clearing, inspection, weeding, watering, fertilizing, other)
2. Quantities (number of cladodes, area covered, etc.)
3. Location (plot ID/code like "2A", "3B", etc.)
4. Labor (worker count, hours worked)
5. Issues detected (problems, concerns, quality issues)
6. Resource needs (water, equipment, supplies)
7. Date (infer from timestamp if not explicit)
8. Weather conditions mentioned
9. Sentiment (positive, neutral, concerned, urgent)

Return ONLY valid JSON with this structure (no explanation):
{
  "activity_type": "planting|clearing|inspection|weeding|watering|fertilizing|other",
  "plot_id": "2A",
  "cladodes_planted": 400,
  "workers": 6,
  "hours_worked": 8,
  "date": "2026-01-26",
  "issues": [
    {
      "type": "spacing_error|pest|disease|weed|quality|other",
      "severity": "low|medium|high|critical",
      "description": "Rows too close together",
      "action_required": "Adjust spacing"
    }
  ],
  "resources_needed": [
    {
      "item": "water",
      "urgency": "low|medium|high",
      "quantity": null
    }
  ],
  "weather_conditions": "hot",
  "sentiment": "concerned",
  "notes": "Additional observations",
  "confidence": 0.92
}

Only include fields that are clearly mentioned or can be confidently inferred.
Set confidence between 0 and 1 based on how clear the message is.
`,

  /**
   * Analyze a field photo
   */
  ANALYZE_IMAGE: (imageType?: string, context?: string) => `
You are analyzing a photo from TerraFerm Africa's cactus (Opuntia) nursery farm.

${imageType ? `Image type: ${imageType}` : ''}
${context ? `Context: ${context}` : ''}

Analyze this image and extract relevant information:

1. If this shows planted rows:
   - Estimate row spacing (target is 250cm between rows)
   - Count visible plants if possible
   - Assess plant health (color, size, condition)

2. If this shows plants:
   - Health score (0-1 based on color, no pests/disease visible)
   - Any visible issues (pests, disease, damage)
   - Growth stage estimate

3. If this shows issues:
   - Identify the problem type
   - Assess severity
   - Suggest recommended actions

4. General observations:
   - Weed pressure (none, low, moderate, high)
   - Soil condition if visible
   - Any other notable observations

Return ONLY valid JSON:
{
  "row_spacing_cm": 248,
  "plants_visible": 23,
  "plant_health_score": 0.87,
  "weed_pressure": "low|moderate|high",
  "issues_detected": ["description of any issues"],
  "recommended_actions": ["suggested actions"],
  "confidence": 0.78
}

Only include fields you can assess from the image.
`,

  /**
   * Generate a weekly summary report
   */
  WEEKLY_SUMMARY: (data: {
    totalPlanted: number;
    areaPlanted: number;
    survivalRate: number;
    issues: string[];
    activities: number;
  }) => `
Generate a concise weekly summary for TerraFerm Africa's farm operations.

Data for the week:
- Total cladodes planted: ${data.totalPlanted}
- Area planted: ${data.areaPlanted} hectares
- Average survival rate: ${data.survivalRate}%
- Issues reported: ${data.issues.length}
- Total activities logged: ${data.activities}

Key issues this week:
${data.issues.map((i) => `- ${i}`).join('\n')}

Write a 2-3 paragraph executive summary covering:
1. Overall progress vs targets
2. Key achievements
3. Concerns and recommended actions
4. Outlook for next week

Keep it professional but accessible. Use specific numbers.
`,

  /**
   * Classify message intent
   */
  CLASSIFY_INTENT: (message: string) => `
Classify the intent of this farm worker message:

MESSAGE: "${message}"

Categories:
1. activity_report - Reporting work done (planting, clearing, etc.)
2. issue_report - Reporting a problem or concern
3. resource_request - Asking for supplies, equipment, etc.
4. question - Asking for information or help
5. status_update - General progress update
6. other - Doesn't fit other categories

Return JSON only:
{
  "intent": "activity_report",
  "confidence": 0.95,
  "sub_intents": ["planting", "completion_update"]
}
`,
};
