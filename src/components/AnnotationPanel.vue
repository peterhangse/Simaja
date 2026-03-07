<template>
  <div v-if="annotations.length" class="s2-panel p-4 mb-6">
    <div class="text-xs font-bold text-sims2-sky uppercase tracking-wider mb-3">
      📌 Build Notes
    </div>
    <div class="space-y-2">
      <div
        v-for="(ann, i) in annotations" :key="i"
        class="flex items-start gap-3 s2-panel-inner rounded-xl px-3 py-2"
      >
        <!-- Pin number -->
        <div class="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center">
          <span class="text-white font-bold text-xs">{{ i + 1 }}</span>
        </div>

        <div class="flex-1 min-w-0">
          <!-- Room + category -->
          <div class="flex items-center gap-2 flex-wrap mb-0.5">
            <span class="font-bold text-sm text-sims2-cream">{{ ann.room }}</span>
            <span
              v-if="ann.category"
              class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
              :class="categoryClass(ann.category)"
            >
              {{ ann.category }}
            </span>
          </div>
          <!-- Note text -->
          <p class="text-xs text-sims2-sky leading-relaxed">{{ ann.note }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ANNOTATION_CATEGORY_COLORS } from '@/data/floorPlanData'

defineProps({
  annotations: { type: Array, required: true }
})

function categoryClass(category) {
  const cat = ANNOTATION_CATEGORY_COLORS[category]
  if (!cat) return 'bg-gray-100 text-gray-600'
  return `${cat.bg} ${cat.text}`
}
</script>
