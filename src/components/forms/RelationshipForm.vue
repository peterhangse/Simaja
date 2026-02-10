<template>
  <form @submit.prevent="saveRelationship" class="space-y-4">
    <!-- Select other Sim -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Välj Sim *
      </label>
      <select v-model="form.otherSimId" class="input-field" required>
        <option value="">Välj en Sim...</option>
        <optgroup v-for="world in groupedSims" :key="world.name" :label="world.name">
          <option 
            v-for="s in world.sims" 
            :key="s.id" 
            :value="s.id"
            :disabled="s.id === simId"
          >
            {{ s.name }}{{ s.id === simId ? ' (denna Sim)' : '' }}
          </option>
        </optgroup>
      </select>
    </div>

    <!-- Relationship type -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Relationstyp *
      </label>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="type in relationshipTypes"
          :key="type.value"
          type="button"
          @click="form.type = type.value"
          class="px-3 py-2 rounded-xl text-sm transition-all flex flex-col items-center"
          :class="form.type === type.value 
            ? `${type.bgActive} ${type.textActive} ring-2 ring-offset-1 ${type.ring}` 
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
        class="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
      >
        Avbryt
      </button>
      <button
        type="submit"
        :disabled="isSaving || !form.otherSimId || !form.type"
        class="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
      >
        {{ isSaving ? 'Sparar...' : 'Spara relation' }}
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
  { value: 'parent', label: 'Förälder', icon: '👨‍👩‍👧', bgActive: 'bg-green-100', textActive: 'text-green-700', ring: 'ring-green-400' },
  { value: 'child', label: 'Barn', icon: '👶', bgActive: 'bg-green-100', textActive: 'text-green-700', ring: 'ring-green-400' },
  { value: 'sibling', label: 'Syskon', icon: '👫', bgActive: 'bg-green-100', textActive: 'text-green-700', ring: 'ring-green-400' },
  { value: 'spouse', label: 'Partner', icon: '💕', bgActive: 'bg-pink-100', textActive: 'text-pink-700', ring: 'ring-pink-400' },
  { value: 'ex', label: 'Ex', icon: '💔', bgActive: 'bg-pink-100', textActive: 'text-pink-400', ring: 'ring-pink-300' },
  { value: 'friend', label: 'Vän', icon: '🤝', bgActive: 'bg-blue-100', textActive: 'text-blue-700', ring: 'ring-blue-400' },
  { value: 'enemy', label: 'Fiende', icon: '😠', bgActive: 'bg-red-100', textActive: 'text-red-700', ring: 'ring-red-400' },
  { value: 'roommate', label: 'Roomie', icon: '🏠', bgActive: 'bg-yellow-100', textActive: 'text-yellow-700', ring: 'ring-yellow-400' },
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
      name: 'Utan hus',
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

<style scoped>
.input-field {
  @apply w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none;
}
</style>
