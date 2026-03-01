<template>
  <header class="bg-emerald-600 shadow-lg border-b border-emerald-700 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-3 hover:opacity-90 transition-opacity">
        <PlumbobIcon class="w-8 h-10 text-green-300 plumbob-glow" />
        <h1 class="text-xl font-bold text-white">
          {{ authStore.userName }}'s Sims
        </h1>
      </router-link>
      
      <nav class="flex items-center gap-1">
        <ProfilePicker />
        <router-link 
          to="/" 
          class="nav-link"
          :class="{ 'nav-link-active': $route.path === '/' }"
        >
          <Home :size="16" /> <span class="hidden sm:inline">Home</span>
        </router-link>
        <router-link 
          to="/worlds" 
          class="nav-link"
          :class="{ 'nav-link-active': $route.path.startsWith('/worlds') }"
        >
          <Globe :size="16" /> <span class="hidden sm:inline">Worlds</span>
        </router-link>
        <router-link 
          to="/sims" 
          class="nav-link"
          :class="{ 'nav-link-active': $route.path.startsWith('/sims') }"
        >
          <Users :size="16" /> <span class="hidden sm:inline">Sims</span>
        </router-link>
        <router-link 
          to="/family-tree" 
          class="nav-link"
          :class="{ 'nav-link-active': $route.path === '/family-tree' }"
        >
          <GitBranch :size="16" /> <span class="hidden sm:inline">Tree</span>
        </router-link>
        <router-link 
          to="/floor-plan" 
          class="nav-link"
          :class="{ 'nav-link-active': $route.path === '/floor-plan' }"
        >
          <LayoutGrid :size="16" /> <span class="hidden sm:inline">Floor Plan</span>
        </router-link>
        <button 
          @click="logout"
          class="ml-1 px-3 py-2 text-white/80 hover:text-red-200 hover:bg-white/15 rounded-lg transition-colors"
          title="Log out"
        >
          <LogOut :size="16" />
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import PlumbobIcon from '@/components/icons/PlumbobIcon.vue'
import ProfilePicker from '@/components/ProfilePicker.vue'
import { Home, Globe, Users, GitBranch, LayoutGrid, LogOut } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.nav-link {
  @apply px-3 py-2 rounded-lg text-white/80 hover:bg-white/15 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium;
}

.nav-link-active {
  @apply bg-white/20 text-white;
}
</style>
