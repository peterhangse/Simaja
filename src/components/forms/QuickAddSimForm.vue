<template>
  <div class="space-y-4">
    <p class="text-sm text-gray-500">Snabblägg en Sim med bara namn och hus. Du kan fylla i mer senare.</p>
    
    <!-- Name -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Namn *</label>
      <input
        v-model="form.name"
        type="text"
        placeholder="Simmarens namn"
        class="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
        ref="nameInput"
        @keyup.enter="save"
      />
    </div>
    
    <!-- House -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Hus *</label>
      <select
        v-model="form.houseId"
        class="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
      >
        <option value="">Välj hus...</option>
        <optgroup v-for="world in simsStore.worlds" :key="world.id" :label="world.name">
          <option 
            v-for="house in getWorldHouses(world.id)" 
            :key="house.id" 
            :value="house.id"
          >
            {{ house.name }}
          </option>
        </optgroup>
      </select>
      <p v-if="simsStore.houses.length === 0" class="text-sm text-amber-600 mt-1">
        Du behöver skapa ett hus först!
      </p>
    </div>
    
    <!-- Error message -->
    <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>
    
    <!-- Actions -->
    <div class="flex justify-end gap-3 pt-2">
      <button
        @click="$emit('cancel')"
        class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
      >
        Avbryt
      </button>
      <button
        @click="save"
        :disabled="saving"
        class="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
      >
        {{ saving ? 'Sparar...' : '⚡ Skapa' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useSimsStore } from '@/stores/sims'

const emit = defineEmits(['saved', 'cancel'])

const simsStore = useSimsStore()
const nameInput = ref(null)
const saving = ref(false)
const errorMsg = ref('')

const form = reactive({
  name: '',
  houseId: ''
})

function getWorldHouses(worldId) {
  return simsStore.houses.filter(h => h.worldId === worldId)
}

async function save() {
  errorMsg.value = ''
  
  if (!form.name.trim()) {
    errorMsg.value = 'Du måste ange ett namn'
    return
  }
  
  if (!form.houseId) {
    errorMsg.value = 'Du måste välja ett hus'
    return
  }
  
  saving.value = true
  
  try {
    const simData = {
      name: form.name.trim(),
      houseId: form.houseId,
      // Defaults for everything else
      age: '',
      gender: '',
      traits: [],
      aspiration: '',
      hairColor: '',
      eyeColor: '',
      style: '',
      career: '',
      skills: [],
      notes: ''
    }
    
    const newId = await simsStore.addSim(simData)
    emit('saved', newId)
  } catch (error) {
    console.error('Error saving sim:', error)
    errorMsg.value = 'Något gick fel, försök igen'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  // Focus the name input when modal opens
  setTimeout(() => {
    nameInput.value?.focus()
  }, 100)
})
</script>
