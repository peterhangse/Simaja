<template>
  <div class="min-h-screen">
    <AppHeader />

    <main class="max-w-7xl mx-auto px-4 py-8 relative z-[1]">
      <!-- Page header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-3xl font-bold text-sims2-gold font-display"><Users :size="28" class="inline text-purple-400" /> All Sims</h2>
          <p class="text-sims2-sky mt-1">{{ simsStore.activeSims.length }} active<span v-if="simsStore.plannedSims.length">, {{ simsStore.plannedSims.length }} planned</span></p>
        </div>
        <div class="flex gap-2">
          <button
            @click="showQuickAddModal = true"
            class="s2-btn px-3 py-3"
            title="Quick Add Sim"
          >
            <Zap :size="16" />
          </button>
          <button
            @click="showImportModal = true"
            class="s2-btn flex items-center gap-2 px-5 py-3"
          >
            <Camera :size="16" /> Import
          </button>
          <button
            @click="showAddModal = true"
            class="s2-btn s2-btn-green flex items-center gap-2"
          >
            <span>+</span> New Sim
          </button>
        </div>
      </div>

      <!-- Status tabs -->
      <div class="flex gap-2 mb-4">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          @click="statusFilter = tab.value"
          class="px-4 py-2 rounded-lg text-sm font-bold transition-all border-2"
          :class="statusFilter === tab.value
            ? 'bg-sims2-navy border-sims2-sky text-white shadow-md shadow-sims2-sky/20'
            : 'bg-sims2-panel/60 text-sims2-sky border-transparent hover:border-sims2-sky/30'"
        >
          {{ tab.icon }} {{ tab.label }}
          <span class="ml-1 opacity-70">({{ tab.count }})</span>
        </button>
      </div>

      <!-- Filters -->
      <div class="s2-panel p-4 mb-6 space-y-3">
        <!-- Primary filters row -->
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex items-center gap-2">
            <Globe :size="16" class="text-sims2-sky" />
            <select v-model="filterWorld" class="s2-select">
              <option value="">All worlds</option>
              <option v-for="world in simsStore.worlds" :key="world.id" :value="world.id">
                {{ world.name }}
              </option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <User :size="16" class="text-sims2-sky" />
            <select v-model="filterAge" class="s2-select">
              <option value="">All ages</option>
              <option v-for="age in ageOptions" :key="age" :value="age">{{ age }}</option>
            </select>
          </div>
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name..."
              class="w-full px-4 py-2 rounded-lg bg-black/30 border-2 border-sims2-sky/20 text-sims2-cream placeholder-sims2-sky/50 focus:border-sims2-sky/50 outline-none"
            />
          </div>
          <button 
            @click="showMoreFilters = !showMoreFilters"
            class="text-sm text-sims2-sky hover:text-sims2-gold flex items-center gap-1"
          >
            More filters {{ showMoreFilters ? '▲' : '▼' }}
            <span v-if="activeFilterCount > 0" class="ml-1 w-5 h-5 bg-purple-500/30 text-purple-300 rounded-full text-xs flex items-center justify-center">
              {{ activeFilterCount }}
            </span>
          </button>
        </div>
        
        <!-- Expandable advanced filters -->
        <div v-if="showMoreFilters" class="flex flex-wrap gap-4 items-center pt-3 border-t border-sims2-sky/10">
          <div class="flex items-center gap-2">
            <span class="text-sims2-sky">⚥</span>
            <select v-model="filterGender" class="s2-select">
              <option value="">All genders</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <Heart :size="16" class="text-sims2-sky" />
            <select v-model="filterRelations" class="s2-select">
              <option value="">All</option>
              <option value="has">Has relationships</option>
              <option value="none">No relationships</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <ArrowUpDown :size="16" class="text-sims2-sky" />
            <select v-model="sortBy" class="s2-select">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </div>
          <button 
            v-if="activeFilterCount > 0"
            @click="clearFilters"
            class="text-sm text-red-400 hover:text-red-300"
          >
            Clear filters
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filteredSims.length === 0" class="text-center py-12 s2-panel">
        <User :size="48" class="mx-auto text-sims2-sky opacity-50" />
        <h3 class="text-xl font-bold text-sims2-gold mt-4 mb-2">
          {{ simsStore.sims.length === 0 ? 'No Sims yet' : 'No Sims match the filter' }}
        </h3>
        <p class="text-sims2-sky mb-6">
          {{ simsStore.sims.length === 0 ? 'Add your first Sim!' : 'Try a different filter.' }}
        </p>
        <button 
          v-if="simsStore.sims.length === 0"
          @click="showAddModal = true"
          class="s2-btn"
        >
          Create first Sim
        </button>
      </div>

      <!-- Sims grid -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <router-link
          v-for="sim in filteredSims"
          :key="sim.id"
          :to="`/sims/${sim.id}`"
          class="s2-card overflow-hidden group"
        >
          <!-- Sim image -->
          <div class="h-32 bg-gradient-to-br from-sims2-navy to-sims2-panel relative overflow-hidden">
            <img 
              v-if="sim.imageUrl" 
              :src="sim.imageUrl" 
              :alt="sim.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <span v-else class="absolute inset-0 flex items-center justify-center"><User :size="36" class="text-sims2-sky opacity-40" /></span>
          </div>

          <!-- Sim info -->
          <div class="p-3">
            <div class="flex items-center gap-1">
              <h3 class="font-bold text-sims2-cream truncate">{{ sim.name }}</h3>
              <span v-if="sim.status === 'planned'" class="flex-shrink-0 px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px] font-semibold"><CloudCog :size="10" class="inline" /></span>
            </div>
            <p class="text-sm text-sims2-sky">{{ sim.age || 'Unknown age' }}</p>
            
            <!-- World/House info -->
            <div class="mt-2 text-xs text-sims2-sky/60">
              <span v-if="sim.status === 'planned' && !getHouseInfo(sim.houseId)" class="text-amber-400 flex items-center gap-1"><CloudCog :size="12" /> Planned</span>
              <span v-else-if="getHouseInfo(sim.houseId)" class="flex items-center gap-1"><Home :size="12" /> {{ getHouseInfo(sim.houseId).house.name }}</span>
            </div>

            <!-- Traits preview -->
            <div v-if="sim.traits?.length" class="mt-2 flex flex-wrap gap-1">
              <span 
                v-for="trait in sim.traits.slice(0, 2)" 
                :key="trait"
                class="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs"
              >
                {{ trait }}
              </span>
              <span v-if="sim.traits.length > 2" class="text-xs text-sims2-sky/50">
                +{{ sim.traits.length - 2 }}
              </span>
            </div>
          </div>
        </router-link>
      </div>
    </main>

    <!-- Add Sim Modal -->
    <Modal v-model="showAddModal" title="Add Sim">
      <SimForm @saved="onSimSaved" @cancel="showAddModal = false" />
    </Modal>

    <!-- Quick Add Sim Modal -->
    <Modal v-model="showQuickAddModal" title="Quick Add Sim">
      <QuickAddSimForm @saved="onQuickAddSaved" @cancel="showQuickAddModal = false" />
    </Modal>

    <!-- Import from Screenshot Modal -->
    <Modal v-model="showImportModal" title="Import from screenshot">
      <ScreenshotImportForm @imported="onSimImported" @cancel="showImportModal = false" />
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSimsStore } from '@/stores/sims'
import AppHeader from '@/components/AppHeader.vue'
import Modal from '@/components/Modal.vue'
import SimForm from '@/components/forms/SimForm.vue'
import QuickAddSimForm from '@/components/forms/QuickAddSimForm.vue'
import ScreenshotImportForm from '@/components/forms/ScreenshotImportForm.vue'
import { getAgeOptions } from '@/data/sims4Data'
import { Users, User, Globe, Home, Heart, Camera, Zap, CloudCog, ArrowUpDown } from 'lucide-vue-next'

