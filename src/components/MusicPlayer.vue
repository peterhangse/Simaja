<template>
  <!-- Floating music player -->
  <div class="fixed bottom-4 right-4 z-50">
    <!-- Minimized state -->
    <button
      v-if="!expanded"
      @click="expanded = true"
      class="w-12 h-12 s2-panel rounded-full flex items-center justify-center hover:scale-110 transition-transform"
      title="Sims Music Player"
    >
      <span :class="{ 'animate-pulse': isPlaying }"><Music :size="20" class="text-sims2-sky" /></span>
    </button>

    <!-- Expanded player -->
    <div
      v-else
      class="s2-panel w-72 overflow-hidden"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-3 flex items-center justify-between border-b border-emerald-800">
        <div class="flex items-center gap-2 text-white">
          <Music :size="16" />
          <span class="font-semibold text-sm">Sims Music</span>
        </div>
        <button
          @click="expanded = false"
          class="text-white/70 hover:text-white transition-colors"
        >
          <X :size="16" />
        </button>
      </div>

      <!-- Now playing -->
      <div class="px-4 py-3">
        <p class="text-xs text-sims2-sky uppercase tracking-wide">Now playing</p>
        <p class="text-sm font-medium text-sims2-cream truncate mt-1">
          The Sims 1 & 2 – Calm & Relaxing
        </p>
        <p class="text-xs text-sims2-sky/60">1 Hour Mix</p>
      </div>

      <!-- Progress bar -->
      <div class="px-4 pb-2">
        <div
          class="relative w-full h-1.5 bg-gray-700 rounded-full cursor-pointer group"
          @click="seekTo"
          ref="progressBar"
        >
          <div
            class="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-200"
            :style="{ width: progressPercent + '%' }"
          />
          <div
            class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
            :style="{ left: progressPercent + '%', marginLeft: '-6px' }"
          />
        </div>
        <div class="flex justify-between mt-1">
          <span class="text-[10px] text-sims2-sky/60">{{ formatTime(currentTime) }}</span>
          <span class="text-[10px] text-sims2-sky/60">{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- Controls -->
      <div class="px-4 pb-3 flex items-center justify-center gap-3">
        <button
          @click="skip(-15)"
          class="text-sims2-sky/60 hover:text-sims2-cream transition-colors flex flex-col items-center"
          title="Back 15s"
        >
          <RotateCcw :size="16" />
          <span class="text-[9px] mt-0.5">15</span>
        </button>
        <button
          @click="togglePlay"
          class="w-10 h-10 s2-btn s2-btn-green rounded-full flex items-center justify-center !p-0"
          :title="isPlaying ? 'Pause' : 'Play'"
        >
          <Pause v-if="isPlaying" :size="18" />
          <Play v-else :size="18" />
        </button>
        <button
          @click="skip(15)"
          class="text-sims2-sky/60 hover:text-sims2-cream transition-colors flex flex-col items-center"
          title="Forward 15s"
        >
          <RotateCw :size="16" />
          <span class="text-[9px] mt-0.5">15</span>
        </button>
      </div>

      <!-- Volume -->
      <div class="px-4 pb-3 flex items-center gap-2">
        <Volume1 :size="12" class="text-sims2-sky/60" />
        <input
          type="range"
          min="0"
          max="100"
          v-model.number="volume"
          @input="setVolume"
          class="flex-1 h-1 accent-green-500"
        />
        <Volume2 :size="12" class="text-sims2-sky/60" />
      </div>
    </div>
  </div>

  <!-- Hidden audio element -->
  <audio
    ref="audioEl"
    :src="audioSrc"
    preload="metadata"
    @timeupdate="onTimeUpdate"
    @loadedmetadata="onLoadedMetadata"
    @ended="onEnded"
    @play="isPlaying = true"
    @pause="isPlaying = false"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Music, X, RotateCcw, RotateCw, Play, Pause, Volume1, Volume2 } from 'lucide-vue-next'

const expanded = ref(false)
const isPlaying = ref(false)
const volume = ref(30)
const currentTime = ref(0)
const duration = ref(0)
const progressPercent = ref(0)

const audioEl = ref(null)
const progressBar = ref(null)

const audioSrc = '/sims-music.mp3'

function formatTime(seconds) {
  const s = Math.floor(seconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }
  return `${m}:${String(sec).padStart(2, '0')}`
}

function onTimeUpdate() {
  if (!audioEl.value) return
  currentTime.value = audioEl.value.currentTime
  if (duration.value > 0) {
    progressPercent.value = (currentTime.value / duration.value) * 100
  }
}

function onLoadedMetadata() {
  if (!audioEl.value) return
  duration.value = audioEl.value.duration
}

function onEnded() {
  isPlaying.value = false
  currentTime.value = 0
  progressPercent.value = 0
}

function togglePlay() {
  if (!audioEl.value) return
  if (isPlaying.value) {
    audioEl.value.pause()
  } else {
    audioEl.value.play()
  }
}

function skip(seconds) {
  if (!audioEl.value) return
  const newTime = audioEl.value.currentTime + seconds
  audioEl.value.currentTime = Math.max(0, Math.min(newTime, duration.value))
}

function seekTo(event) {
  if (!progressBar.value || !audioEl.value) return
  const rect = progressBar.value.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
  audioEl.value.currentTime = percent * duration.value
}

function setVolume() {
  if (audioEl.value) {
    audioEl.value.volume = volume.value / 100
  }
}

// Persist volume preference
watch(volume, (v) => {
  localStorage.setItem('simaja_music_volume', String(v))
})

onMounted(() => {
  const saved = localStorage.getItem('simaja_music_volume')
  if (saved) volume.value = Number(saved)
  // Apply initial volume once audio element is ready
  if (audioEl.value) {
    audioEl.value.volume = volume.value / 100
  }
})
</script>
