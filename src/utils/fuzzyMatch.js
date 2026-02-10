/**
 * Fuzzy matching utility for OCR text correction
 * Uses Levenshtein distance to find best matches against known values
 */

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} str1 
 * @param {string} str2 
 * @returns {number} Edit distance
 */
function levenshteinDistance(str1, str2) {
  const m = str1.length
  const n = str2.length
  
  // Create matrix
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))
  
  // Initialize first column
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i
  }
  
  // Initialize first row
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j
  }
  
  // Fill in the rest
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // deletion
          dp[i][j - 1],     // insertion
          dp[i - 1][j - 1]  // substitution
        )
      }
    }
  }
  
  return dp[m][n]
}

/**
 * Calculate similarity percentage between two strings
 * @param {string} str1 
 * @param {string} str2 
 * @returns {number} Similarity percentage (0-100)
 */
export function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) return 0
  
  const s1 = str1.toLowerCase().trim()
  const s2 = str2.toLowerCase().trim()
  
  if (s1 === s2) return 100
  
  const distance = levenshteinDistance(s1, s2)
  const maxLength = Math.max(s1.length, s2.length)
  
  if (maxLength === 0) return 100
  
  return Math.round((1 - distance / maxLength) * 100)
}

/**
 * Common OCR mistakes mapping
 * Maps commonly misread characters to their correct versions
 */
const OCR_CORRECTIONS = {
  '1': ['l', 'i', 'I'],
  'l': ['1', 'i', 'I'],
  '0': ['O', 'o', 'Q'],
  'O': ['0', 'o', 'Q'],
  'o': ['0', 'O'],
  '5': ['S', 's'],
  'S': ['5', 's'],
  's': ['5', 'S'],
  '8': ['B'],
  'B': ['8'],
  'rn': ['m'],
  'm': ['rn'],
  'vv': ['w'],
  'w': ['vv'],
  'cl': ['d'],
  'd': ['cl'],
  'ii': ['u'],
  'u': ['ii', 'n']
}

/**
 * Normalize text by applying common OCR corrections
 * @param {string} text 
 * @returns {string} Normalized text
 */
export function normalizeOcrText(text) {
  if (!text) return ''
  
  let normalized = text.toLowerCase().trim()
  
  // Replace common OCR mistakes
  normalized = normalized.replace(/1/g, 'l')
  normalized = normalized.replace(/0/g, 'o')
  normalized = normalized.replace(/5/g, 's')
  normalized = normalized.replace(/rn/g, 'm')
  
  return normalized
}

/**
 * Find the best match for a string in a list of candidates
 * @param {string} input - The OCR text to match
 * @param {string[]} candidates - List of valid values to match against
 * @param {number} threshold - Minimum similarity percentage to accept (default: 70)
 * @returns {{ value: string, confidence: number } | null}
 */
export function findBestMatch(input, candidates, threshold = 70) {
  if (!input || !candidates || candidates.length === 0) {
    return null
  }
  
  const normalizedInput = normalizeOcrText(input)
  
  let bestMatch = null
  let bestScore = 0
  
  for (const candidate of candidates) {
    const normalizedCandidate = normalizeOcrText(candidate)
    
    // Direct match (case insensitive)
    if (normalizedInput === normalizedCandidate) {
      return { value: candidate, confidence: 100 }
    }
    
    // Calculate similarity
    const similarity = calculateSimilarity(normalizedInput, normalizedCandidate)
    
    if (similarity > bestScore) {
      bestScore = similarity
      bestMatch = candidate
    }
    
    // Also check if input contains the candidate (for partial matches)
    if (normalizedInput.includes(normalizedCandidate) || normalizedCandidate.includes(normalizedInput)) {
      const containsScore = Math.max(similarity, 85) // Boost score for contains match
      if (containsScore > bestScore) {
        bestScore = containsScore
        bestMatch = candidate
      }
    }
  }
  
  if (bestScore >= threshold && bestMatch) {
    return { value: bestMatch, confidence: bestScore }
  }
  
  return null
}

/**
 * Find all matches above threshold in a text
 * @param {string} text - Full OCR text to search
 * @param {string[]} candidates - List of valid values to find
 * @param {number} threshold - Minimum similarity percentage (default: 75)
 * @returns {Array<{ value: string, confidence: number }>}
 */
export function findAllMatches(text, candidates, threshold = 75) {
  if (!text || !candidates || candidates.length === 0) {
    return []
  }
  
  const matches = []
  const words = text.split(/[\s,.\n]+/).filter(w => w.length > 2)
  const usedCandidates = new Set()
  
  // First, look for exact multi-word matches
  for (const candidate of candidates) {
    const normalizedCandidate = normalizeOcrText(candidate)
    const normalizedText = normalizeOcrText(text)
    
    if (normalizedText.includes(normalizedCandidate) && !usedCandidates.has(candidate)) {
      matches.push({ value: candidate, confidence: 95 })
      usedCandidates.add(candidate)
    }
  }
  
  // Then look for single-word matches
  for (const word of words) {
    for (const candidate of candidates) {
      if (usedCandidates.has(candidate)) continue
      
      const similarity = calculateSimilarity(word, candidate)
      
      if (similarity >= threshold) {
        matches.push({ value: candidate, confidence: similarity })
        usedCandidates.add(candidate)
        break
      }
    }
  }
  
  return matches.sort((a, b) => b.confidence - a.confidence)
}

/**
 * Extract a potential name from OCR text
 * Names are typically: First word(s) with capital letters, no numbers
 * @param {string} text 
 * @returns {string | null}
 */
export function extractPotentialName(text) {
  if (!text) return null
  
  // Split into lines
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)
  
  for (const line of lines) {
    // Skip lines that look like UI elements or numbers
    if (/^\d+$/.test(line)) continue
    if (line.length < 2 || line.length > 50) continue
    
    // Check if line looks like a name (starts with capital, has letters)
    const nameMatch = line.match(/^[A-ZÅÄÖ][a-zåäöA-ZÅÄÖ\s\-']+$/u)
    if (nameMatch) {
      // Clean up potential OCR artifacts
      const cleaned = line
        .replace(/[|]/g, 'l')
        .replace(/[1]/g, 'l')
        .replace(/[0]/g, 'o')
        .trim()
      
      if (cleaned.length >= 2) {
        return cleaned
      }
    }
  }
  
  return null
}

/**
 * Extract skill level from text like "Cooking: 7" or "Level 5"
 * @param {string} text 
 * @returns {{ name: string, level: number } | null}
 */
export function extractSkillLevel(text) {
  // Pattern: "SkillName: X" or "SkillName X"
  const match = text.match(/([A-Za-zåäöÅÄÖ\s]+)[:\s]+(\d{1,2})/i)
  
  if (match) {
    const name = match[1].trim()
    const level = parseInt(match[2], 10)
    
    if (level >= 1 && level <= 15 && name.length > 2) {
      return { name, level }
    }
  }
  
  return null
}

export default {
  calculateSimilarity,
  normalizeOcrText,
  findBestMatch,
  findAllMatches,
  extractPotentialName,
  extractSkillLevel
}
