<template>
  <div v-if="rooms && rooms.length" class="overflow-x-auto">
    <svg
      :width="svgW"
      :height="svgH"
      class="block mx-auto rounded-lg border-[3px] border-emerald-700"
      style="box-shadow: 0 4px 20px rgba(0,0,0,0.25)"
    >
      <defs>
        <pattern id="pat-diagonal" patternUnits="userSpaceOnUse" width="6" height="6">
          <line x1="0" y1="6" x2="6" y2="0" stroke="rgba(0,0,0,0.08)" stroke-width="1" />
        </pattern>
        <pattern id="pat-grid" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="none" stroke="rgba(0,0,0,0.07)" stroke-width="0.5" />
        </pattern>
        <pattern id="pat-dots" patternUnits="userSpaceOnUse" width="6" height="6">
          <circle cx="3" cy="3" r="0.8" fill="rgba(0,0,0,0.1)" />
        </pattern>
        <pattern id="pat-horizontal" patternUnits="userSpaceOnUse" width="6" height="4">
          <line x1="0" y1="2" x2="6" y2="2" stroke="rgba(0,0,0,0.08)" stroke-width="0.8" />
        </pattern>
        <pattern id="pat-wave" patternUnits="userSpaceOnUse" width="10" height="6">
          <path d="M0 3 Q2.5 0 5 3 Q7.5 6 10 3" fill="none" stroke="rgba(0,120,200,0.2)" stroke-width="1" />
        </pattern>
        <pattern id="pat-organic" patternUnits="userSpaceOnUse" width="8" height="8">
          <circle cx="2" cy="2" r="1" fill="rgba(40,140,40,0.12)" />
          <circle cx="6" cy="6" r="1.2" fill="rgba(40,140,40,0.1)" />
        </pattern>
        <pattern id="grass-bg" patternUnits="userSpaceOnUse" width="10" height="10">
          <rect width="10" height="10" fill="#7CB87A" />
          <circle cx="2" cy="4" r="1.5" fill="rgba(60,160,60,0.25)" />
          <circle cx="7" cy="8" r="1" fill="rgba(60,160,60,0.2)" />
        </pattern>
        <pattern id="upper-bg" patternUnits="userSpaceOnUse" width="10" height="10">
          <rect width="10" height="10" fill="#B8C8D8" />
          <rect x="0" y="0" width="10" height="10" fill="rgba(255,255,255,0.08)" />
        </pattern>
      </defs>

      <!-- Background (grass for ground, neutral for upper) -->
      <rect x="0" y="0" :width="svgW" :height="svgH"
        :fill="floorNumber > 1 ? 'url(#upper-bg)' : 'url(#grass-bg)'" />

      <!-- Grid lines -->
      <line
        v-for="i in lotW + 1" :key="'v' + i"
        :x1="(i - 1) * cell" y1="0" :x2="(i - 1) * cell" :y2="svgH"
        stroke="rgba(0,0,0,0.05)" stroke-width="0.5"
      />
      <line
        v-for="i in lotH + 1" :key="'h' + i"
        x1="0" :y1="(i - 1) * cell" :x2="svgW" :y2="(i - 1) * cell"
        stroke="rgba(0,0,0,0.05)" stroke-width="0.5"
      />

      <!-- Pass 1: Room fills -->
      <g v-for="(room, i) in rooms" :key="'fill-' + i">
        <rect
          :x="room.x * cell" :y="room.y * cell"
          :width="room.width * cell" :height="room.height * cell"
          :fill="getRoomStyle(room.name).fill"
        />
        <rect
          v-if="getRoomStyle(room.name).pattern !== 'none'"
          :x="room.x * cell" :y="room.y * cell"
          :width="room.width * cell" :height="room.height * cell"
          :fill="`url(#pat-${getRoomStyle(room.name).pattern})`"
        />
      </g>

      <!-- Pass 2: Wall segments (with door gaps) -->
      <g v-for="(seg, i) in wallSegments" :key="'ws-' + i">
        <line
          :x1="seg.x1" :y1="seg.y1" :x2="seg.x2" :y2="seg.y2"
          :stroke="seg.stroke" :stroke-width="wallWidth" stroke-linecap="round"
        />
      </g>

      <!-- Pass 3: Door symbols -->
      <g v-for="(door, i) in doors" :key="'door-' + i">
        <!-- Door panel lines -->
        <line
          :x1="door.p1x" :y1="door.p1y" :x2="door.p2x" :y2="door.p2y"
          stroke="#555" :stroke-width="wallWidth * 0.6" stroke-linecap="round"
        />
        <!-- Door swing arc -->
        <path
          :d="door.arc" fill="none" stroke="#777"
          stroke-width="0.7" opacity="0.4" stroke-dasharray="2,2"
        />
      </g>

      <!-- Pass 4: Room labels -->
      <g v-for="(room, i) in rooms" :key="'label-' + i">
        <text
          v-if="room.height * cell > 30 && room.width * cell > 30"
          :x="room.x * cell + room.width * cell / 2"
          :y="room.y * cell + room.height * cell / 2 - 4"
          text-anchor="middle" dominant-baseline="middle"
          :font-size="Math.min(room.width * cell, room.height * cell) > 40 ? 13 : 10"
        >
          {{ getRoomStyle(room.name).icon }}
        </text>
        <text
          v-if="room.width * cell > 24 && room.height * cell > 20"
          :x="room.x * cell + room.width * cell / 2"
          :y="room.y * cell + room.height * cell / 2 + (room.height * cell > 30 ? 8 : 0)"
          text-anchor="middle" dominant-baseline="middle"
          :font-size="labelFontSize(room)"
          font-weight="700"
          :fill="getRoomStyle(room.name).stroke"
          font-family="'Nunito', sans-serif"
        >
          {{ room.name }}
        </text>
      </g>

      <!-- Pass 5: Annotation pins -->
      <g v-for="(ann, i) in annotations" :key="'pin-' + i">
        <circle
          :cx="pinX(ann)" :cy="pinY(ann)"
          r="8" fill="#16a34a" stroke="white" stroke-width="1.5"
        />
        <text
          :x="pinX(ann)" :y="pinY(ann)"
          text-anchor="middle" dominant-baseline="central"
          font-size="9" font-weight="800" fill="white"
          font-family="'Nunito', sans-serif"
        >
          {{ i + 1 }}
        </text>
      </g>

      <!-- Dimension labels -->
      <text
        :x="svgW / 2" :y="svgH - 4"
        text-anchor="middle" font-size="8" fill="rgba(255,255,255,0.8)"
        font-weight="700" font-family="'Nunito', sans-serif"
      >
        {{ lotW }} tiles wide
      </text>
      <text
        x="5" :y="svgH / 2"
        text-anchor="middle" font-size="8" fill="rgba(255,255,255,0.8)"
        font-weight="700" font-family="'Nunito', sans-serif"
        :transform="`rotate(-90, 5, ${svgH / 2})`"
      >
        {{ lotH }} tiles deep
      </text>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ROOM_STYLES, DEFAULT_ROOM_STYLE } from '@/data/floorPlanData'
