<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 p-4">
    <!-- Floating plumbobs background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div v-for="i in 8" :key="i" 
           class="absolute animate-float opacity-20"
           :style="{ 
             left: `${Math.random() * 100}%`, 
             top: `${Math.random() * 100}%`,
             animationDelay: `${i * 0.5}s`
           }">
        <PlumbobIcon class="w-12 h-12 text-white" />
      </div>
    </div>

    <div class="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
      <!-- Plumbob logo -->
      <div class="flex justify-center mb-6">
        <div class="w-20 h-24 animate-pulse-slow">
          <PlumbobIcon class="w-full h-full text-green-500" />
        </div>
      </div>

      <h1 class="text-3xl font-bold text-center text-gray-800 mb-2">
        Simaja
      </h1>
      <p class="text-center text-gray-500 mb-8">
        Din personliga Sims-värld
      </p>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Lösenord
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Ange lösenord..."
            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none text-lg"
            :class="{ 'border-red-400 shake': showError }"
          />
          <p v-if="showError" class="mt-2 text-sm text-red-500">
            {{ errorMessage }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">Kom in! 🎮</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Loggar in...
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

const router = useRouter()
const authStore = useAuthStore()

const password = ref('')
const isLoading = ref(false)
const showError = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  if (!password.value.trim()) {
    showError.value = true
    errorMessage.value = 'Ange ett lösenord'
    return
  }

  isLoading.value = true
  showError.value = false

  try {
    const result = await authStore.login(password.value)
    
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
    errorMessage.value = 'Något gick fel. Försök igen.'
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
