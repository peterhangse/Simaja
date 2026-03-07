<template>
  <div v-if="floorPlans.length > 1" class="flex gap-2 mb-4">
    <button
      v-for="fp in floorPlans" :key="fp.floor"
      @click="$emit('update:activeFloor', fp.floor)"
      class="flex-1 py-2.5 px-4 rounded-xl font-bold text-sm tracking-wide uppercase transition-all border-2"
      :class="activeFloor === fp.floor
        ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
        : 's2-panel-inner border-transparent hover:border-emerald-200 text-sims2-cream'"
    >
      <span class="mr-1">{{ fp.floor === 1 ? '🏠' : '⬆️' }}</span>
      {{ fp.label }}
      <span class="ml-1 text-xs opacity-70">({{ fp.rooms.length }})</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  floorPlans: { type: Array, required: true },
  activeFloor: { type: Number, required: true }
})

defineEmits(['update:activeFloor'])
</script>
