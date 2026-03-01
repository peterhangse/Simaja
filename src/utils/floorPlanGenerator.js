/**
 * Procedural Floor Plan Generator
 * Uses Binary Space Partitioning (BSP) to create non-overlapping room layouts.
 */

import {
  LOT_SIZES, STYLES, BUDGETS,
  HOUSE_NAMES, BUILD_TIPS,
  EXTRA_TO_ROOM, FEATURE_TO_ROOM, ADJACENCY
} from '@/data/floorPlanData'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── BSP Tree ─────────────────────────────────────────────────────────────────

/**
 * Split a rectangle recursively into leaf nodes.
 * Each leaf becomes a room slot.
 */
function bspSplit(rect, minW, minH, maxDepth, depth = 0) {
  const { x, y, w, h } = rect

  // Stop if too small or max depth reached
  if (depth >= maxDepth || (w <= minW * 2.2 && h <= minH * 2.2)) {
    return [{ x, y, w, h }]
  }

  // Choose split axis: prefer splitting the longer dimension
  const splitHorizontal = h > w ? true : w > h ? false : Math.random() > 0.5

  if (splitHorizontal) {
    // Split top/bottom
    const splitAt = rand(minH, h - minH)
    if (splitAt < minH || (h - splitAt) < minH) {
      return [{ x, y, w, h }]
    }
    return [
      ...bspSplit({ x, y, w, h: splitAt }, minW, minH, maxDepth, depth + 1),
      ...bspSplit({ x, y: y + splitAt, w, h: h - splitAt }, minW, minH, maxDepth, depth + 1)
    ]
  } else {
    // Split left/right
    const splitAt = rand(minW, w - minW)
    if (splitAt < minW || (w - splitAt) < minW) {
      return [{ x, y, w, h }]
    }
    return [
      ...bspSplit({ x, y, w: splitAt, h }, minW, minH, maxDepth, depth + 1),
      ...bspSplit({ x: x + splitAt, y, w: w - splitAt, h }, minW, minH, maxDepth, depth + 1)
    ]
  }
}

// ─── Room Assignment ──────────────────────────────────────────────────────────

/**
 * Build the list of required rooms from form configuration.
 */
function buildRoomList(config) {
  const rooms = []

  // Always have an entry
  rooms.push({ type: 'Entry', priority: 10, minArea: 6, prefFront: true })

  // Open plan or separate kitchen/living
  if (config.features.includes('openplan')) {
    rooms.push({ type: 'Open Kitchen/Living', priority: 9, minArea: 24, prefFront: false })
  } else {
    rooms.push({ type: 'Living Room', priority: 9, minArea: 16, prefFront: false })
    rooms.push({ type: 'Kitchen', priority: 8, minArea: 9, prefFront: false })
  }

  // Hallway to connect things
  rooms.push({ type: 'Hallway', priority: 7, minArea: 6, prefFront: false })

  // Master bedroom
  rooms.push({ type: 'Master Bedroom', priority: 8, minArea: 12, prefFront: false })

  // Extra bedrooms
  for (let i = 1; i < config.bedrooms; i++) {
    rooms.push({ type: 'Bedroom', priority: 6, minArea: 9, prefFront: false })
  }

  // Master bathroom (ensuite or not)
  if (config.features.includes('ensuite')) {
    rooms.push({ type: 'Master Bathroom', priority: 7, minArea: 6, prefFront: false })
  }

  // Regular bathrooms
  for (let i = 0; i < config.bathrooms; i++) {
    rooms.push({ type: 'Bathroom', priority: 5, minArea: 6, prefFront: false })
  }

  // Feature-based rooms
  if (config.features.includes('dining')) {
    rooms.push({ type: 'Dining Room', priority: 6, minArea: 9, prefFront: false })
  }
  if (config.features.includes('laundry')) {
    rooms.push({ type: 'Laundry', priority: 3, minArea: 4, prefFront: false })
  }
  if (config.features.includes('mudroom')) {
    rooms.push({ type: 'Mudroom', priority: 4, minArea: 4, prefFront: true })
  }

  // Extra-based rooms (indoor ones)
  const indoorExtras = { office: 'Office', gym: 'Gym', library: 'Library', studio: 'Art Studio', basement: 'Basement' }
  for (const [key, roomType] of Object.entries(indoorExtras)) {
    if (config.extras.includes(key)) {
      rooms.push({ type: roomType, priority: 3, minArea: 9, prefFront: false })
    }
  }

  return rooms.sort((a, b) => b.priority - a.priority)
}

/**
 * Score how well a room type fits in a particular slot,
 * considering adjacency to already-placed rooms.
 */
function adjacencyScore(roomType, slot, placedRooms) {
  let score = 0
  const prefs = ADJACENCY[roomType] || {}

  for (const placed of placedRooms) {
    const prefScore = prefs[placed.name] || 0
    if (prefScore === 0) continue

    // Check if slots are adjacent (share an edge)
    const adjacent = isAdjacent(slot, placed)
    if (adjacent) {
      score += prefScore
    }
  }

  return score
}

