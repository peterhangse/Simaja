<template>
  <div class="min-h-screen">
    <AppHeader />

    <main class="max-w-4xl mx-auto px-4 py-8 relative z-[1]">
      <!-- Page header -->
      <div class="s2-panel p-6 mb-6">
        <h2 class="text-2xl font-bold text-sims2-gold-light font-display flex items-center gap-3">
          <LayoutGrid :size="28" class="text-sims2-gold" />
          Floor Plan Studio
        </h2>
        <p class="text-sims2-sky mt-1">Design your lot — get a procedurally generated floor plan</p>
      </div>

      <!-- Tabs -->
      <div class="flex mb-6 bg-white rounded-xl overflow-hidden border border-gray-200">
        <button
          v-for="t in tabs" :key="t.id"
          @click="tab = t.id"
          class="flex-1 py-3 text-center font-bold text-sm tracking-wide uppercase transition-all"
          :class="tab === t.id
            ? 'bg-emerald-600 text-white'
            : 'text-sims2-sky hover:bg-gray-50'"
        >
          {{ t.icon }} {{ t.label }}
        </button>
      </div>

      <!-- ═══ INPUT TAB ═══ -->
      <div v-if="tab === 'input'">
        <!-- Lot Size -->
        <SectionLabel icon="📐" label="Lot Size (Sims 4 tiles)" />
        <div class="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2">
          <button
            v-for="ls in LOT_SIZES" :key="ls.label"
            @click="form.lotSize = ls.label"
            class="s2-panel-inner py-2 px-1 text-center rounded-xl cursor-pointer transition-all border-2"
            :class="form.lotSize === ls.label
              ? 'border-emerald-500 bg-emerald-50 !text-emerald-800'
              : 'border-transparent hover:border-emerald-200'"
          >
            <span class="block font-bold text-sm">{{ ls.label }}</span>
            <span class="block text-xs text-sims2-sky">{{ ls.tier }}</span>
          </button>
        </div>
        <div class="s2-panel-inner rounded-xl px-4 py-2 text-sm font-semibold text-sims2-sky flex items-center gap-2 mb-6">
          📏 {{ lotInfo.w }} × {{ lotInfo.h }} tiles · {{ lotInfo.w * lotInfo.h }} squares · <strong class="text-emerald-600">{{ lotInfo.tier }}</strong>
        </div>

        <!-- Floors -->
        <SectionLabel icon="🏢" label="Number of Floors" />
        <div class="flex gap-3 mb-6">
          <button
            v-for="n in [1, 2, 3]" :key="n"
            @click="form.floors = n"
            class="px-5 py-2 rounded-xl font-bold text-sm border-2 transition-all"
            :class="form.floors === n
              ? 'bg-emerald-600 text-white border-emerald-700'
              : 's2-panel-inner border-transparent hover:border-emerald-200 text-sims2-cream'"
          >
            {{ n === 1 ? '1 Floor' : `${n} Floors` }}
          </button>
        </div>

        <!-- Style -->
        <SectionLabel icon="🎨" label="Architectural Style" />
        <ChipGroup :options="STYLES" :selected="form.style" @toggle="v => form.style = v" />

        <!-- Rooms -->
        <SectionLabel icon="🛏️" label="Rooms" />
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="s2-panel-inner rounded-xl p-4">
            <div class="text-xs font-bold text-sims2-sky uppercase tracking-wider mb-3">🛏️ Bedrooms</div>
            <div class="flex items-center gap-3">
              <button @click="form.bedrooms = Math.max(1, form.bedrooms - 1)" class="stepper-btn">−</button>
              <span class="text-xl font-bold text-emerald-700 w-6 text-center font-display">{{ form.bedrooms }}</span>
              <button @click="form.bedrooms = Math.min(8, form.bedrooms + 1)" class="stepper-btn">+</button>
            </div>
          </div>
          <div class="s2-panel-inner rounded-xl p-4">
            <div class="text-xs font-bold text-sims2-sky uppercase tracking-wider mb-3">🚿 Bathrooms</div>
            <div class="flex items-center gap-3">
              <button @click="form.bathrooms = Math.max(1, form.bathrooms - 1)" class="stepper-btn">−</button>
              <span class="text-xl font-bold text-emerald-700 w-6 text-center font-display">{{ form.bathrooms }}</span>
              <button @click="form.bathrooms = Math.min(6, form.bathrooms + 1)" class="stepper-btn">+</button>
            </div>
          </div>
        </div>

        <!-- Household -->
        <SectionLabel icon="👨‍👩‍👧" label="Household Type" />
        <ChipGroup :options="HOUSEHOLD" :selected="form.household" @toggle="v => form.household = v" />

        <!-- Budget -->
        <SectionLabel icon="§" label="Budget in Simoleons" />
        <ChipGroup :options="BUDGETS" :selected="form.budget" @toggle="v => form.budget = v" />

        <!-- Extras -->
        <SectionLabel icon="✨" label="Extra Spaces" />
        <ChipGroup :options="EXTRAS" :selected="form.extras" multi @toggle="v => toggleArray('extras', v)" />

        <!-- Features -->
        <SectionLabel icon="⚙️" label="Special Features" />
        <ChipGroup :options="FEATURES" :selected="form.features" multi @toggle="v => toggleArray('features', v)" />

        <!-- Notes -->
        <SectionLabel icon="📝" label="Additional Notes" />
        <textarea
          v-model="form.notes"
          placeholder="E.g. wraparound porch, cozy reading nook, open to Sulani world..."
          class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm text-sims2-cream placeholder-gray-400 focus:border-emerald-400 outline-none resize-y min-h-[64px] mb-2"
        />

        <!-- Generate button -->
        <button
          @click="generate"
          class="s2-btn s2-btn-green w-full py-4 text-lg flex items-center justify-center gap-3 mt-4"
        >
          🏗️ Generate Floor Plan
        </button>
      </div>

      <!-- ═══ RESULT TAB ═══ -->
      <div v-if="tab === 'result'">
        <!-- Empty state -->
        <div v-if="!result" class="text-center py-16 text-sims2-sky">
          <div class="text-6xl mb-4">🏡</div>
          <p class="font-bold">Head over to Design Your Lot to generate a floor plan!</p>
        </div>

        <template v-if="result">
          <!-- Info card -->
          <div class="s2-panel p-5 mb-6">
            <div class="text-xs font-bold text-sims2-sky uppercase tracking-wider mb-1">
              {{ styleIcon }} {{ result.style }} · {{ result.lotSize }} · {{ result.floors }} floor{{ result.floors > 1 ? 's' : '' }}
            </div>
            <h3 class="text-2xl font-bold text-sims2-gold-light font-display">
              ✨ {{ result.title }}
            </h3>
            <p class="text-sm text-sims2-sky mt-2 leading-relaxed font-semibold">{{ result.description }}</p>

            <!-- Meta badges -->
            <div class="flex flex-wrap gap-3 mt-4">
              <div class="s2-panel-inner rounded-lg px-3 py-2 text-center">
                <span class="block font-display font-bold text-emerald-700">{{ result.estimatedCost }}</span>
                <span class="text-xs text-sims2-sky">Est. Cost</span>
              </div>
              <div class="s2-panel-inner rounded-lg px-3 py-2 text-center">
                <span class="block font-display font-bold text-emerald-700">{{ result.footprintTiles }}</span>
                <span class="text-xs text-sims2-sky">Footprint</span>
              </div>
              <div class="s2-panel-inner rounded-lg px-3 py-2 text-center">
                <span class="block font-display font-bold text-emerald-700">{{ totalRoomCount }}</span>
                <span class="text-xs text-sims2-sky">Rooms</span>
              </div>
            </div>

            <!-- Key features -->
            <div v-if="result.keyFeatures?.length" class="flex flex-wrap gap-2 mt-4">
              <span
                v-for="(f, i) in result.keyFeatures" :key="i"
                class="bg-emerald-600 text-white rounded-md px-2.5 py-1 text-xs font-bold"
              >
                ✓ {{ f }}
              </span>
            </div>

            <!-- Build tip -->
            <div v-if="result.buildTip" class="bg-amber-50 rounded-xl px-4 py-3 mt-4 border-l-4 border-amber-400 text-sm text-amber-900 font-semibold">
              💡 <strong>Build Tip:</strong> {{ result.buildTip }}
            </div>
          </div>

          <!-- Floor switcher -->
          <FloorSwitcher
            v-if="result.floorPlans?.length > 1"
            :floor-plans="result.floorPlans"
            :active-floor="activeFloor"
            @update:active-floor="activeFloor = $event"
          />

          <!-- Floor plan SVG -->
          <div class="s2-panel p-4 mb-6">
            <FloorPlanCanvas
              :rooms="currentFloorData?.rooms || []"
              :lot-w="lotInfo.w"
              :lot-h="lotInfo.h"
              :annotations="currentFloorData?.annotations || []"
              :floor-number="activeFloor"
            />
          </div>

          <!-- Annotation panel -->
          <AnnotationPanel
            v-if="currentFloorData?.annotations?.length"
            :annotations="currentFloorData.annotations"
          />

          <!-- Door key bar -->
          <div v-if="currentFloorData?.rooms?.length" class="s2-panel p-3 mb-6 flex items-center gap-4 text-xs font-bold text-sims2-sky">
            <span class="flex items-center gap-1">
              <svg width="16" height="8"><line x1="0" y1="4" x2="6" y2="4" stroke="#555" stroke-width="2" /><path d="M6 4 A4 4 0 0 1 14 4" fill="none" stroke="#777" stroke-width="0.8" stroke-dasharray="2,2" /></svg>
              Door
            </span>
            <span class="flex items-center gap-1">
              <span class="inline-block w-3 h-3 rounded-full bg-emerald-600 border border-white"></span>
              Annotation pin
            </span>
          </div>

          <!-- Legend -->
          <div v-if="currentFloorData?.rooms?.length" class="s2-panel p-4 mb-6">
            <div class="text-xs font-bold text-sims2-sky uppercase tracking-wider mb-3">Room Legend</div>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="(room, i) in currentFloorData.rooms" :key="i"
                class="flex items-center gap-1.5 text-xs font-bold text-sims2-cream"
              >
                <div
                  class="w-3.5 h-3.5 rounded-sm flex-shrink-0"
                  :style="{
                    background: getRoomStyle(room.name).fill,
                    border: `2px solid ${getRoomStyle(room.name).stroke}`
                  }"
                />
                {{ getRoomStyle(room.name).icon }} {{ room.name }}
              </div>
            </div>
          </div>

          <!-- Regenerate button -->
          <button
            @click="generate"
            class="s2-btn s2-btn-green w-full py-4 text-lg flex items-center justify-center gap-3"
          >
            🔄 Regenerate Layout
          </button>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import FloorPlanCanvas from '@/components/FloorPlanCanvas.vue'
