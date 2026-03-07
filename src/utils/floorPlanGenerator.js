/**
 * Procedural Floor Plan Generator — Multi-Floor Edition
 *
 * Uses Binary Space Partitioning (BSP) to create non-overlapping room layouts.
 * Supports multi-floor generation with staircase stacking, floor zoning,
 * adjacency scoring, forbidden-pair validation, and annotation generation.
 */

import {
  LOT_SIZES, STYLES, BUDGETS,
  HOUSE_NAMES, BUILD_TIPS,
  EXTRA_TO_ROOM, FEATURE_TO_ROOM,
  ADJACENCY, FLOOR_ZONES, FORBIDDEN_ADJACENCIES,
  ANNOTATION_TEMPLATES
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

// ─── Room Lists per Floor ─────────────────────────────────────────────────────

/**
 * Build the list of required rooms for a GROUND floor.
 */
function buildGroundFloorRooms(config, hasUpperFloors) {
  const rooms = []

  rooms.push({ type: 'Entry', priority: 10, minArea: 6, prefFront: true })

  if (config.features.includes('openplan')) {
    rooms.push({ type: 'Open Kitchen/Living', priority: 9, minArea: 24, prefFront: false })
  } else {
    rooms.push({ type: 'Living Room', priority: 9, minArea: 20, prefFront: false })
    rooms.push({ type: 'Kitchen', priority: 8, minArea: 12, prefFront: false })
  }

  rooms.push({ type: 'Hallway', priority: 7, minArea: 6, prefFront: false })

  if (hasUpperFloors) {
    rooms.push({ type: 'Staircase', priority: 8, minArea: 6, prefFront: false })
  }

  if (config.features.includes('dining')) {
    rooms.push({ type: 'Dining Room', priority: 6, minArea: 12, prefFront: false })
  }
  if (config.features.includes('laundry')) {
    rooms.push({ type: 'Laundry', priority: 3, minArea: 4, prefFront: false })
  }
  if (config.features.includes('mudroom')) {
    rooms.push({ type: 'Mudroom', priority: 4, minArea: 4, prefFront: true })
  }

  rooms.push({ type: 'Bathroom', priority: 5, minArea: 6, prefFront: false })

  if (!hasUpperFloors) {
    rooms.push({ type: 'Master Bedroom', priority: 8, minArea: 16, prefFront: false })
    for (let i = 1; i < config.bedrooms; i++) {
      rooms.push({ type: 'Bedroom', priority: 6, minArea: 12, prefFront: false })
    }
    if (config.features.includes('ensuite')) {
      rooms.push({ type: 'Master Bathroom', priority: 7, minArea: 8, prefFront: false })
    }
    for (let i = 1; i < config.bathrooms; i++) {
      rooms.push({ type: 'Bathroom', priority: 5, minArea: 6, prefFront: false })
    }
    const indoorExtras = { office: 'Office', gym: 'Gym', library: 'Library', studio: 'Art Studio' }
    for (const [key, roomType] of Object.entries(indoorExtras)) {
      if (config.extras.includes(key)) {
        rooms.push({ type: roomType, priority: 3, minArea: 9, prefFront: false })
      }
    }
  }

  return rooms.sort((a, b) => b.priority - a.priority)
}

/**
 * Build the list of required rooms for an UPPER floor.
 */
function buildUpperFloorRooms(config, floorNum, totalFloors) {
  const rooms = []

  rooms.push({ type: 'Staircase', priority: 10, minArea: 6, prefFront: false })
  rooms.push({ type: 'Hallway', priority: 9, minArea: 6, prefFront: false })

  const upperFloorCount = totalFloors - 1
  const isFirstUpper = floorNum === 2

  if (isFirstUpper) {
    rooms.push({ type: 'Master Bedroom', priority: 8, minArea: 16, prefFront: false })
    if (config.features.includes('ensuite')) {
      rooms.push({ type: 'Master Bathroom', priority: 7, minArea: 8, prefFront: false })
    }
    rooms.push({ type: 'Closet', priority: 3, minArea: 4, prefFront: false })

    const bedroomsForThisFloor = upperFloorCount === 1
      ? config.bedrooms - 1
      : Math.ceil((config.bedrooms - 1) / 2)
    for (let i = 0; i < bedroomsForThisFloor; i++) {
      rooms.push({ type: 'Bedroom', priority: 6, minArea: 12, prefFront: false })
    }

    const bathsForThisFloor = upperFloorCount === 1
      ? Math.max(1, config.bathrooms - 1)
      : Math.ceil(config.bathrooms / 2)
    for (let i = 0; i < bathsForThisFloor; i++) {
      rooms.push({ type: 'Bathroom', priority: 5, minArea: 6, prefFront: false })
    }

    if (config.extras.includes('office')) {
      rooms.push({ type: 'Office', priority: 3, minArea: 9, prefFront: false })
    }
  } else {
    const bedroomsRemaining = Math.max(0, config.bedrooms - 1 - Math.ceil((config.bedrooms - 1) / 2))
    for (let i = 0; i < bedroomsRemaining; i++) {
      rooms.push({ type: 'Bedroom', priority: 6, minArea: 12, prefFront: false })
    }

    const bathsRemaining = Math.max(1, config.bathrooms - Math.ceil(config.bathrooms / 2))
    for (let i = 0; i < bathsRemaining; i++) {
      rooms.push({ type: 'Bathroom', priority: 5, minArea: 6, prefFront: false })
    }

    const specials = { library: 'Library', gym: 'Gym', studio: 'Art Studio' }
    for (const [key, roomType] of Object.entries(specials)) {
      if (config.extras.includes(key)) {
        rooms.push({ type: roomType, priority: 3, minArea: 9, prefFront: false })
      }
    }
  }

  if (config.features.includes('balcony')) {
    rooms.push({ type: 'Balcony', priority: 2, minArea: 6, prefFront: false })
  }

  return rooms.sort((a, b) => b.priority - a.priority)
}

// ─── Room Assignment ──────────────────────────────────────────────────────────

function isAdjacent(a, b) {
  const aw = a.w || a.width
  const ah = a.h || a.height
  const bw = b.w || b.width
  const bh = b.h || b.height

  const overlapX = Math.min(a.x + aw, b.x + bw) - Math.max(a.x, b.x)
  const overlapY = Math.min(a.y + ah, b.y + bh) - Math.max(a.y, b.y)

  if ((a.x + aw === b.x || b.x + bw === a.x) && overlapY > 0) return true
  if ((a.y + ah === b.y || b.y + bh === a.y) && overlapX > 0) return true

  return false
}

function adjacencyScore(roomType, slot, placedRooms) {
  let score = 0
  const prefs = ADJACENCY[roomType] || {}

  for (const placed of placedRooms) {
    const prefScore = prefs[placed.name] || 0
    if (prefScore === 0) continue
    if (isAdjacent(slot, placed)) {
      score += prefScore
    }
  }

  return score
}

/**
 * Check if assigning roomType to a slot would create a forbidden adjacency.
 */
function hasForbiddenAdjacency(roomType, slot, placedRooms) {
  for (const placed of placedRooms) {
    if (!isAdjacent(slot, placed)) continue
    for (const [a, b] of FORBIDDEN_ADJACENCIES) {
      if ((roomType === a && placed.name === b) || (roomType === b && placed.name === a)) {
        return true
      }
    }
  }
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

      if (area < room.minArea * 0.6) continue

      let score = 0

      if (room.prefFront) {
        score += (1 - slot.y / 100) * 10
      }

      const idealArea = room.minArea * 1.8
      score -= Math.abs(area - idealArea) * 0.3

      score += adjacencyScore(room.type, slot, assigned) * 3

      if (room.minArea >= 12) {
        score += area * 0.2
      }

      if (room.minArea <= 6) {
        score -= area * 0.15
      }

      if (hasForbiddenAdjacency(room.type, slot, assigned)) {
        score -= 50
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
    const gardenH = Math.max(2, lotH - (houseRect.y + houseRect.h))
    if (gardenH >= 2) {
      outdoor.push({
        name: 'Garden',
        x: 1,
        y: houseRect.y + houseRect.h,
        width: lotW - 2,
        height: Math.min(gardenH - 1, 8)
      })
    }
  }

  if (extras.includes('pool')) {
    const poolW = Math.min(6, Math.floor(lotW * 0.2))
    const poolH = Math.min(8, Math.floor(lotH * 0.25))
    const poolX = houseRect.x + houseRect.w + 1
    const poolY = Math.max(2, houseRect.y + Math.floor(houseRect.h * 0.3))

    if (poolX + poolW <= lotW - 1 && poolY + poolH <= lotH - 1) {
      outdoor.push({ name: 'Pool', x: poolX, y: poolY, width: poolW, height: poolH })
    } else {
      const byX = houseRect.x + Math.floor(houseRect.w * 0.3)
      const byY = houseRect.y + houseRect.h + 1
      if (byY + poolH <= lotH - 1) {
        outdoor.push({ name: 'Pool', x: byX, y: byY, width: poolW, height: poolH })
      }
    }
  }

  if (extras.includes('garage')) {
    const garageW = Math.min(6, Math.floor(lotW * 0.18))
    const garageH = Math.min(7, Math.floor(lotH * 0.2))
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

// ─── Annotations ──────────────────────────────────────────────────────────────

/**
 * Generate 3-5 annotations for a set of rooms by picking from templates.
 */
function generateAnnotations(rooms) {
  const annotations = []
  const shuffledRooms = shuffle(rooms)

  for (const room of shuffledRooms) {
    if (annotations.length >= 5) break

    const templates = ANNOTATION_TEMPLATES[room.name]
    if (!templates || templates.length === 0) continue

    if (annotations.some(a => a.roomName === room.name)) continue

    const template = pick(templates)
    annotations.push({
      roomName: room.name,
      category: template.category,
      note: template.note
    })
  }

  // Ensure at least 3
  if (annotations.length < 3) {
    for (const room of shuffledRooms) {
      if (annotations.length >= 3) break
      const templates = ANNOTATION_TEMPLATES[room.name]
      if (!templates) continue
      if (annotations.some(a => a.roomName === room.name)) continue
      const template = pick(templates)
      annotations.push({
        roomName: room.name,
        category: template.category,
        note: template.note
      })
    }
  }

  return annotations
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

function generateTitle(style) {
  const names = HOUSE_NAMES[style] || HOUSE_NAMES.contemporary
  return pick(names)
}

function generateCost(allRooms, budget) {
  const budgetInfo = BUDGETS.find(b => b.id === budget)
  if (!budgetInfo) return '§50,000'

  const totalArea = allRooms.reduce((sum, r) => sum + r.width * r.height, 0)
  const costPerTile = rand(budgetInfo.min, budgetInfo.max) / Math.max(totalArea, 1)
  const totalCost = Math.round(totalArea * costPerTile / 1000) * 1000

  return `§${totalCost.toLocaleString('en-US')}`
}

function generateKeyFeatures(config, allRooms) {
  const features = []
  const roomNames = allRooms.map(r => r.name)

  if (roomNames.includes('Open Kitchen/Living')) features.push('Open Plan Living')
  if (roomNames.includes('Master Bathroom')) features.push('Ensuite Master Bath')
  if (roomNames.includes('Pool')) features.push('Swimming Pool')
  if (roomNames.includes('Garage')) features.push('Attached Garage')
  if (roomNames.includes('Garden')) features.push('Landscaped Garden')
  if (roomNames.includes('Office')) features.push('Home Office')
  if (roomNames.includes('Library')) features.push('Private Library')
  if (roomNames.includes('Gym')) features.push('Home Gym')
  if (roomNames.includes('Staircase')) features.push('Multi-Floor Layout')

  const bedroomCount = roomNames.filter(n => n === 'Bedroom' || n === 'Master Bedroom').length
  const bathCount = roomNames.filter(n => n === 'Bathroom' || n === 'Master Bathroom').length
  features.push(`${bedroomCount} Bed / ${bathCount} Bath`)

  const styleInfo = STYLES.find(s => s.id === config.style)
  if (styleInfo) features.push(`${styleInfo.label} Style`)

  return features.slice(0, 5)
}

// ─── Floor Generation ─────────────────────────────────────────────────────────

/**
 * Generate rooms for a single floor using BSP.
 */
function generateFloor(footprint, roomList, staircaseSlot) {
  const targetRooms = roomList.length
  const minRoomW = 3
  const minRoomH = 3
  const maxDepth = Math.max(3, Math.min(6, Math.ceil(Math.log2(targetRooms)) + 1))

  let slots

  if (staircaseSlot) {
    const remainingSlots = splitAroundReserved(footprint, staircaseSlot, minRoomW, minRoomH, maxDepth)
    slots = [{ ...staircaseSlot }, ...remainingSlots]
  } else {
    slots = bspSplit(footprint, minRoomW, minRoomH, maxDepth)

    if (slots.length < targetRooms * 0.7) {
      slots = bspSplit(footprint, minRoomW, minRoomH, maxDepth + 1)
    }
  }

  // Merge excess small slots
  while (slots.length > targetRooms + 2 && slots.length > 3) {
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

      if (small.y === other.y && small.h === other.h) {
        if (small.x + small.w === other.x) {
          other.x = small.x; other.w += small.w
          slots.splice(smallestIdx, 1); merged = true; break
        }
        if (other.x + other.w === small.x) {
          other.w += small.w
          slots.splice(smallestIdx, 1); merged = true; break
        }
      }
      if (small.x === other.x && small.w === other.w) {
        if (small.y + small.h === other.y) {
          other.y = small.y; other.h += small.h
          slots.splice(smallestIdx, 1); merged = true; break
        }
        if (other.y + other.h === small.y) {
          other.h += small.h
          slots.splice(smallestIdx, 1); merged = true; break
        }
      }
    }

    if (!merged) break
  }

  // Assign rooms — if staircase reserved, handle it first
  let assignedRooms
  if (staircaseSlot) {
    const otherRooms = roomList.filter(r => r.type !== 'Staircase')
    const otherSlots = slots.filter(s =>
      !(s.x === staircaseSlot.x && s.y === staircaseSlot.y &&
        s.w === staircaseSlot.w && s.h === staircaseSlot.h)
    )

    const stairRoom = {
      name: 'Staircase',
      x: staircaseSlot.x,
      y: staircaseSlot.y,
      width: staircaseSlot.w,
      height: staircaseSlot.h
    }

    assignedRooms = [stairRoom, ...assignRooms(otherSlots, otherRooms)]
  } else {
    assignedRooms = assignRooms(slots, roomList)
  }

  const stairRoom = assignedRooms.find(r => r.name === 'Staircase')
  const newStaircaseSlot = stairRoom
    ? { x: stairRoom.x, y: stairRoom.y, w: stairRoom.width, h: stairRoom.height }
    : null

  return { rooms: assignedRooms, staircaseSlot: newStaircaseSlot }
}

/**
 * Split a footprint around a reserved slot into BSP-able rectangles.
 */
function splitAroundReserved(foot, reserved, minW, minH, maxDepth) {
  const rects = []

  if (reserved.x > foot.x) {
    const w = reserved.x - foot.x
    if (w >= minW) rects.push({ x: foot.x, y: foot.y, w, h: foot.h })
  }

  const rightX = reserved.x + reserved.w
  if (rightX < foot.x + foot.w) {
    const w = foot.x + foot.w - rightX
    if (w >= minW) rects.push({ x: rightX, y: foot.y, w, h: foot.h })
  }

  if (reserved.y > foot.y) {
    const h = reserved.y - foot.y
    if (h >= minH) rects.push({ x: reserved.x, y: foot.y, w: reserved.w, h })
  }

  const bottomY = reserved.y + reserved.h
  if (bottomY < foot.y + foot.h) {
    const h = foot.y + foot.h - bottomY
    if (h >= minH) rects.push({ x: reserved.x, y: bottomY, w: reserved.w, h })
  }

  const allSlots = []
  for (const rect of rects) {
    const subDepth = Math.max(2, maxDepth - 1)
    allSlots.push(...bspSplit(rect, minW, minH, subDepth))
  }

  return allSlots
}

// ─── Main Generator ───────────────────────────────────────────────────────────

/**
 * Generate a complete multi-floor plan from form data.
 */
export function generateFloorPlan(config) {
  const lotInfo = LOT_SIZES.find(l => l.label === config.lotSize) || LOT_SIZES[3]
  const lotW = lotInfo.w
  const lotH = lotInfo.h
  const numFloors = config.floors || 1
  const hasUpperFloors = numFloors > 1

  // 1. Define ground floor house footprint
  const margin = lotW >= 40 ? 3 : 2
  const footprintRatio = 0.55 + Math.random() * 0.15
  const houseW = Math.floor((lotW - margin * 2) * Math.sqrt(footprintRatio))
  const houseH = Math.floor((lotH - margin * 2) * Math.sqrt(footprintRatio))
  const houseX = Math.floor((lotW - houseW) / 2)
  const houseY = margin

  const groundFootprint = { x: houseX, y: houseY, w: houseW, h: houseH }

  // 2. Generate ground floor
  const groundRoomList = buildGroundFloorRooms(config, hasUpperFloors)
  const groundResult = generateFloor(groundFootprint, groundRoomList, null)

  // 3. Add outdoor rooms to ground floor
  const outdoorRooms = addOutdoorRooms(groundResult.rooms, lotW, lotH, groundFootprint, config.extras)
  const groundRooms = [...groundResult.rooms, ...outdoorRooms]
  const groundAnnotations = generateAnnotations(groundRooms)

  const floorPlans = [{
    floor: 1,
    label: 'Ground Floor',
    rooms: groundRooms,
    annotations: groundAnnotations
  }]

  // 4. Generate upper floors
  let currentStaircaseSlot = groundResult.staircaseSlot

  for (let f = 2; f <= numFloors; f++) {
    const shrink = 0.7 + Math.random() * 0.2
    const upperW = Math.max(8, Math.floor(houseW * shrink))
    const upperH = Math.max(8, Math.floor(houseH * shrink))
    const upperX = houseX + Math.floor((houseW - upperW) / 2)
    const upperY = houseY + Math.floor((houseH - upperH) / 2)

    const upperFootprint = { x: upperX, y: upperY, w: upperW, h: upperH }
    const upperRoomList = buildUpperFloorRooms(config, f, numFloors)

    let stairSlot = currentStaircaseSlot
    if (stairSlot) {
      stairSlot = {
        x: Math.max(upperX, Math.min(stairSlot.x, upperX + upperW - stairSlot.w)),
        y: Math.max(upperY, Math.min(stairSlot.y, upperY + upperH - stairSlot.h)),
        w: stairSlot.w,
        h: stairSlot.h
      }
    }

    const upperResult = generateFloor(upperFootprint, upperRoomList, stairSlot)
    const upperAnnotations = generateAnnotations(upperResult.rooms)

    const floorLabel = f === 2 ? 'Upper Floor' : f === 3 ? 'Top Floor' : `Floor ${f}`

    floorPlans.push({
      floor: f,
      label: floorLabel,
      rooms: upperResult.rooms,
      annotations: upperAnnotations
    })

    currentStaircaseSlot = upperResult.staircaseSlot || stairSlot
  }

  // 5. Collect all rooms for metadata
  const allRooms = floorPlans.flatMap(fp => fp.rooms)

  // 6. Generate metadata
  const title = generateTitle(config.style)
  const cost = generateCost(allRooms, config.budget)
  const keyFeatures = generateKeyFeatures(config, allRooms)
  const buildTip = BUILD_TIPS[config.style] || BUILD_TIPS.contemporary
  const styleLabel = STYLES.find(s => s.id === config.style)?.label || 'custom'

  return {
    title,
    style: config.style,
    description: `A ${styleLabel} home on a ${config.lotSize} lot, designed for a ${config.household} household. Features ${allRooms.length} rooms across ${numFloors} floor${numFloors > 1 ? 's' : ''}.`,
    floors: numFloors,
    lotSize: config.lotSize,
    estimatedCost: cost,
    footprintTiles: `${houseW}×${houseH}`,
    keyFeatures,
    buildTip,
    floorPlans
  }
}
