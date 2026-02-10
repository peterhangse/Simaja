<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
    <AppHeader />

    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Page header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-3xl font-bold text-gray-800">👤 Alla Simar</h2>
          <p class="text-gray-500 mt-1">{{ simsStore.sims.length }} Simar totalt</p>
        </div>
        <div class="flex gap-3">
          <button
            @click="showImportModal = true"
            class="px-5 py-3 bg-white text-gray-700 font-semibold rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition-all flex items-center gap-2"
          >
            <span>📸</span> Importera
          </button>
          <button
            @click="showAddModal = true"
            class="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <span>+</span> Ny Sim
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl p-4 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div class="flex items-center gap-2">
          <span class="text-gray-500">🌍</span>
          <select v-model="filterWorld" class="px-3 py-2 rounded-lg border border-gray-200">
            <option value="">Alla världar</option>
            <option v-for="world in simsStore.worlds" :key="world.id" :value="world.id">
              {{ world.name }}
            </option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-gray-500">👤</span>
          <select v-model="filterAge" class="px-3 py-2 rounded-lg border border-gray-200">
            <option value="">Alla åldrar</option>
            <option v-for="age in ageOptions" :key="age" :value="age">{{ age }}</option>
          </select>
        </div>
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Sök på namn..."
            class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 outline-none"
          />
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filteredSims.length === 0" class="text-center py-12 bg-white rounded-2xl shadow-sm">
        <span class="text-6xl">👤</span>
        <h3 class="text-xl font-bold text-gray-800 mt-4 mb-2">
          {{ simsStore.sims.length === 0 ? 'Inga Simar ännu' : 'Inga Simar matchar filtret' }}
        </h3>
        <p class="text-gray-500 mb-6">
          {{ simsStore.sims.length === 0 ? 'Lägg till din första Sim!' : 'Prova ett annat filter.' }}
        </p>
        <button 
          v-if="simsStore.sims.length === 0"
          @click="showAddModal = true"
          class="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg"
        >
          Skapa första Sim
        </button>
      </div>

      <!-- Sims grid -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <router-link
          v-for="sim in filteredSims"
          :key="sim.id"
          :to="`/sims/${sim.id}`"
          class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all group"
        >
          <!-- Sim image -->
          <div class="h-32 bg-gradient-to-br from-purple-200 to-purple-300 relative overflow-hidden">
            <img 
              v-if="sim.imageUrl" 
              :src="sim.imageUrl" 
              :alt="sim.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <span v-else class="absolute inset-0 flex items-center justify-center text-5xl opacity-50">👤</span>
          </div>

          <!-- Sim info -->
          <div class="p-3">
            <h3 class="font-bold text-gray-800 truncate">{{ sim.name }}</h3>
            <p class="text-sm text-gray-500">{{ sim.age || 'Okänd ålder' }}</p>
            
            <!-- World/House info -->
            <div class="mt-2 text-xs text-gray-400">
              <span v-if="getHouseInfo(sim.houseId)">
                🏠 {{ getHouseInfo(sim.houseId).house.name }}
              </span>
            </div>

            <!-- Traits preview -->
            <div v-if="sim.traits?.length" class="mt-2 flex flex-wrap gap-1">
              <span 
                v-for="trait in sim.traits.slice(0, 2)" 
                :key="trait"
                class="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs"
              >
                {{ trait }}
              </span>
              <span v-if="sim.traits.length > 2" class="text-xs text-gray-400">
                +{{ sim.traits.length - 2 }}
              </span>
            </div>
          </div>
        </router-link>
      </div>
    </main>

    <!-- Add Sim Modal -->
    <Modal v-model="showAddModal" title="Lägg till Sim">
      <SimForm @saved="onSimSaved" @cancel="showAddModal = false" />
    </Modal>

    <!-- Import from Screenshot Modal -->
    <Modal v-model="showImportModal" title="Importera från screenshot">
      <ScreenshotImportForm @imported="onSimImported" @cancel="showImportModal = false" />
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSimsStore } from '@/stores/sims'
import AppHeader from '@/components/AppHeader.vue'
import Modal from '@/components/Modal.vue'
import SimForm from '@/components/forms/SimForm.vue'
import ScreenshotImportForm from '@/components/forms/ScreenshotImportForm.vue'
import { getAgeOptions } from '@/data/sims4Data'

const simsStore = useSimsStore()

const showAddModal = ref(false)
const showImportModal = ref(false)
const filterWorld = ref('')
const filterAge = ref('')
const searchQuery = ref('')

const ageOptions = getAgeOptions()

const filteredSims = computed(() => {
  let result = [...simsStore.sims]

  // Filter by world
  if (filterWorld.value) {
    const worldHouses = simsStore.houses
      .filter(h => h.worldId === filterWorld.value)
      .map(h => h.id)
    result = result.filter(s => worldHouses.includes(s.houseId))
  }

  // Filter by age
  if (filterAge.value) {
    result = result.filter(s => s.age === filterAge.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(s => s.name.toLowerCase().includes(query))
  }

  return result
})

function getHouseInfo(houseId) {
  const house = simsStore.houses.find(h => h.id === houseId)
  if (!house) return null
  const world = simsStore.worlds.find(w => w.id === house.worldId)
  return { house, world }
}

function onSimSaved() {
  showAddModal.value = false
}

function onSimImported() {
  showImportModal.value = false
}
</script>
