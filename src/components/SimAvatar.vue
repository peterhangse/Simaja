<template>
  <div
    class="sim-avatar relative flex-shrink-0 s2-portrait-frame"
    :class="[sizeClasses.wrapper, frameClass]"
  >
    <div
      class="w-full h-full rounded-full overflow-hidden"
      :class="bgClass"
    >
      <img
        v-if="sim?.imageUrl"
        :src="sim.imageUrl"
        :alt="sim?.name"
        class="w-full h-full object-cover"
      />
      <User v-else :size="iconSize" class="w-full h-full flex items-center justify-center p-1" :class="iconColor" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { User } from 'lucide-vue-next'

const props = defineProps({
  sim: { type: Object, default: null },
  size: { type: String, default: 'md', validator: v => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v) }
})

const sizeMap = {
  xs: { wrapper: 'w-8 h-8', icon: 12 },
  sm: { wrapper: 'w-12 h-12', icon: 16 },
  md: { wrapper: 'w-16 h-16', icon: 20 },
  lg: { wrapper: 'w-24 h-24', icon: 32 },
  xl: { wrapper: 'w-32 h-32', icon: 48 }
}

const sizeClasses = computed(() => sizeMap[props.size])
const iconSize = computed(() => sizeMap[props.size].icon)

const isPlanned = computed(() => props.sim?.status === 'planned')
const isActive = computed(() => props.sim && props.sim.status !== 'planned')

const frameClass = computed(() => {
  if (isPlanned.value) return 's2-portrait-frame-amber'
  if (isActive.value) return 's2-portrait-frame-green'
  return ''
})

const bgClass = computed(() => {
  if (props.sim?.imageUrl) return ''
  if (isPlanned.value) return 'bg-gradient-to-br from-amber-800/40 to-amber-900/60'
  return 'bg-gradient-to-br from-sims2-navy to-sims2-panel'
})

const iconColor = computed(() => {
  if (isPlanned.value) return 'text-amber-400'
  return 'text-sims2-sky'
})
</script>

<style scoped>
.sim-avatar {
  border-radius: 9999px;
}
</style>