function isAdjacent(a, b) {
  // Two rects are adjacent if they share at least a 1-tile edge
  const overlapX = Math.min(a.x + a.w, b.x + b.width) - Math.max(a.x, b.x)
  const overlapY = Math.min(a.y + a.h, b.y + b.height) - Math.max(a.y, b.y)

  // Horizontally adjacent (share vertical edge)
  if ((a.x + a.w === b.x || b.x + b.width === a.x) && overlapY > 0) return true
  // Vertically adjacent (share horizontal edge)
  if ((a.y + a.h === b.y || b.y + b.height === a.y) && overlapX > 0) return true

  return false
}

/**
 * Assign room types to BSP slots using priority + adjacency scoring.
 */
function assignRooms(slots, roomList) {
  const assigned = []
  const availableSlots = [...slots]

  for (const room of roomList) {
    if (availableSlots.length === 0) break

    let bestIdx = 0
    let bestScore = -Infinity

    for (let i = 0; i < availableSlots.length; i++) {
      const slot = availableSlots[i]
      const area = slot.w * slot.h

      // Skip slots that are way too small
      if (area < room.minArea * 0.6) continue

      let score = 0

      // Prefer front slots for entry/mudroom
      if (room.prefFront) {
        score += (1 - slot.y / 100) * 10
      }

      // Size fitness — prefer slots close to the ideal size
      const idealArea = room.minArea * 1.8
      score -= Math.abs(area - idealArea) * 0.3

      // Adjacency bonus
      score += adjacencyScore(room.type, slot, assigned) * 3

      // Larger rooms (Living Room, Master Bedroom) get bigger slots
      if (room.minArea >= 12) {
        score += area * 0.2
      }

      // Small utility rooms (Bathroom, Laundry, Closet) prefer smaller slots
      if (room.minArea <= 6) {
        score -= area * 0.15
      }

      if (score > bestScore) {
        bestScore = score
        bestIdx = i
      }
    }

    const slot = availableSlots.splice(bestIdx, 1)[0]
    assigned.push({
      name: room.type,
      x: slot.x,
      y: slot.y,
      width: slot.w,
      height: slot.h
    })
  }

  return assigned
}

// ─── Outdoor Rooms ────────────────────────────────────────────────────────────