import FloorSwitcher from '@/components/FloorSwitcher.vue'
import AnnotationPanel from '@/components/AnnotationPanel.vue'
import { LayoutGrid } from 'lucide-vue-next'
import { LOT_SIZES, STYLES, BUDGETS, HOUSEHOLD, EXTRAS, FEATURES, ROOM_STYLES, DEFAULT_ROOM_STYLE } from '@/data/floorPlanData'
import { generateFloorPlan } from '@/utils/floorPlanGenerator'

const tabs = [
  { id: 'input', icon: '✏️', label: 'Design Your Lot' },
  { id: 'result', icon: '🏗️', label: 'Floor Plan' }
]

const tab = ref('input')
const result = ref(null)
const activeFloor = ref(1)

const form = reactive({
  lotSize: '30×20',
  floors: 1,
  style: 'modern',
  bedrooms: 2,
  bathrooms: 1,
  budget: 'mid',
  household: 'family',
  extras: [],
  features: [],
  notes: ''
})

const lotInfo = computed(() =>
  LOT_SIZES.find(l => l.label === form.lotSize) || LOT_SIZES[3]
)

const styleIcon = computed(() =>
  STYLES.find(s => s.id === result.value?.style)?.icon || '🏠'
)

const currentFloorData = computed(() =>
  result.value?.floorPlans?.find(fp => fp.floor === activeFloor.value) || null
)

