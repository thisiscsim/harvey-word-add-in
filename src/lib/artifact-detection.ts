/**
 * Artifact Detection Utility
 * Uses weighted keyword scoring to detect whether a user message
 * should trigger a draft artifact
 */

interface KeywordWeight {
  word: string;
  weight: number;
  variants?: string[];
}

// Draft-related keywords with weights
const draftKeywords: KeywordWeight[] = [
  { word: 'draft', weight: 1.0, variants: ['drafting', 'drafted', 'drafts'] },
  { word: 'document', weight: 0.9, variants: ['documentation', 'doc', 'docs'] },
  { word: 'write', weight: 0.8, variants: ['writing', 'written', 'wrote'] },
  { word: 'memo', weight: 0.9, variants: ['memorandum', 'memos'] },
  { word: 'create', weight: 0.7, variants: ['creating', 'creation', 'created'] },
  { word: 'compose', weight: 0.8, variants: ['composing', 'composition', 'composed'] },
  { word: 'letter', weight: 0.85, variants: ['letters'] },
  { word: 'report', weight: 0.85, variants: ['reports', 'reporting'] },
  { word: 'brief', weight: 0.85, variants: ['briefs', 'briefing'] },
  { word: 'prepare', weight: 0.7, variants: ['preparing', 'preparation', 'prepared'] },
  { word: 'generate', weight: 0.7, variants: ['generating', 'generation', 'generated'] },
  { word: 'produce', weight: 0.7, variants: ['producing', 'production', 'produced'] },
  { word: 'outline', weight: 0.75, variants: ['outlining', 'outlined'] },
  { word: 'summary', weight: 0.75, variants: ['summarize', 'summarizing', 'summaries'] }
];



/**
 * Calculate the artifact score for a message based on weighted keywords
 * @param message The user's message
 * @param keywords The keyword weights to check against
 * @returns The calculated score
 */
function calculateArtifactScore(message: string, keywords: KeywordWeight[]): number {
  const lowerMessage = message.toLowerCase();
  let score = 0;
  const foundKeywords: string[] = [];
  
  for (const keywordObj of keywords) {
    const allVariants = [keywordObj.word, ...(keywordObj.variants || [])];
    
    for (const variant of allVariants) {
      // Use word boundaries to avoid partial matches (e.g., "data" in "update")
      const regex = new RegExp(`\\b${variant}\\b`, 'i');
      if (regex.test(lowerMessage)) {
        score += keywordObj.weight;
        foundKeywords.push(variant);
        break; // Only count once per keyword group
      }
    }
  }
  
  // Bonus for multiple keyword matches (synergy effect)
  if (foundKeywords.length > 1) {
    score += 0.2 * (foundKeywords.length - 1);
  }
  
  return score;
}

/**
 * Detect artifact type based on weighted keyword scoring
 * @param message The user's message
 * @returns 'draft' | null
 */
export function detectArtifactType(message: string): 'draft' | null {
  const draftScore = calculateArtifactScore(message, draftKeywords);
  
  // Threshold for minimum score to trigger an artifact
  const threshold = 0.6;
  
  // Debug logging (can be removed in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Artifact Detection:', {
      message,
      draftScore,
      threshold
    });
  }
  
  // Return draft if it meets the threshold
  if (draftScore >= threshold) {
    return 'draft';
  }
  
  return null;
}

/**
 * Get detailed scoring information for debugging/testing
 * @param message The user's message
 * @returns Detailed scoring breakdown
 */
export function getArtifactScoreDetails(message: string): {
  draftScore: number;
  suggestedType: 'draft' | null;
  draftKeywordsFound: string[];
} {
  const lowerMessage = message.toLowerCase();
  const draftKeywordsFound: string[] = [];
  
  // Find matching keywords for draft
  for (const keywordObj of draftKeywords) {
    const allVariants = [keywordObj.word, ...(keywordObj.variants || [])];
    for (const variant of allVariants) {
      const regex = new RegExp(`\\b${variant}\\b`, 'i');
      if (regex.test(lowerMessage)) {
        draftKeywordsFound.push(variant);
        break;
      }
    }
  }
  
  const draftScore = calculateArtifactScore(message, draftKeywords);
  const suggestedType = detectArtifactType(message);
  
  return {
    draftScore,
    suggestedType,
    draftKeywordsFound
  };
}