function addOutdoorRooms(rooms, lotW, lotH, houseRect, extras) {
  const outdoor = []

  if (extras.includes('garden')) {
    // Garden strip at the back
    const gardenH = Math.max(2, lotH - (houseRect.y + houseRect.h))
    if (gardenH >= 2) {
      outdoor.push({
        name: 'Garden',
        x: 1,
        y: houseRect.y + houseRect.h,
        width: lotW - 2,
        height: gardenH - 1
      })
    }
  }

  if (extras.includes('pool')) {
    // Pool to the side or back
    const poolW = Math.min(6, Math.floor(lotW * 0.2))
    const poolH = Math.min(8, Math.floor(lotH * 0.25))
    const poolX = houseRect.x + houseRect.w + 1
    const poolY = Math.max(2, houseRect.y + Math.floor(houseRect.h * 0.3))

    if (poolX + poolW <= lotW - 1 && poolY + poolH <= lotH - 1) {
      outdoor.push({
        name: 'Pool',
        x: poolX,
        y: poolY,
        width: poolW,
        height: poolH
      })
    } else {
      // Try below the house
      const byX = houseRect.x + Math.floor(houseRect.w * 0.3)
      const byY = houseRect.y + houseRect.h + 1
      if (byY + poolH <= lotH - 1) {
        outdoor.push({
          name: 'Pool',
          x: byX,
          y: byY,
          width: poolW,
          height: poolH
        })
      }
    }
  }

  if (extras.includes('garage')) {
    // Garage attached to the side
    const garageW = Math.min(5, Math.floor(lotW * 0.15))
    const garageH = Math.min(5, Math.floor(lotH * 0.15))
    const gx = houseRect.x - garageW - 1
    if (gx >= 1) {
      outdoor.push({
        name: 'Garage',
        x: Math.max(1, gx),
        y: houseRect.y,
        width: garageW,
        height: garageH
      })
    }
  }

  return outdoor
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

function generateTitle(style) {
  const names = HOUSE_NAMES[style] || HOUSE_NAMES.contemporary
  return pick(names)
}

function generateCost(rooms, budget) {
  const budgetInfo = BUDGETS.find(b => b.id === budget)
  if (!budgetInfo) return '§50,000'

  const totalArea = rooms.reduce((sum, r) => sum + r.width * r.height, 0)
  const costPerTile = rand(budgetInfo.min, budgetInfo.max) / Math.max(totalArea, 1)
  const totalCost = Math.round(totalArea * costPerTile / 1000) * 1000

  return `§${totalCost.toLocaleString('en-US')}`
}

function generateKeyFeatures(config, rooms) {
  const features = []
  const roomNames = rooms.map(r => r.name)

  if (roomNames.includes('Open Kitchen/Living')) features.push('Open Plan Living')
  if (roomNames.includes('Master Bathroom')) features.push('Ensuite Master Bath')
  if (roomNames.includes('Pool')) features.push('Swimming Pool')
  if (roomNames.includes('Garage')) features.push('Attached Garage')
  if (roomNames.includes('Garden')) features.push('Landscaped Garden')
  if (roomNames.includes('Office')) features.push('Home Office')
  if (roomNames.includes('Library')) features.push('Private Library')
  if (roomNames.includes('Gym')) features.push('Home Gym')

  const bedroomCount = roomNames.filter(n => n === 'Bedroom' || n === 'Master Bedroom').length
  const bathCount = roomNames.filter(n => n === 'Bathroom' || n === 'Master Bathroom').length
  features.push(`${bedroomCount} Bed / ${bathCount} Bath`)

  const styleInfo = STYLES.find(s => s.id === config.style)
  if (styleInfo) features.push(`${styleInfo.label} Style`)

  return features.slice(0, 5)
}

// ─── Main Generator ───────────────────────────────────────────────────────────

/**
 * Generate a complete floor plan from form data.
 * Returns the same JSON shape the AI prompt would have produced.
 */
export function generateFloorPlan(config) {
  const lotInfo = LOT_SIZES.find(l => l.label === config.lotSize) || LOT_SIZES[3]
  const lotW = lotInfo.w
  const lotH = lotInfo.h

  // 1. Define house footprint (inset from lot edges)
  const margin = lotW >= 40 ? 3 : 2
  const footprintRatio = 0.55 + Math.random() * 0.15 // 55-70%
  const houseW = Math.floor((lotW - margin * 2) * Math.sqrt(footprintRatio))
  const houseH = Math.floor((lotH - margin * 2) * Math.sqrt(footprintRatio))
  const houseX = Math.floor((lotW - houseW) / 2)
  const houseY = margin

  const houseRect = { x: houseX, y: houseY, w: houseW, h: houseH }

  // 2. Determine how many rooms we need
  const roomList = buildRoomList(config)
  const targetRooms = roomList.length

  // 3. BSP split the house footprint
  const minRoomW = 3
  const minRoomH = 3
  // Adjust max depth to get approximately the right number of rooms
  const maxDepth = Math.max(3, Math.min(6, Math.ceil(Math.log2(targetRooms)) + 1))
  let slots = bspSplit(houseRect, minRoomW, minRoomH, maxDepth)

  // If we got too few slots, try again with higher depth
  if (slots.length < targetRooms * 0.7) {
    slots = bspSplit(houseRect, minRoomW, minRoomH, maxDepth + 1)
  }

  // If too many slots, merge some adjacent small ones
  while (slots.length > targetRooms + 2 && slots.length > 3) {
    // Find the smallest slot and merge with an adjacent one
    let smallestIdx = 0
    let smallestArea = Infinity
    for (let i = 0; i < slots.length; i++) {
      const area = slots[i].w * slots[i].h
      if (area < smallestArea) {
        smallestArea = area
        smallestIdx = i
      }
    }

    const small = slots[smallestIdx]
    let merged = false

    for (let j = 0; j < slots.length; j++) {
      if (j === smallestIdx) continue
      const other = slots[j]

      // Can merge horizontally (same y and h, adjacent x)
      if (small.y === other.y && small.h === other.h) {
        if (small.x + small.w === other.x) {
          other.x = small.x
          other.w += small.w
          slots.splice(smallestIdx, 1)
          merged = true
          break
        }
        if (other.x + other.w === small.x) {
          other.w += small.w
          slots.splice(smallestIdx, 1)
          merged = true
          break
        }
      }
      // Can merge vertically (same x and w, adjacent y)
      if (small.x === other.x && small.w === other.w) {
        if (small.y + small.h === other.y) {
          other.y = small.y
          other.h += small.h
          slots.splice(smallestIdx, 1)
          merged = true
          break
        }
        if (other.y + other.h === small.y) {
          other.h += small.h
          slots.splice(smallestIdx, 1)
          merged = true
          break
        }
      }
    }

    if (!merged) break // Can't merge any more — stop
  }

  // 4. Assign room types to slots
  const indoorRooms = assignRooms(slots, roomList)

  // 5. Add outdoor rooms
  const outdoorRooms = addOutdoorRooms(indoorRooms, lotW, lotH, houseRect, config.extras)
  const allRooms = [...indoorRooms, ...outdoorRooms]

  // 6. Generate metadata
  const title = generateTitle(config.style)
  const cost = generateCost(allRooms, config.budget)
  const keyFeatures = generateKeyFeatures(config, allRooms)
  const buildTips = BUILD_TIPS[config.style] || BUILD_TIPS.contemporary

  return {
    title,
    style: config.style,
    description: `A ${STYLES.find(s => s.id === config.style)?.label || 'custom'} home on a ${config.lotSize} lot, designed for a ${config.household} household. Features ${allRooms.length} rooms across the ground floor.`,
    floors: config.floors,
    lotSize: config.lotSize,
    estimatedCost: cost,
    footprintTiles: `${houseW}×${houseH}`,
    keyFeatures,
    buildTips,
    rooms: allRooms
  }
}
