<template>
  <div class="min-h-screen">
    <AppHeader />

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 py-8 relative z-[1]">
      <!-- Welcome message -->
      <div class="s2-panel p-8 mb-8">
        <div class="flex items-center gap-3 mb-2">
          <h2 class="text-3xl font-bold text-sims2-gold-light font-display">
            Hey {{ authStore.userName }}!
          </h2>
          <Hand :size="28" class="text-sims2-gold" />
        </div>
        <p class="text-sims2-sky text-lg">
          Welcome back to your Sims world. What would you like to do today?
        </p>
      </div>

      <!-- Stats cards — Sims 2 need bars -->
      <div class="s2-panel p-5 mb-8">
        <h3 class="s2-section-title text-sm uppercase tracking-wider mb-4">Household Status</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <router-link to="/worlds" class="s2-panel-inner p-4 hover:bg-white/5 transition-colors cursor-pointer block">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <Globe :size="16" class="text-green-400" />
                <span class="text-sm font-bold text-sims2-cream">Worlds</span>
              </div>
              <span class="text-lg font-bold text-green-400">{{ simsStore.worlds.length }}</span>
            </div>
            <div class="s2-need-bar">
              <div class="s2-need-bar-fill fill-green" :style="{ width: Math.min(100, Math.max(4, (simsStore.worlds.length / 10) * 100)) + '%' }"></div>
            </div>
          </router-link>
          <router-link to="/worlds" class="s2-panel-inner p-4 hover:bg-white/5 transition-colors cursor-pointer block">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <Home :size="16" class="text-blue-400" />
                <span class="text-sm font-bold text-sims2-cream">Houses</span>
              </div>
              <span class="text-lg font-bold text-blue-400">{{ simsStore.houses.length }}</span>
            </div>
            <div class="s2-need-bar">
              <div class="s2-need-bar-fill fill-blue" :style="{ width: Math.min(100, Math.max(4, (simsStore.houses.length / 20) * 100)) + '%' }"></div>
            </div>
          </router-link>
          <router-link to="/sims" class="s2-panel-inner p-4 hover:bg-white/5 transition-colors cursor-pointer block">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <Users :size="16" class="text-purple-400" />
                <span class="text-sm font-bold text-sims2-cream">Sims</span>
              </div>
              <span class="text-lg font-bold text-purple-400">{{ simsStore.sims.length }}</span>
            </div>
            <div class="s2-need-bar">
              <div class="s2-need-bar-fill fill-purple" :style="{ width: Math.min(100, Math.max(4, (simsStore.sims.length / 50) * 100)) + '%' }"></div>
            </div>
          </router-link>
          <router-link to="/family-tree" class="s2-panel-inner p-4 hover:bg-white/5 transition-colors cursor-pointer block">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <Heart :size="16" class="text-pink-400" />
                <span class="text-sm font-bold text-sims2-cream">Relationships</span>
              </div>
              <span class="text-lg font-bold text-pink-400">{{ simsStore.relationships.length }}</span>
            </div>
            <div class="s2-need-bar">
              <div class="s2-need-bar-fill fill-pink" :style="{ width: Math.min(100, Math.max(4, (simsStore.relationships.length / 30) * 100)) + '%' }"></div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="s2-panel p-5 mb-8">
        <h3 class="s2-section-title text-sm uppercase tracking-wider mb-4">Quick Actions</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            @click="showAddWorldModal = true"
            class="s2-btn s2-btn-green flex items-center justify-center gap-3 py-4"
          >
            <Globe :size="22" />
            <span>Create new world</span>
          </button>
          <button 
            @click="showAddSimModal = true"
            class="s2-btn flex items-center justify-center gap-3 py-4"
          >
            <UserPlus :size="22" />
            <span>Add Sim</span>
          </button>
          <router-link 
            to="/family-tree"
            class="s2-btn s2-btn-gold flex items-center justify-center gap-3 py-4 no-underline"
          >
            <GitBranch :size="22" />
            <span>View family tree</span>
          </router-link>
        </div>
      </div>

      <!-- Recent Sims -->
      <div v-if="simsStore.sims.length > 0" class="s2-panel p-5 mb-8">
        <h3 class="s2-section-title text-sm uppercase tracking-wider mb-4">Recent Sims</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <router-link
            v-for="sim in recentSims"
            :key="sim.id"
            :to="`/sims/${sim.id}`"
            class="s2-panel-inner p-4 hover:bg-white/5 transition-all text-center block"
          >
            <div class="w-16 h-16 mx-auto mb-2 s2-portrait-frame" :class="sim.status === 'planned' ? 's2-portrait-frame-amber' : 's2-portrait-frame-green'">
              <SimAvatar :sim="sim" size="md" />
            </div>
            <p class="font-bold text-sims2-cream truncate text-sm">{{ sim.name }}</p>
            <p class="text-xs text-sims2-sky">{{ sim.age }}</p>
          </router-link>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="s2-panel p-12 text-center mb-8">
        <Gamepad2 :size="48" class="mx-auto text-sims2-sky opacity-50" />
        <h3 class="text-xl font-bold text-sims2-gold mt-4 mb-2">Time to get started!</h3>
        <p class="text-sims2-sky mb-6">
          Create your first world and start filling it with Sims.
        </p>
        <button 
          @click="showAddWorldModal = true"
          class="s2-btn s2-btn-green inline-flex items-center gap-2 px-8 py-3"
        >
          <Globe :size="18" /> Create first world
        </button>
      </div>
      
      <!-- Insights section (collapsed by default) -->
      <div v-if="simsStore.sims.length > 0 && totalInsights > 0" class="mt-0">
        <button 
          @click="showInsights = !showInsights"
          class="flex items-center gap-2 text-sims2-sky hover:text-sims2-gold transition-colors"
        >
          <Lightbulb :size="16" />
          <span class="text-sm">Show insights</span>
          <span class="px-2 py-0.5 bg-white/10 text-sims2-sky rounded-full text-xs">{{ totalInsights }}</span>
          <span class="text-xs">{{ showInsights ? '▲' : '▼' }}</span>
        </button>
        
        <div v-if="showInsights" class="mt-4 s2-panel p-4">
          <h4 class="text-sm font-semibold text-sims2-gold mb-3">Things to look at</h4>
          <ul class="space-y-2">
            <li v-if="insights.simsWithoutRelations.length > 0">
              <router-link 
                to="/sims" 
                class="flex items-center gap-2 text-sm text-sims2-cream hover:text-sims2-gold transition-colors"
                @click="setNoRelationsFilter"
              >
                <span class="w-6 h-6 bg-purple-500/30 rounded-full flex items-center justify-center text-xs text-purple-300">
                  {{ insights.simsWithoutRelations.length }}
                </span>
                <span>Sims without relationships</span>
                <span class="text-sims2-sky">→</span>
              </router-link>
            </li>
            <li v-if="insights.elderSims.length > 0">
              <router-link 
                to="/sims" 
                class="flex items-center gap-2 text-sm text-sims2-cream hover:text-sims2-gold transition-colors"
              >
                <span class="w-6 h-6 bg-amber-500/30 rounded-full flex items-center justify-center text-xs text-amber-300">
                  {{ insights.elderSims.length }}
                </span>
                <span>Elder Sims (may die soon)</span>
                <span class="text-sims2-sky">→</span>
              </router-link>
            </li>
            <li v-if="insights.incompleteSims.length > 0">
              <router-link 
                to="/sims" 
                class="flex items-center gap-2 text-sm text-sims2-cream hover:text-sims2-gold transition-colors"
              >
                <span class="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs text-sims2-sky">
                  {{ insights.incompleteSims.length }}
                </span>
                <span>Incomplete profiles</span>
                <span class="text-sims2-sky">→</span>
              </router-link>
            </li>
            <li v-if="insights.plannedSims.length > 0">
              <router-link 
                to="/sims" 
                class="flex items-center gap-2 text-sm text-sims2-cream hover:text-sims2-gold transition-colors"
                @click="setPlannedFilter"
              >
                <span class="w-6 h-6 bg-amber-500/30 rounded-full flex items-center justify-center text-xs text-amber-300">
                  {{ insights.plannedSims.length }}
                </span>
                <span>Planned Sims waiting to be created</span>
                <span class="text-sims2-sky">→</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </main>

    <!-- Add World Modal -->
    <Modal v-model="showAddWorldModal" title="Create new world">
      <WorldForm @saved="onWorldSaved" @cancel="showAddWorldModal = false" />
    </Modal>

    <!-- Add Sim Modal -->
    <Modal v-model="showAddSimModal" title="Add Sim">
      <SimForm @saved="onSimSaved" @cancel="showAddSimModal = false" @import="switchToImport" />
    </Modal>

    <!-- Import from Screenshot Modal -->
    <Modal v-model="showImportModal" title="Import from screenshot">
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
import SimAvatar from '@/components/SimAvatar.vue'
import { Globe, Home, Users, Heart, UserPlus, GitBranch, User, Gamepad2, Lightbulb, Hand } from 'lucide-vue-next'
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

  // Find planned sims
  const plannedSimsList = simsStore.plannedSims
  
  return {
    simsWithoutRelations,
    elderSims,
    incompleteSims,
    plannedSims: plannedSimsList
  }
})

const totalInsights = computed(() => {
  return insights.value.simsWithoutRelations.length + 
         insights.value.elderSims.length + 
         insights.value.incompleteSims.length +
         insights.value.plannedSims.length
})

function setNoRelationsFilter() {
  localStorage.setItem('simaja_filter_relations', 'none')
}

function setPlannedFilter() {
  localStorage.setItem('simaja_filter_status', 'planned')
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
</style>
