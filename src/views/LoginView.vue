<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-sims2-navy via-sims2-panel to-sims2-navy-light p-4">
    <!-- Floating plumbobs background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div v-for="i in 8" :key="i" 
           class="absolute animate-float opacity-10"
           :style="{ 
             left: `${Math.random() * 100}%`, 
             top: `${Math.random() * 100}%`,
             animationDelay: `${i * 0.5}s`
           }">
        <PlumbobIcon class="w-12 h-12 text-green-600" />
      </div>
    </div>

    <div class="relative s2-panel p-8 w-full max-w-md">
      <!-- Plumbob logo -->
      <div class="flex justify-center mb-6">
        <div class="w-20 h-24 animate-pulse-slow">
          <PlumbobIcon class="w-full h-full text-green-600 plumbob-glow" />
        </div>
      </div>

      <h1 class="text-3xl font-bold text-center text-sims2-gold mb-2 font-display">
        Simaja
      </h1>
      <p class="text-center text-sims2-sky mb-8">
        Your personal Sims world
      </p>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-sims2-sky mb-2">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter email..."
            class="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 text-sims2-cream placeholder-gray-400 focus:border-emerald-400 outline-none text-lg transition-all"
            :class="{ 'border-red-400 shake': showError }"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-sims2-sky mb-2">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter password..."
            class="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 text-sims2-cream placeholder-gray-400 focus:border-emerald-400 outline-none text-lg transition-all"
            :class="{ 'border-red-400 shake': showError }"
          />
          <p v-if="showError" class="mt-2 text-sm text-red-600">
            {{ errorMessage }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full s2-btn s2-btn-green py-3 px-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">Let me in! <Gamepad2 :size="16" class="inline" /></span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Logging in...
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import PlumbobIcon from '@/components/icons/PlumbobIcon.vue'
import { Gamepad2 } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const showError = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  if (!email.value.trim() || !password.value.trim()) {
    showError.value = true
    errorMessage.value = 'Please enter both email and password'
    return
  }

  isLoading.value = true
  showError.value = false

  try {
    const result = await authStore.login(email.value, password.value)
    
    if (result.success) {
      if (authStore.hasCompletedOnboarding) {
        router.push('/')
      } else {
        router.push('/onboarding')
      }
    } else {
      showError.value = true
      errorMessage.value = result.error
    }
  } catch (error) {
    showError.value = true
    errorMessage.value = 'Something went wrong. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse 3s ease-in-out infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.shake {
  animation: shake 0.3s ease-in-out;
}
</style>
