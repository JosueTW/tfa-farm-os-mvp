/**
 * Data extraction utilities for parsing AI responses and messages
 */

/**
 * Extract plot code from a message
 * Matches patterns like "Plot 2A", "plot 3B", "2A", "3-B"
 */
export function extractPlotCode(message: string): string | null {
  // Pattern: "Plot 2A" or "plot 2A" or just "2A" or "3-B"
  const patterns = [
    /plot\s*([0-9]+[a-zA-Z]?)/i,
    /\b([0-9]+[a-zA-Z])\b/,
    /\b([0-9]+-[a-zA-Z])\b/,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      // Normalize: remove dashes, uppercase letters
      return match[1].replace('-', '').toUpperCase();
    }
  }

  return null;
}

/**
 * Extract numeric values from a message
 */
export function extractNumbers(message: string): number[] {
  const numbers: number[] = [];
  const pattern = /\b(\d+(?:,\d{3})*(?:\.\d+)?)\b/g;
  let match;

  while ((match = pattern.exec(message)) !== null) {
    const num = parseFloat(match[1].replace(',', ''));
    if (!isNaN(num)) {
      numbers.push(num);
    }
  }

  return numbers;
}

/**
 * Extract cladode count from a message
 * Looks for patterns like "400 cladodes", "planted 400", etc.
 */
export function extractCladodeCount(message: string): number | null {
  const patterns = [
    /(\d+(?:,\d{3})*)\s*cladodes?/i,
    /planted\s*(\d+(?:,\d{3})*)/i,
    /(\d+(?:,\d{3})*)\s*plants?/i,
    /(\d+(?:,\d{3})*)\s*paddles?/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      return parseInt(match[1].replace(',', ''), 10);
    }
  }

  return null;
}

/**
 * Extract worker count from a message
 */
export function extractWorkerCount(message: string): number | null {
  const patterns = [
    /(\d+)\s*workers?/i,
    /(\d+)\s*people/i,
    /(\d+)\s*staff/i,
    /team\s*of\s*(\d+)/i,
    /(\d+)\s*laborers?/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  return null;
}

/**
 * Extract date from a message
 */
export function extractDate(message: string): string | null {
  // Check for "today", "yesterday", etc.
  const lowerMessage = message.toLowerCase();
  const today = new Date();

  if (lowerMessage.includes('today')) {
    return today.toISOString().split('T')[0];
  }

  if (lowerMessage.includes('yesterday')) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }

  // Check for date patterns like "26 Jan", "Jan 26", "2026-01-26"
  const patterns = [
    /(\d{4})-(\d{2})-(\d{2})/, // ISO format
    /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i,
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})/i,
  ];

  const monthMap: Record<string, number> = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      if (pattern.toString().includes('\\d{4}')) {
        // ISO format
        return match[0];
      } else {
        // Month name format
        const monthStr = (match[1].toLowerCase().slice(0, 3) in monthMap
          ? match[1]
          : match[2]
        )
          .toLowerCase()
          .slice(0, 3);
        const day = parseInt(match[1] in monthMap ? match[2] : match[1], 10);
        const month = monthMap[monthStr];
        const year = today.getFullYear();

        const date = new Date(year, month, day);
        return date.toISOString().split('T')[0];
      }
    }
  }

  return null;
}

/**
 * Detect activity type from a message
 */
export function detectActivityType(message: string): string | null {
  const lowerMessage = message.toLowerCase();

  const activityPatterns: Record<string, string[]> = {
    planting: ['plant', 'planted', 'planting', 'sow', 'sowed', 'sowing'],
    site_clearing: [
      'clear',
      'cleared',
      'clearing',
      'prepare',
      'prepared',
      'preparation',
    ],
    inspection: [
      'inspect',
      'inspected',
      'inspection',
      'check',
      'checked',
      'checking',
      'review',
    ],
    weeding: ['weed', 'weeded', 'weeding', 'remove weeds'],
    watering: ['water', 'watered', 'watering', 'irrigat'],
    fertilizing: ['fertili', 'compost', 'manure', 'feed'],
  };

  for (const [activityType, keywords] of Object.entries(activityPatterns)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        return activityType;
      }
    }
  }

  return null;
}

/**
 * Detect issues mentioned in a message
 */
export function detectIssues(
  message: string
): Array<{ type: string; severity: string; description: string }> {
  const issues: Array<{ type: string; severity: string; description: string }> =
    [];
  const lowerMessage = message.toLowerCase();

  const issuePatterns: Record<string, { keywords: string[]; severity: string }> =
    {
      spacing_error: {
        keywords: ['spacing', 'too close', 'too far', 'alignment'],
        severity: 'medium',
      },
      pest: {
        keywords: ['pest', 'insect', 'bug', 'caterpillar', 'aphid'],
        severity: 'high',
      },
      disease: {
        keywords: ['disease', 'rot', 'fungus', 'mold', 'sick', 'dying'],
        severity: 'high',
      },
      weed: {
        keywords: ['weed', 'overgrown', 'grass'],
        severity: 'medium',
      },
      water: {
        keywords: ['dry', 'need water', 'drought', 'wilting'],
        severity: 'high',
      },
      quality: {
        keywords: ['quality', 'poor', 'damaged', 'broken'],
        severity: 'medium',
      },
    };

  for (const [issueType, { keywords, severity }] of Object.entries(
    issuePatterns
  )) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        issues.push({
          type: issueType,
          severity,
          description: `Detected keyword: ${keyword}`,
        });
        break; // Only add each issue type once
      }
    }
  }

  return issues;
}

/**
 * Analyze sentiment of a message
 */
export function analyzeSentiment(
  message: string
): 'positive' | 'neutral' | 'concerned' | 'urgent' {
  const lowerMessage = message.toLowerCase();

  const urgentKeywords = [
    'urgent',
    'asap',
    'immediately',
    'emergency',
    'critical',
  ];
  const concernedKeywords = [
    'problem',
    'issue',
    'concern',
    'worry',
    'bad',
    'trouble',
  ];
  const positiveKeywords = [
    'good',
    'great',
    'excellent',
    'completed',
    'done',
    'success',
  ];

  if (urgentKeywords.some((k) => lowerMessage.includes(k))) {
    return 'urgent';
  }

  if (concernedKeywords.some((k) => lowerMessage.includes(k))) {
    return 'concerned';
  }

  if (positiveKeywords.some((k) => lowerMessage.includes(k))) {
    return 'positive';
  }

  return 'neutral';
}