import { findAdjacencies, getWallGaps, computeDoors } from '@/utils/floorPlanWalls'

const props = defineProps({
  rooms: { type: Array, required: true },
  lotW: { type: Number, required: true },
  lotH: { type: Number, required: true },
  annotations: { type: Array, default: () => [] },
  floorNumber: { type: Number, default: 1 }
})

const MAX_W = 660
const MAX_H = 500

const cell = computed(() =>
  Math.min(Math.floor(MAX_W / props.lotW), Math.floor(MAX_H / props.lotH), 18)
)

const svgW = computed(() => props.lotW * cell.value)
const svgH = computed(() => props.lotH * cell.value)
const wallWidth = computed(() => Math.max(1.5, cell.value * 0.14))

// ─── Adjacency-aware walls & doors ──────────────────────────────────────────

const adjacencies = computed(() => findAdjacencies(props.rooms))

const doors = computed(() => computeDoors(adjacencies.value, cell.value))

/** Build wall segments with gaps cut for doors. */
const wallSegments = computed(() => {
  const c = cell.value
  const segs = []

  props.rooms.forEach((room, idx) => {
    const style = getRoomStyle(room.name)
    const rx = room.x * c
    const ry = room.y * c
    const rw = room.width * c
    const rh = room.height * c

    // For each side, get gaps and draw segments around them
    const sides = [
      { side: 'top',    fixed: ry,      start: rx,      end: rx + rw, axis: 'h' },
      { side: 'bottom', fixed: ry + rh, start: rx,      end: rx + rw, axis: 'h' },
      { side: 'left',   fixed: rx,      start: ry,      end: ry + rh, axis: 'v' },
      { side: 'right',  fixed: rx + rw, start: ry,      end: ry + rh, axis: 'v' }
    ]

    for (const { side, fixed, start, end, axis } of sides) {
      const gaps = getWallGaps(idx, side, room, adjacencies.value, c)

      if (gaps.length === 0) {
        // No doors on this side — full wall
        if (axis === 'h') {
          segs.push({ x1: start, y1: fixed, x2: end, y2: fixed, stroke: style.stroke })
        } else {
          segs.push({ x1: fixed, y1: start, x2: fixed, y2: end, stroke: style.stroke })
        }
      } else {
        // Sort gaps and draw wall around them
        gaps.sort((a, b) => a.from - b.from)
        let cursor = start
        for (const gap of gaps) {
          if (gap.from > cursor) {
            if (axis === 'h') {
              segs.push({ x1: cursor, y1: fixed, x2: gap.from, y2: fixed, stroke: style.stroke })
            } else {
              segs.push({ x1: fixed, y1: cursor, x2: fixed, y2: gap.from, stroke: style.stroke })
            }
          }
          cursor = gap.to
        }
        if (cursor < end) {
          if (axis === 'h') {
            segs.push({ x1: cursor, y1: fixed, x2: end, y2: fixed, stroke: style.stroke })
          } else {
            segs.push({ x1: fixed, y1: cursor, x2: fixed, y2: end, stroke: style.stroke })
          }
        }
      }
    }
  })

  return segs
})

// ─── Helpers ────────────────────────────────────────────────────────────────

function getRoomStyle(name) {
  return ROOM_STYLES[name] || DEFAULT_ROOM_STYLE
}

function labelFontSize(room) {
  const w = room.width * cell.value
  return Math.max(5, Math.min(8, w / Math.max(room.name.length, 1) * 1.2))
}

/** Position annotation pin at top-right corner of its room. */
function pinX(ann) {
  const room = props.rooms.find(r => r.name === ann.room)
  if (!room) return 0
  return (room.x + room.width) * cell.value - 12
}

function pinY(ann) {
  const room = props.rooms.find(r => r.name === ann.room)
  if (!room) return 0
  return room.y * cell.value + 12
}
</script>
