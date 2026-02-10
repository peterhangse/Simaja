<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
    <AppHeader />

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Welcome message -->
      <div class="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <h2 class="text-3xl font-bold mb-2">
          Hej {{ authStore.userName }}! 👋
        </h2>
        <p class="text-green-100 text-lg">
          Välkommen tillbaka till din Sims-värld. Vad vill du göra idag?
        </p>
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="stat-card bg-green-50 border-green-200">
          <span class="text-4xl">🌍</span>
          <div class="mt-2">
            <p class="text-3xl font-bold text-green-700">{{ simsStore.worlds.length }}</p>
            <p class="text-sm text-green-600">Världar</p>
          </div>
        </div>
        <div class="stat-card bg-blue-50 border-blue-200">
          <span class="text-4xl">🏠</span>
          <div class="mt-2">
            <p class="text-3xl font-bold text-blue-700">{{ simsStore.houses.length }}</p>
            <p class="text-sm text-blue-600">Hus</p>
          </div>
        </div>
        <div class="stat-card bg-purple-50 border-purple-200">
          <span class="text-4xl">👤</span>
          <div class="mt-2">
            <p class="text-3xl font-bold text-purple-700">{{ simsStore.sims.length }}</p>
            <p class="text-sm text-purple-600">Simar</p>
          </div>
        </div>
        <div class="stat-card bg-pink-50 border-pink-200">
          <span class="text-4xl">💕</span>
          <div class="mt-2">
            <p class="text-3xl font-bold text-pink-700">{{ simsStore.relationships.length }}</p>
            <p class="text-sm text-pink-600">Relationer</p>
          </div>
        </div>
      </div>

      <!-- Quick actions -->
      <h3 class="text-xl font-bold text-gray-800 mb-4">Snabbåtgärder</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          @click="showAddWorldModal = true"
          class="action-card hover:border-green-400 hover:bg-green-50"
        >
          <span class="text-3xl">🌍</span>
          <span class="font-semibold text-gray-700">Skapa ny värld</span>
        </button>
        <button 
          @click="showAddSimModal = true"
          class="action-card hover:border-purple-400 hover:bg-purple-50"
        >
          <span class="text-3xl">👤</span>
          <span class="font-semibold text-gray-700">Lägg till Sim</span>
        </button>
        <router-link 
          to="/family-tree"
          class="action-card hover:border-pink-400 hover:bg-pink-50"
        >
          <span class="text-3xl">🌳</span>
          <span class="font-semibold text-gray-700">Visa släktträd</span>
        </router-link>
      </div>

      <!-- Recent Sims -->
      <div v-if="simsStore.sims.length > 0" class="mt-8">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Senaste Simar</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <router-link
            v-for="sim in recentSims"
            :key="sim.id"
            :to="`/sims/${sim.id}`"
            class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-200 to-emerald-300 flex items-center justify-center mb-2 overflow-hidden">
              <img v-if="sim.imageUrl" :src="sim.imageUrl" :alt="sim.name" class="w-full h-full object-cover" />
              <span v-else class="text-2xl">👤</span>
            </div>
            <p class="font-semibold text-gray-800 truncate">{{ sim.name }}</p>
            <p class="text-xs text-gray-500">{{ sim.age }}</p>
          </router-link>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="mt-8 text-center py-12 bg-white rounded-2xl shadow-sm">
        <span class="text-6xl">🎮</span>
        <h3 class="text-xl font-bold text-gray-800 mt-4 mb-2">Dags att börja!</h3>
        <p class="text-gray-500 mb-6">
          Skapa din första värld och börja fylla den med Simar.
        </p>
        <button 
          @click="showAddWorldModal = true"
          class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          Skapa första världen 🌍
        </button>
      </div>
      
      <!-- Insights section (collapsed by default) -->
      <div v-if="simsStore.sims.length > 0 && totalInsights > 0" class="mt-8">
        <button 
          @click="showInsights = !showInsights"
          class="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <span>💡</span>
          <span class="text-sm">Visa insikter</span>
          <span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{{ totalInsights }}</span>
          <span class="text-xs">{{ showInsights ? '▲' : '▼' }}</span>
        </button>
        
        <div v-if="showInsights" class="mt-4 bg-white rounded-xl p-4 shadow-sm">
          <h4 class="text-sm font-semibold text-gray-600 mb-3">Att kolla på</h4>
          <ul class="space-y-2">
            <li v-if="insights.simsWithoutRelations.length > 0">
              <router-link 
                to="/sims" 
                class="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
                @click="setNoRelationsFilter"
              >
                <span class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs">
                  {{ insights.simsWithoutRelations.length }}
                </span>
                <span>Simar utan relationer</span>
                <span class="text-gray-400">→</span>
              </router-link>
            </li>
            <li v-if="insights.elderSims.length > 0">
              <router-link 
                to="/sims" 
                class="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
              >
                <span class="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-xs">
                  {{ insights.elderSims.length }}
                </span>
                <span>Äldre Simar (kan dö snart)</span>
                <span class="text-gray-400">→</span>
              </router-link>
            </li>
            <li v-if="insights.incompleteSims.length > 0">
              <router-link 
                to="/sims" 
                class="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
              >
                <span class="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs">
                  {{ insights.incompleteSims.length }}
                </span>
                <span>Ofullständiga profiler</span>
                <span class="text-gray-400">→</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </main>

    <!-- Add World Modal -->
    <Modal v-model="showAddWorldModal" title="Skapa ny värld">
      <WorldForm @saved="onWorldSaved" @cancel="showAddWorldModal = false" />
    </Modal>

    <!-- Add Sim Modal -->
    <Modal v-model="showAddSimModal" title="Lägg till Sim">
      <SimForm @saved="onSimSaved" @cancel="showAddSimModal = false" @import="switchToImport" />
    </Modal>

    <!-- Import from Screenshot Modal -->
    <Modal v-model="showImportModal" title="Importera från screenshot">
      <ScreenshotImportForm @imported="onSimImported" @cancel="showImportModal = false" />
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSimsStore } from '@/stores/sims'
import AppHeader from '@/components/AppHeader.vue'
import Modal from '@/components/Modal.vue'
import WorldForm from '@/components/forms/WorldForm.vue'
import SimForm from '@/components/forms/SimForm.vue'
import ScreenshotImportForm from '@/components/forms/ScreenshotImportForm.vue'

