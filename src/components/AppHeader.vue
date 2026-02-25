<template>
  <header class="bg-sims2-navy shadow-lg border-b border-sims2-navy-light sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-3 hover:opacity-90 transition-opacity">
        <PlumbobIcon class="w-8 h-10 text-green-400 plumbob-glow" />
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
        <button 
          @click="logout"
          class="ml-1 px-3 py-2 text-sims2-sky hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors"
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
import { Home, Globe, Users, GitBranch, LogOut } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.nav-link {
  @apply px-3 py-2 rounded-lg text-sims2-sky hover:bg-white/10 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium;
}

.nav-link-active {
  @apply bg-white/15 text-white;
}
</style>