const totalRoomCount = computed(() =>
  result.value?.floorPlans?.reduce((sum, fp) => sum + fp.rooms.length, 0) || 0
)

function toggleArray(key, value) {
  const idx = form[key].indexOf(value)
  if (idx >= 0) {
    form[key].splice(idx, 1)
  } else {
    form[key].push(value)
  }
}

function getRoomStyle(name) {
  return ROOM_STYLES[name] || DEFAULT_ROOM_STYLE
}

function generate() {
  result.value = generateFloorPlan({ ...form })
  activeFloor.value = 1
  tab.value = 'result'
}

// ─── Sub-components (inline) ──────────────────────────────────────────────────

</script>

<script>
// Inline child components
const SectionLabel = {
  props: ['icon', 'label'],
  template: `
    <div class="flex items-center gap-2 mb-3 mt-6 first:mt-0">
      <span>{{ icon }}</span>
      <span class="text-xs font-bold text-emerald-700 uppercase tracking-wider font-display">{{ label }}</span>
      <div class="flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent"></div>
    </div>
  `
}

const ChipGroup = {
  props: ['options', 'selected', 'multi'],
  emits: ['toggle'],
  template: `
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="opt in options" :key="opt.id"
        @click="$emit('toggle', opt.id)"
        class="px-3 py-1.5 rounded-full border-2 font-bold text-sm transition-all flex items-center gap-1"
        :class="isSelected(opt.id)
          ? 'bg-emerald-600 text-white border-emerald-700'
          : 'bg-gray-50 text-sims2-cream border-gray-200 hover:border-emerald-300'"
      >
        <span v-if="opt.icon">{{ opt.icon }}</span>
        {{ opt.label }}
      </button>
    </div>
  `,
  methods: {
    isSelected(id) {
      if (this.multi) return this.selected.includes(id)
      return this.selected === id
    }
  }
}

export default {
  components: { SectionLabel, ChipGroup }
}
</script>

<style scoped>
.stepper-btn {
  @apply w-9 h-9 rounded-full border-2 border-gray-200 bg-white text-emerald-700 text-lg font-bold flex items-center justify-center cursor-pointer transition-all hover:bg-emerald-600 hover:text-white hover:border-emerald-700;
}
</style>
