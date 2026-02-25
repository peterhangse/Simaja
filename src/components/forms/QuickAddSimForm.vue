<template>
  <div class="space-y-4">
    <p class="text-sm text-[var(--s2-sky)]">Quickly add a Sim with just a name and house. You can fill in more later.</p>
    
    <!-- Name -->
    <div>
      <label class="block s2-label mb-1">Name *</label>
      <input
        v-model="form.name"
        type="text"
        placeholder="Sim name"
        class="s2-input"
        ref="nameInput"
        @keyup.enter="save"
      />
    </div>
    
    <!-- House -->
    <div>
      <label class="block s2-label mb-1">House *</label>
      <select
        v-model="form.houseId"
        class="s2-input"
      >
        <option value="">Choose house...</option>
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
      <p v-if="simsStore.houses.length === 0" class="text-sm text-amber-400 mt-1">
        You need to create a house first!
      </p>
    </div>
    
    <!-- Error message -->
    <p v-if="errorMsg" class="text-sm text-red-400">{{ errorMsg }}</p>
    
    <!-- Actions -->
    <div class="flex justify-end gap-3 pt-2">
      <button
        @click="$emit('cancel')"
        class="s2-btn s2-btn-ghost px-4 py-2"
      >
        Cancel
      </button>
      <button
        @click="save"
        :disabled="saving"
        class="s2-btn s2-btn-green px-6 py-2 disabled:opacity-50"
      >
        {{ saving ? 'Saving...' : '⚡ Create' }}
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
    errorMsg.value = 'Please enter a name'
    return
  }
  
  if (!form.houseId) {
    errorMsg.value = 'Please choose a house'
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
    errorMsg.value = 'Something went wrong, try again'
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
