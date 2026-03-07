/**
 * Wall & Door Adjacency Engine
 *
 * Computes structural adjacencies between rooms and determines
 * where door gaps should appear in walls. Doors only appear where
 * rooms genuinely share a wall (exact coordinate match, ≥2 tile overlap).
 */

/**
 * Find all adjacencies between rooms.
 * Returns shared wall segments where rooms touch at zero gap with ≥2 tiles overlap.
 *
 * @param {Array<{name: string, x: number, y: number, width: number, height: number}>} rooms
 * @returns {Array<Object>} adjacency objects
 */
export function findAdjacencies(rooms) {
  const adj = []

  for (let i = 0; i < rooms.length; i++) {
    const a = rooms[i]
    for (let j = i + 1; j < rooms.length; j++) {
      const b = rooms[j]

      // Check horizontal shared wall (one room's bottom = other room's top)
      // Room A bottom edge = a.y + a.height, Room B top edge = b.y
      if (a.y + a.height === b.y || b.y + b.height === a.y) {
        const wallY = a.y + a.height === b.y ? a.y + a.height : b.y + b.height
        const xs = Math.max(a.x, b.x)
        const xe = Math.min(a.x + a.width, b.x + b.width)
        if (xe - xs >= 2) {
          adj.push({ type: 'h', wallY, xs, xe, i, j })
        }
      }

      // Check vertical shared wall (one room's right = other room's left)
      if (a.x + a.width === b.x || b.x + b.width === a.x) {
        const wallX = a.x + a.width === b.x ? a.x + a.width : b.x + b.width
        const ys = Math.max(a.y, b.y)
        const ye = Math.min(a.y + a.height, b.y + b.height)
        if (ye - ys >= 2) {
          adj.push({ type: 'v', wallX, ys, ye, i, j })
        }
      }
    }
  }

  return adj
}

/**
 * For a given room side, returns pixel ranges where door gaps should be cut.
 *
 * @param {number} roomIdx - Index of this room in the rooms array
 * @param {'top'|'bottom'|'left'|'right'} side - Which wall side
 * @param {Object} room - The room object { x, y, width, height }
 * @param {Array} adjacencies - Result from findAdjacencies
 * @param {number} cell - Pixel size per tile
 * @returns {Array<{from: number, to: number}>} pixel ranges to cut
 */
export function getWallGaps(roomIdx, side, room, adjacencies, cell) {
  return adjacencies
    .filter(ad => {
      if (ad.i !== roomIdx && ad.j !== roomIdx) return false

      if (side === 'top' && ad.type === 'h' && ad.wallY === room.y) return true
      if (side === 'bottom' && ad.type === 'h' && ad.wallY === room.y + room.height) return true
      if (side === 'left' && ad.type === 'v' && ad.wallX === room.x) return true
      if (side === 'right' && ad.type === 'v' && ad.wallX === room.x + room.width) return true

      return false
    })
    .map(ad => {
      if (ad.type === 'h') {
        // Door centred in the overlap region
        const midTile = (ad.xs + ad.xe) / 2
        const doorHalf = Math.min(0.75, (ad.xe - ad.xs) / 4)
        return {
          from: (midTile - doorHalf) * cell,
          to: (midTile + doorHalf) * cell
        }
      } else {
        const midTile = (ad.ys + ad.ye) / 2
        const doorHalf = Math.min(0.75, (ad.ye - ad.ys) / 4)
        return {
          from: (midTile - doorHalf) * cell,
          to: (midTile + doorHalf) * cell
        }
      }
    })
}

/**
 * Compute door symbols for rendering.
 * Returns one door per adjacency with position and orientation info.
 *
 * @param {Array} adjacencies - Result from findAdjacencies
 * @param {number} cell - Pixel size per tile
 * @returns {Array<Object>} door render objects
 */
export function computeDoors(adjacencies, cell) {
  return adjacencies.map(ad => {
    const doorTiles = Math.min(1.5, ad.type === 'h'
      ? (ad.xe - ad.xs) * 0.4
      : (ad.ye - ad.ys) * 0.4)
    const doorPx = doorTiles * cell

    if (ad.type === 'h') {
      // Horizontal wall — door in the middle of the shared segment
      const midX = ((ad.xs + ad.xe) / 2) * cell
      const wallPx = ad.wallY * cell
      return {
        type: 'h',
        // Door panel (hinged at left, swings upward)
        panelX1: midX - doorPx / 2,
        panelY1: wallPx,
        panelX2: midX - doorPx / 2,
        panelY2: wallPx - doorPx,
        // Arc centre and radius
        arcCx: midX - doorPx / 2,
        arcCy: wallPx,
        arcR: doorPx,
        // Arc sweep path (quarter circle swinging right-upward)
        arcPath: `M ${midX - doorPx / 2} ${wallPx - doorPx} A ${doorPx} ${doorPx} 0 0 1 ${midX - doorPx / 2 + doorPx} ${wallPx}`,
        i: ad.i,
        j: ad.j
      }
    } else {
      // Vertical wall — door in the middle of the shared segment
      const midY = ((ad.ys + ad.ye) / 2) * cell
      const wallPx = ad.wallX * cell
      return {
        type: 'v',
        // Door panel (hinged at top, swings rightward)
        panelX1: wallPx,
        panelY1: midY - doorPx / 2,
        panelX2: wallPx + doorPx,
        panelY2: midY - doorPx / 2,
        // Arc
        arcCx: wallPx,
        arcCy: midY - doorPx / 2,
        arcR: doorPx,
        arcPath: `M ${wallPx + doorPx} ${midY - doorPx / 2} A ${doorPx} ${doorPx} 0 0 1 ${wallPx} ${midY - doorPx / 2 + doorPx}`,
        i: ad.i,
        j: ad.j
      }
    }
  })
}
