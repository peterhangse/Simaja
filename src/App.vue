<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  // Check if user has a valid session
  const isAuthenticated = authStore.checkSession()
  
  if (!isAuthenticated) {
    router.push('/login')
  }
})
</script>
