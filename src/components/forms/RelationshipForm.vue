<template>
  <form @submit.prevent="saveRelationship" class="space-y-4">
    <!-- Select other Sim -->
    <div>
      <label class="block s2-label mb-1">
        Choose Sim *
      </label>
      <select v-model="form.otherSimId" class="input-field" required>
        <option value="">Choose a Sim...</option>
        <optgroup v-for="world in groupedSims" :key="world.name" :label="world.name">
          <option 
            v-for="s in world.sims" 
            :key="s.id" 
            :value="s.id"
            :disabled="s.id === simId"
          >
            {{ s.name }}{{ s.id === simId ? ' (this Sim)' : '' }}
          </option>
        </optgroup>
      </select>
    </div>

    <!-- Relationship type -->
    <div>
      <label class="block s2-label mb-2">
        Relationship type *
      </label>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="type in relationshipTypes"
          :key="type.value"
          type="button"
          @click="form.type = type.value"
          class="px-3 py-2 rounded-xl text-sm transition-all flex flex-col items-center"
          :class="form.type === type.value 
            ? `${type.bgActive} ${type.textActive} ring-2 ring-offset-1 ring-offset-transparent ${type.ring}` 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >
          <span class="text-lg">{{ type.icon }}</span>
          <span>{{ type.label }}</span>
        </button>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 pt-4">
      <button
        type="button"
        @click="$emit('cancel')"
        class="flex-1 s2-btn s2-btn-ghost py-3 px-4"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="isSaving || !form.otherSimId || !form.type"
        class="flex-1 s2-btn s2-btn-green py-3 px-4 disabled:opacity-50"
      >
        {{ isSaving ? 'Saving...' : 'Save relationship' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useSimsStore } from '@/stores/sims'

const props = defineProps({
  simId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['saved', 'cancel'])

const simsStore = useSimsStore()

const isSaving = ref(false)

const form = reactive({
  otherSimId: '',
  type: ''
})

const relationshipTypes = [
  { value: 'parent', label: 'Parent', icon: '👨‍👩‍👧', bgActive: 'bg-green-100', textActive: 'text-green-700', ring: 'ring-green-400' },
  { value: 'child', label: 'Child', icon: '👶', bgActive: 'bg-green-100', textActive: 'text-green-700', ring: 'ring-green-400' },
  { value: 'sibling', label: 'Sibling', icon: '👫', bgActive: 'bg-green-100', textActive: 'text-green-700', ring: 'ring-green-400' },
  { value: 'spouse', label: 'Spouse', icon: '💕', bgActive: 'bg-pink-100', textActive: 'text-pink-700', ring: 'ring-pink-400' },
  { value: 'ex', label: 'Ex', icon: '💔', bgActive: 'bg-pink-100', textActive: 'text-pink-700', ring: 'ring-pink-400' },
  { value: 'friend', label: 'Friend', icon: '🤝', bgActive: 'bg-blue-100', textActive: 'text-blue-700', ring: 'ring-blue-400' },
  { value: 'enemy', label: 'Enemy', icon: '😠', bgActive: 'bg-red-100', textActive: 'text-red-700', ring: 'ring-red-400' },
  { value: 'roommate', label: 'Roommate', icon: '🏠', bgActive: 'bg-yellow-100', textActive: 'text-yellow-700', ring: 'ring-yellow-400' },
  { value: 'mentor', label: 'Mentor', icon: '🎓', bgActive: 'bg-purple-100', textActive: 'text-purple-700', ring: 'ring-purple-400' }
]

// Group sims by world
const groupedSims = computed(() => {
  const groups = []
  
  for (const world of simsStore.worlds) {
    const worldHouses = simsStore.houses.filter(h => h.worldId === world.id)
    const worldSims = simsStore.sims.filter(s => worldHouses.some(h => h.id === s.houseId))
    
    if (worldSims.length > 0) {
      groups.push({
        name: world.name,
        sims: worldSims
      })
    }
  }
  
  // Add sims without a house
  const simsWithoutHouse = simsStore.sims.filter(s => !s.houseId)
  if (simsWithoutHouse.length > 0) {
    groups.push({
      name: 'No house',
      sims: simsWithoutHouse
    })
  }
  
  return groups
})

async function saveRelationship() {
  if (!form.otherSimId || !form.type) return

  isSaving.value = true

  try {
    await simsStore.addRelationship({
      sim1Id: props.simId,
      sim2Id: form.otherSimId,
      type: form.type,
      startDate: new Date().toISOString()
    })

    emit('saved')
  } catch (error) {
    console.error('Error saving relationship:', error)
  } finally {
    isSaving.value = false
  }
}
</script>
