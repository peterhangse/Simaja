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
      </defs>

      <!-- Grass background -->
      <rect x="0" y="0" :width="svgW" :height="svgH" fill="url(#grass-bg)" />

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

      <!-- Room fills -->
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

      <!-- Room walls + doors -->
      <g v-for="(room, i) in rooms" :key="'wall-' + i">
        <rect
          :x="room.x * cell" :y="room.y * cell"
          :width="room.width * cell" :height="room.height * cell"
          fill="none" :stroke="getRoomStyle(room.name).stroke"
          :stroke-width="wallWidth" rx="1"
        />
        <!-- Door opening -->
        <line
          :x1="room.x * cell + room.width * cell / 2 - doorSize / 2"
          :y1="room.y * cell + room.height * cell - wallWidth / 2"
          :x2="room.x * cell + room.width * cell / 2 + doorSize / 2"
          :y2="room.y * cell + room.height * cell - wallWidth / 2"
          :stroke="getRoomStyle(room.name).fill" :stroke-width="wallWidth + 1"
        />
        <line
          :x1="room.x * cell + room.width * cell / 2 - doorSize / 2"
          :y1="room.y * cell + room.height * cell - wallWidth / 2"
          :x2="room.x * cell + room.width * cell / 2 + doorSize / 2"
          :y2="room.y * cell + room.height * cell - wallWidth / 2"
          stroke="white" :stroke-width="wallWidth - 1"
        />
        <!-- Door swing arc -->
        <path
          :d="`M ${room.x * cell + room.width * cell / 2 - doorSize / 2} ${room.y * cell + room.height * cell - wallWidth} A ${doorSize} ${doorSize} 0 0 1 ${room.x * cell + room.width * cell / 2 + doorSize / 2} ${room.y * cell + room.height * cell - wallWidth}`"
          fill="none" :stroke="getRoomStyle(room.name).stroke"
          stroke-width="0.8" opacity="0.5" stroke-dasharray="2,2"
        />
      </g>

      <!-- Room labels -->
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

const props = defineProps({
  rooms: { type: Array, required: true },
  lotW: { type: Number, required: true },
  lotH: { type: Number, required: true }
})

const MAX_W = 660
const MAX_H = 500

const cell = computed(() =>
  Math.min(Math.floor(MAX_W / props.lotW), Math.floor(MAX_H / props.lotH), 18)
)

const svgW = computed(() => props.lotW * cell.value)
const svgH = computed(() => props.lotH * cell.value)
const wallWidth = computed(() => Math.max(1.5, cell.value * 0.14))
const doorSize = computed(() => cell.value * 1.2)

function getRoomStyle(name) {
  return ROOM_STYLES[name] || DEFAULT_ROOM_STYLE
}

function labelFontSize(room) {
  const w = room.width * cell.value
  return Math.max(5, Math.min(8, w / Math.max(room.name.length, 1) * 1.2))
}
</script>