const authStore = useAuthStore()
const simsStore = useSimsStore()

const showAddWorldModal = ref(false)
const showAddSimModal = ref(false)
const showImportModal = ref(false)
const showInsights = ref(false)

const recentSims = computed(() => {
  return [...simsStore.sims]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6)
})

// Insights computations
const insights = computed(() => {
  // Find sims without any relationships
  const simsWithRelations = new Set()
  simsStore.relationships.forEach(r => {
    simsWithRelations.add(r.sim1Id)
    simsWithRelations.add(r.sim2Id)
  })
  const simsWithoutRelations = simsStore.sims.filter(s => !simsWithRelations.has(s.id))
  
  // Find elder sims
  const elderSims = simsStore.sims.filter(s => 
    s.age === 'Äldre' || s.age === 'Elder'
  )
  
  // Find incomplete profiles (missing key info)
  const incompleteSims = simsStore.sims.filter(s => {
    const missingFields = !s.age || !s.gender || (s.traits?.length || 0) === 0
    return missingFields
  })
  
  return {
    simsWithoutRelations,
    elderSims,
    incompleteSims
  }
})

const totalInsights = computed(() => {
  return insights.value.simsWithoutRelations.length + 
         insights.value.elderSims.length + 
         insights.value.incompleteSims.length
})

function setNoRelationsFilter() {
  // This will be picked up by SimsView via router query or localStorage
  localStorage.setItem('simaja_filter_relations', 'none')
}

onMounted(async () => {
  await simsStore.initializeData()
})

function onWorldSaved() {
  showAddWorldModal.value = false
}

function onSimSaved() {
  showAddSimModal.value = false
}

function switchToImport() {
  showAddSimModal.value = false
  showImportModal.value = true
}

function onSimImported() {
  showImportModal.value = false
}
</script>

<style scoped>
.stat-card {
  @apply flex items-center gap-4 p-6 rounded-2xl border-2 shadow-sm;
}

.action-card {
  @apply flex flex-col items-center gap-2 p-6 bg-white rounded-2xl border-2 border-gray-200 shadow-sm transition-all cursor-pointer;
}
</style>
