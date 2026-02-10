<template>
  <div class="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
      
      <!-- Progress dots -->
      <div class="flex justify-center gap-2 pt-6">
        <div 
          v-for="i in totalSlides" 
          :key="i"
          class="w-2 h-2 rounded-full transition-all duration-300"
          :class="currentSlide >= i ? 'bg-green-500 w-6' : 'bg-gray-300'"
        />
      </div>

      <!-- Slide content -->
      <div class="p-8">
        
        <!-- Slide 1: Welcome -->
        <Transition name="slide" mode="out-in">
          <div v-if="currentSlide === 1" key="slide1" class="text-center">
            <div class="w-32 h-40 mx-auto mb-6 animate-bounce-slow">
              <PlumbobIcon class="w-full h-full text-green-500" />
            </div>
            <h2 class="text-3xl font-bold text-gray-800 mb-4">
              Välkommen till Simaja! 🎮
            </h2>
            <p class="text-gray-600 text-lg leading-relaxed">
              Din personliga app för att hålla koll på alla dina Sims, 
              deras världar, relationer och livshistorier.
            </p>
          </div>
        </Transition>

        <!-- Slide 2: Features -->
        <Transition name="slide" mode="out-in">
          <div v-if="currentSlide === 2" key="slide2" class="text-center">
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="p-4 bg-green-50 rounded-2xl">
                <span class="text-3xl">🌍</span>
                <p class="text-sm text-gray-600 mt-2">Världar</p>
              </div>
              <div class="p-4 bg-pink-50 rounded-2xl">
                <span class="text-3xl">🏠</span>
                <p class="text-sm text-gray-600 mt-2">Hus</p>
              </div>
              <div class="p-4 bg-blue-50 rounded-2xl">
                <span class="text-3xl">👤</span>
                <p class="text-sm text-gray-600 mt-2">Simar</p>
              </div>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-4">
              Organisera din Sims-värld
            </h2>
            <p class="text-gray-600 leading-relaxed">
              Skapa världar, bygg hus och fyll dem med Simar. 
              Koppla ihop släktträd mellan olika världar och 
              följ deras livsäventyr i dagboken.
            </p>
          </div>
        </Transition>

        <!-- Slide 3: Name input -->
        <Transition name="slide" mode="out-in">
          <div v-if="currentSlide === 3" key="slide3" class="text-center">
            <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <span class="text-4xl">👋</span>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-4">
              Vad heter du?
            </h2>
            <p class="text-gray-600 mb-6">
              Vi vill göra din upplevelse personlig!
            </p>
            <input
              v-model="userName"
              type="text"
              placeholder="Ditt namn..."
              class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none text-lg text-center"
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
            class="flex-1 py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            ← Tillbaka
          </button>
          
          <button
            v-if="currentSlide < totalSlides"
            @click="nextSlide"
            class="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            Nästa →
          </button>
          
          <button
            v-if="currentSlide === totalSlides"
            @click="completeOnboarding"
            :disabled="!userName.trim()"
            class="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Starta äventyret! 🚀
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
