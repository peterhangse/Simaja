<template>
  <div class="min-h-screen bg-gradient-to-br from-sims2-navy via-sims2-panel to-sims2-navy-light flex items-center justify-center p-4">
    <div class="s2-panel w-full max-w-lg overflow-hidden">
      
      <!-- Progress dots -->
      <div class="flex justify-center gap-2 pt-6">
        <div 
          v-for="i in totalSlides" 
          :key="i"
          class="w-2 h-2 rounded-full transition-all duration-300"
          :class="currentSlide >= i ? 'bg-green-400 w-6' : 'bg-sims2-sky/30'"
        />
      </div>

      <!-- Slide content -->
      <div class="p-8">
        
        <!-- Slide 1: Welcome -->
        <Transition name="slide" mode="out-in">
          <div v-if="currentSlide === 1" key="slide1" class="text-center">
            <div class="w-32 h-40 mx-auto mb-6 animate-bounce-slow">
              <PlumbobIcon class="w-full h-full text-green-400 plumbob-glow" />
            </div>
            <h2 class="text-3xl font-bold text-sims2-gold mb-4 font-display">
              Welcome to Simaja! <Gamepad2 :size="28" class="inline text-green-400" />
            </h2>
            <p class="text-sims2-cream text-lg leading-relaxed">
              Your personal app to keep track of all your Sims, 
              their worlds, relationships and life stories.
            </p>
          </div>
        </Transition>

        <!-- Slide 2: Features -->
        <Transition name="slide" mode="out-in">
          <div v-if="currentSlide === 2" key="slide2" class="text-center">
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="p-4 s2-panel-inner rounded-2xl">
                <Globe :size="28" class="mx-auto text-green-400" />
                <p class="text-sm text-sims2-cream mt-2">Worlds</p>
              </div>
              <div class="p-4 s2-panel-inner rounded-2xl">
                <Home :size="28" class="mx-auto text-pink-400" />
                <p class="text-sm text-sims2-cream mt-2">Houses</p>
              </div>
              <div class="p-4 s2-panel-inner rounded-2xl">
                <Users :size="28" class="mx-auto text-sims2-sky" />
                <p class="text-sm text-sims2-cream mt-2">Sims</p>
              </div>
            </div>
            <h2 class="text-2xl font-bold text-sims2-gold mb-4">
              Organize your Sims world
            </h2>
            <p class="text-sims2-cream leading-relaxed">
              Create worlds, build houses and fill them with Sims. 
              Connect family trees across different worlds and 
              follow their life adventures in the diary.
            </p>
          </div>
        </Transition>

        <!-- Slide 3: Name input -->
        <Transition name="slide" mode="out-in">
          <div v-if="currentSlide === 3" key="slide3" class="text-center">
            <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500/30 to-emerald-600/30 rounded-full flex items-center justify-center shadow-lg border-2 border-green-500/40">
              <Hand :size="36" class="text-green-400" />
            </div>
            <h2 class="text-2xl font-bold text-sims2-gold mb-4">
              What's your name?
            </h2>
            <p class="text-sims2-sky mb-6">
              We want to make your experience personal!
            </p>
            <input
              v-model="userName"
              type="text"
              placeholder="Your name..."
              class="w-full px-4 py-3 rounded-xl bg-black/30 border-2 border-sims2-sky/20 text-sims2-cream placeholder-sims2-sky/40 focus:border-sims2-sky/50 outline-none text-lg text-center transition-all"
              @keyup.enter="completeOnboarding"
            />
          </div>
        </Transition>
      </div>

      <!-- Navigation buttons -->
      <div class="px-8 pb-8">
        <div class="flex gap-4">
          <button
            v-if="currentSlide > 1"
            @click="previousSlide"
            class="flex-1 s2-btn s2-btn-ghost py-3 px-6"
          >
            ← Back
          </button>
          
          <button
            v-if="currentSlide < totalSlides"
            @click="nextSlide"
            class="flex-1 s2-btn s2-btn-green py-3 px-6"
          >
            Next →
          </button>
          
          <button
            v-if="currentSlide === totalSlides"
            @click="completeOnboarding"
            :disabled="!userName.trim()"
            class="flex-1 s2-btn s2-btn-green py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start the adventure! <Rocket :size="16" class="inline" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import PlumbobIcon from '@/components/icons/PlumbobIcon.vue'
import { Gamepad2, Globe, Home, Users, Hand, Rocket } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const currentSlide = ref(1)
const totalSlides = 3
const userName = ref('')

function nextSlide() {
  if (currentSlide.value < totalSlides) {
    currentSlide.value++
  }
}

function previousSlide() {
  if (currentSlide.value > 1) {
    currentSlide.value--
  }
}

function completeOnboarding() {
  if (userName.value.trim()) {
    authStore.completeOnboarding(userName.value.trim())
    router.push('/')
  }
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
