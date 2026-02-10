/**
 * OCR Service using Tesseract.js
 * Extracts and parses Sim data from Sims 4 screenshots
 */

import { createWorker } from 'tesseract.js'
import { findBestMatch, findAllMatches, extractPotentialName, extractSkillLevel } from '@/utils/fuzzyMatch'
import { 
  getAllTraitNames, 
  getAllAspirationNames, 
  getAllCareerNames, 
  getAllSkillNames,
  getAllAgeNames,
  traitToSwedish,
  aspirationToSwedish,
  careerToSwedish,
  skillToSwedish,
  ageToSwedish
} from '@/data/sims4Data'

// Cached worker instance
let workerInstance = null
let workerInitialized = false

/**
 * Initialize the Tesseract worker (lazy loading)
 * @param {function} onProgress - Progress callback (0-100)
 * @returns {Promise<Worker>}
 */
export async function initWorker(onProgress = null) {
  if (workerInstance && workerInitialized) {
    return workerInstance
  }
  
  workerInstance = await createWorker('eng+swe', 1, {
    logger: (m) => {
      if (onProgress && m.status === 'recognizing text') {
        onProgress(Math.round(m.progress * 100))
      }
    }
  })
  
  workerInitialized = true
  return workerInstance
}

/**
 * Terminate the worker to free memory
 */
export async function terminateWorker() {
  if (workerInstance) {
    await workerInstance.terminate()
    workerInstance = null
    workerInitialized = false
  }
}

/**
 * Extract raw text from an image using OCR
 * @param {File|Blob|string} image - Image file, blob, or URL
 * @param {function} onProgress - Progress callback (0-100)
 * @returns {Promise<string>} Raw OCR text
 */
export async function extractTextFromImage(image, onProgress = null) {
  const worker = await initWorker(onProgress)
  
  const { data: { text } } = await worker.recognize(image)
  
  return text
}

/**
 * Parse raw OCR text and extract structured Sim data
 * @param {string} rawText - Raw text from OCR
 * @returns {ParsedSimData}
 */
export function parseSimData(rawText) {
  const result = {
    name: { value: '', confidence: 0, source: 'ocr' },
    age: { value: '', confidence: 0, source: 'ocr' },
    traits: [],
    aspiration: { value: '', confidence: 0, source: 'ocr' },
    career: { value: '', confidence: 0, source: 'ocr' },
    skills: [],
    rawText: rawText
  }
  
  if (!rawText || rawText.trim().length === 0) {
    return result
  }
  
  // Extract name (usually at the top of Simology panel)
  const potentialName = extractPotentialName(rawText)
  if (potentialName) {
    result.name = { value: potentialName, confidence: 80, source: 'ocr' }
  }
  
  // Extract age
  const allAges = getAllAgeNames()
  const ageMatch = findBestMatch(rawText, allAges, 80)
  if (ageMatch) {
    // Convert to Swedish if needed
    const swedishAge = ageToSwedish(ageMatch.value)
    result.age = { value: swedishAge, confidence: ageMatch.confidence, source: 'ocr' }
  }
  
  // Extract traits
  const allTraits = getAllTraitNames()
  const traitMatches = findAllMatches(rawText, allTraits, 75)
  
  // Limit to max 3 traits (Sims 4 standard) and convert to Swedish
  const uniqueTraits = []
  const seenTraits = new Set()
  
  for (const match of traitMatches) {
    if (uniqueTraits.length >= 3) break
    
    const swedishTrait = traitToSwedish(match.value)
    const traitKey = swedishTrait.toLowerCase()
    
    if (!seenTraits.has(traitKey)) {
      seenTraits.add(traitKey)
      uniqueTraits.push({
        value: swedishTrait,
        confidence: match.confidence,
        source: 'ocr'
      })
    }
  }
  
  result.traits = uniqueTraits
  
  // Extract aspiration
  const allAspirations = getAllAspirationNames()
  const aspirationMatch = findBestMatch(rawText, allAspirations, 70)
  if (aspirationMatch) {
    const swedishAspiration = aspirationToSwedish(aspirationMatch.value)
    result.aspiration = { 
      value: swedishAspiration, 
      confidence: aspirationMatch.confidence, 
      source: 'ocr' 
    }
  }
  
  // Extract career
  const allCareers = getAllCareerNames()
  const careerMatch = findBestMatch(rawText, allCareers, 70)
  if (careerMatch) {
    const swedishCareer = careerToSwedish(careerMatch.value)
    result.career = { 
      value: swedishCareer, 
      confidence: careerMatch.confidence, 
      source: 'ocr' 
    }
  }
  
  // Extract skills with levels
  const lines = rawText.split('\n')
  const allSkills = getAllSkillNames()
  
  for (const line of lines) {
    const skillLevel = extractSkillLevel(line)
    if (skillLevel) {
      const skillMatch = findBestMatch(skillLevel.name, allSkills, 70)
      if (skillMatch) {
        const swedishSkill = skillToSwedish(skillMatch.value)
        result.skills.push({
          name: swedishSkill,
          level: skillLevel.level,
          confidence: skillMatch.confidence,
          source: 'ocr'
        })
      }
    }
  }
  
  return result
}

/**
 * Main function: Process a screenshot and extract Sim data
 * @param {File|Blob|string} image - Image to process
 * @param {function} onProgress - Progress callback (0-100)
 * @returns {Promise<ParsedSimData>}
 */
export async function processScreenshot(image, onProgress = null) {
  // Extract text
  const rawText = await extractTextFromImage(image, onProgress)
  
  // Parse the text
  const simData = parseSimData(rawText)
  
  return simData
}

/**
 * Check if the OCR result looks valid (contains at least some Sims 4 related content)
 * @param {ParsedSimData} data 
 * @returns {{ valid: boolean, reason: string }}
 */
export function validateOcrResult(data) {
  if (!data.rawText || data.rawText.trim().length < 10) {
    return { valid: false, reason: 'Kunde inte läsa text från bilden' }
  }
  
  // Check if we found at least something useful
  const hasName = data.name.value && data.name.confidence > 50
  const hasTraits = data.traits.length > 0
  const hasAge = data.age.value && data.age.confidence > 50
  const hasAspiration = data.aspiration.value && data.aspiration.confidence > 50
  
  if (!hasName && !hasTraits && !hasAge && !hasAspiration) {
    return { 
      valid: false, 
      reason: 'Kunde inte hitta Sim-data i bilden. Prova en screenshot av Simology-panelen.' 
    }
  }
  
  return { valid: true, reason: '' }
}

/**
 * @typedef {Object} ParsedSimData
 * @property {{ value: string, confidence: number, source: string }} name
 * @property {{ value: string, confidence: number, source: string }} age
 * @property {Array<{ value: string, confidence: number, source: string }>} traits
 * @property {{ value: string, confidence: number, source: string }} aspiration
 * @property {{ value: string, confidence: number, source: string }} career
 * @property {Array<{ name: string, level: number, confidence: number, source: string }>} skills
 * @property {string} rawText
 */

export default {
  initWorker,
  terminateWorker,
  extractTextFromImage,
  parseSimData,
  processScreenshot,
  validateOcrResult
}
