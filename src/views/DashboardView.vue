<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <PlumbobIcon class="w-8 h-10 text-green-500" />
          <h1 class="text-xl font-bold text-gray-800">
            {{ authStore.userName }}s Simar
          </h1>
        </div>
        <nav class="flex items-center gap-4">
          <router-link 
            to="/" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === '/' }"
          >
            🏠 Hem
          </router-link>
          <router-link 
            to="/worlds" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.path.startsWith('/worlds') }"
          >
            🌍 Världar
          </router-link>
          <router-link 
            to="/sims" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.path.startsWith('/sims') }"
          >
            👤 Simar
          </router-link>
          <router-link 
            to="/family-tree" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === '/family-tree' }"
          >
            🌳 Släktträd
          </router-link>
          <button 
            @click="logout"
            class="ml-4 text-gray-500 hover:text-red-500 transition-colors"
            title="Logga ut"
          >
            🚪
          </button>
        </nav>
      </div>
    </header>

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
    </main>

    <!-- Add World Modal -->
    <Modal v-model="showAddWorldModal" title="Skapa ny värld">
      <WorldForm @saved="onWorldSaved" @cancel="showAddWorldModal = false" />
    </Modal>

    <!-- Add Sim Modal -->
    <Modal v-model="showAddSimModal" title="Lägg till Sim">
      <SimForm @saved="onSimSaved" @cancel="showAddSimModal = false" />
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSimsStore } from '@/stores/sims'
import PlumbobIcon from '@/components/icons/PlumbobIcon.vue'
import Modal from '@/components/Modal.vue'
import WorldForm from '@/components/forms/WorldForm.vue'
import SimForm from '@/components/forms/SimForm.vue'

const router = useRouter()
const authStore = useAuthStore()
const simsStore = useSimsStore()

const showAddWorldModal = ref(false)
const showAddSimModal = ref(false)

const recentSims = computed(() => {
  return [...simsStore.sims]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6)
})

onMounted(async () => {
  await simsStore.initializeData()
})

function logout() {
  authStore.logout()
  router.push('/login')
}

function onWorldSaved() {
  showAddWorldModal.value = false
}

function onSimSaved() {
  showAddSimModal.value = false
}
</script>

<style scoped>
.nav-link {
  @apply px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors;
}

.nav-link-active {
  @apply bg-green-100 text-green-700;
}

.stat-card {
  @apply flex items-center gap-4 p-6 rounded-2xl border-2 shadow-sm;
}

.action-card {
  @apply flex flex-col items-center gap-2 p-6 bg-white rounded-2xl border-2 border-gray-200 shadow-sm transition-all cursor-pointer;
}
</style>