const simsStore = useSimsStore()
const router = useRouter()

const showAddModal = ref(false)
const showQuickAddModal = ref(false)
const showImportModal = ref(false)
const showMoreFilters = ref(false)
const statusFilter = ref('all')

const statusTabs = computed(() => [
  { value: 'all', label: 'All', icon: '👥', count: simsStore.sims.length },
  { value: 'active', label: 'Active', icon: '🟢', count: simsStore.activeSims.length },
  { value: 'planned', label: 'Planned', icon: '💭', count: simsStore.plannedSims.length }
])

// Primary filters
const filterWorld = ref('')
const filterAge = ref('')
const searchQuery = ref('')

// Advanced filters
const filterGender = ref('')
const filterRelations = ref('')
const sortBy = ref('newest')

const ageOptions = getAgeOptions()

// Check for filter from dashboard insights link
onMounted(() => {
  const savedFilter = localStorage.getItem('simaja_filter_relations')
  if (savedFilter) {
    filterRelations.value = savedFilter
    showMoreFilters.value = true
    localStorage.removeItem('simaja_filter_relations')
  }
  const savedStatus = localStorage.getItem('simaja_filter_status')
  if (savedStatus) {
    statusFilter.value = savedStatus
    localStorage.removeItem('simaja_filter_status')
  }
})

// Count active advanced filters
const activeFilterCount = computed(() => {
  let count = 0
  if (filterGender.value) count++
  if (filterRelations.value) count++
  if (sortBy.value !== 'newest') count++
  return count
})

function clearFilters() {
  filterGender.value = ''
  filterRelations.value = ''
  sortBy.value = 'newest'
}

const filteredSims = computed(() => {
  let result = [...simsStore.sims]

  // Filter by status tab
  if (statusFilter.value === 'active') {
    result = result.filter(s => s.status !== 'planned')
  } else if (statusFilter.value === 'planned') {
    result = result.filter(s => s.status === 'planned')
  }

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

  // Filter by gender
  if (filterGender.value) {
    result = result.filter(s => s.gender === filterGender.value)
  }

  // Filter by relationships
  if (filterRelations.value) {
    const simsWithRelations = new Set()
    simsStore.relationships.forEach(r => {
      simsWithRelations.add(r.sim1Id)
      simsWithRelations.add(r.sim2Id)
    })
    
    if (filterRelations.value === 'has') {
      result = result.filter(s => simsWithRelations.has(s.id))
    } else if (filterRelations.value === 'none') {
      result = result.filter(s => !simsWithRelations.has(s.id))
    }
  }

  // Sort
  switch (sortBy.value) {
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      break
    case 'oldest':
      result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
      break
    case 'name-asc':
      result.sort((a, b) => a.name.localeCompare(b.name, 'en'))
      break
    case 'name-desc':
      result.sort((a, b) => b.name.localeCompare(a.name, 'en'))
      break
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

function onQuickAddSaved(simId) {
  showQuickAddModal.value = false
  // Navigate to the new sim's profile so user can fill in more
  if (simId) {
    router.push(`/sims/${simId}`)
  }
}

function onSimImported() {
  showImportModal.value = false
}
</script>
