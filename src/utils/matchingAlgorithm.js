// Matching Algorithm
// Analyzes project proposals against grant criteria

const WEIGHTS = {
  KEYWORD_MATCH: 15,
  FOCUS_MATCH: 20,
  REQUIREMENT_MATCH: 10,
  DETAIL_BONUS_200: 5,
  DETAIL_BONUS_500: 5
};

/**
 * Analyzes a proposal text against a grant's keywords
 * @param {string} text - Proposal text
 * @param {string[]} keywords - Array of keywords to match
 * @returns {string[]} - Array of matched keywords
 */
function findKeywordMatches(text, keywords) {
  const lowerText = text.toLowerCase();
  const matches = [];

  keywords.forEach(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    if (lowerText.includes(lowerKeyword)) {
      matches.push(keyword);
    }
  });

  return matches;
}

/**
 * Analyzes a proposal text against a grant's focus areas
 * @param {string} text - Proposal text
 * @param {string[]} focusAreas - Array of focus areas to match
 * @returns {string[]} - Array of matched focus areas
 */
function findFocusMatches(text, focusAreas) {
  const lowerText = text.toLowerCase();
  const matches = [];

  focusAreas.forEach(area => {
    const lowerArea = area.toLowerCase();
    // Check if the focus area or its key words appear in the text
    if (lowerText.includes(lowerArea)) {
      matches.push(area);
    } else {
      // Also check individual words in multi-word focus areas
      const words = lowerArea.split(/\s+/);
      if (words.length > 1 && words.some(word => lowerText.includes(word))) {
        matches.push(area);
      }
    }
  });

  return matches;
}

/**
 * Checks which requirements are mentioned in the proposal
 * @param {string} text - Proposal text
 * @param {string[]} requirements - Array of requirements to check
 * @returns {string[]} - Array of matched requirements (first word only for matching)
 */
function findRequirementMatches(text, requirements) {
  const lowerText = text.toLowerCase();
  const matches = [];

  requirements.forEach(requirement => {
    const lowerReq = requirement.toLowerCase();
    // Check if requirement appears in text
    if (lowerText.includes(lowerReq)) {
      matches.push(requirement);
    } else {
      // Partial matching: check if first word appears
      const firstWord = lowerReq.split(/\s+/)[0];
      if (firstWord.length > 3 && lowerText.includes(firstWord)) {
        matches.push(requirement);
      }
    }
  });

  return matches;
}

/**
 * Calculates detail bonus based on text length
 * @param {string} text - Proposal text
 * @returns {number} - Bonus points (0-10)
 */
function calculateDetailBonus(text) {
  let bonus = 0;
  const length = text.length;

  if (length >= 200) {
    bonus += WEIGHTS.DETAIL_BONUS_200;
  }
  if (length >= 500) {
    bonus += WEIGHTS.DETAIL_BONUS_500;
  }

  return bonus;
}

/**
 * Analyzes a proposal against a single grant
 * @param {string} proposalText - The proposal text to analyze
 * @param {Object} grant - Grant object from database
 * @returns {Object} - Analysis result with score and matches
 */
function analyzeGrant(proposalText, grant) {
  let score = 0;
  const matchedKeywords = findKeywordMatches(proposalText, grant.keywords || []);
  const matchedFocus = findFocusMatches(proposalText, grant.focus || []);
  const matchedRequirements = findRequirementMatches(proposalText, grant.requirements || []);

  // Calculate score
  score += matchedKeywords.length * WEIGHTS.KEYWORD_MATCH;
  score += matchedFocus.length * WEIGHTS.FOCUS_MATCH;
  score += matchedRequirements.length * WEIGHTS.REQUIREMENT_MATCH;
  score += calculateDetailBonus(proposalText);

  // Cap score at 100
  score = Math.min(score, 100);

  return {
    grant,
    score: Math.round(score),
    matchedKeywords,
    matchedFocus,
    matchedRequirements
  };
}

/**
 * Analyzes a proposal against all grants in the database
 * @param {string} proposalText - The proposal text to analyze
 * @param {Array} grantsDatabase - Array of grant objects
 * @returns {Array} - Sorted array of analysis results (highest score first)
 */
export function analyzeProposal(proposalText, grantsDatabase) {
  if (!proposalText || !proposalText.trim()) {
    return [];
  }

  const results = grantsDatabase.map(grant => 
    analyzeGrant(proposalText, grant)
  );

  // Sort by score (descending)
  results.sort((a, b) => b.score - a.score);

  return results;
}

export default analyzeProposal;

