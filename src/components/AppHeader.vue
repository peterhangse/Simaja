<template>
  <header class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <PlumbobIcon class="w-8 h-10 text-green-500" />
        <h1 class="text-xl font-bold text-gray-800">
          {{ authStore.userName }}s Simar
        </h1>
      </router-link>
      
      <nav class="flex items-center gap-2">
        <router-link 
          to="/" 
          class="nav-link"
          :class="{ 'nav-link-active': $route.path === '/' }"
        >
          🏠 <span class="hidden sm:inline">Hem</span>
        </router-link>
        <router-link 
          to="/worlds" 
          class="nav-link"
          :class="{ 'nav-link-active': $route.path.startsWith('/worlds') }"
        >
          🌍 <span class="hidden sm:inline">Världar</span>
        </router-link>
        <router-link 
          to="/sims" 
          class="nav-link"
          :class="{ 'nav-link-active': $route.path.startsWith('/sims') }"
        >
          👤 <span class="hidden sm:inline">Simar</span>
        </router-link>
        <router-link 
          to="/family-tree" 
          class="nav-link"
          :class="{ 'nav-link-active': $route.path === '/family-tree' }"
        >
          🌳 <span class="hidden sm:inline">Släktträd</span>
        </router-link>
        <button 
          @click="logout"
          class="ml-2 px-3 py-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Logga ut"
        >
          🚪
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import PlumbobIcon from '@/components/icons/PlumbobIcon.vue'

const router = useRouter()
const authStore = useAuthStore()

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.nav-link {
  @apply px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-1;
}

.nav-link-active {
  @apply bg-green-100 text-green-700;
}
</style>
