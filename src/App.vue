<template>
  <div id="app" class="min-h-screen sims-bg">
    <router-view />
    <MusicPlayer v-if="authStore.isAuthenticated" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import MusicPlayer from '@/components/MusicPlayer.vue'

const authStore = useAuthStore()

onMounted(() => {
  // Restore session from localStorage (router guard handles redirects)
  authStore.checkSession()
})
</script>
