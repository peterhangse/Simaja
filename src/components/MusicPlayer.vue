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
      <div class="bg-gradient-to-r from-sims2-navy-light to-sims2-navy px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div class="flex items-center gap-2 text-sims2-gold">
          <Music :size="16" />
          <span class="font-semibold text-sm">Sims Music</span>
        </div>
        <button
          @click="expanded = false"
          class="text-sims2-sky/70 hover:text-white transition-colors"
        >
          <X :size="16" />
        </button>
      </div>

      <!-- Now playing -->
      <div class="px-4 py-3">
        <p class="text-xs text-sims2-sky uppercase tracking-wide">Now playing</p>
        <p class="text-sm font-medium text-sims2-cream truncate mt-1">
          {{ currentTrack.title }}
        </p>
        <p class="text-xs text-sims2-sky/60">{{ currentTrack.game }}</p>
      </div>

      <!-- Controls -->
      <div class="px-4 pb-3 flex items-center justify-center gap-6">
        <button
          @click="prevTrack"
          class="text-sims2-sky/60 hover:text-sims2-cream transition-colors"
          title="Previous"
        >
          <SkipBack :size="16" />
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
          @click="nextTrack"
          class="text-sims2-sky/60 hover:text-sims2-cream transition-colors"
          title="Next"
        >
          <SkipForward :size="16" />
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

      <!-- Playlist toggle -->
      <div class="border-t border-white/10">
        <button
          @click="showPlaylist = !showPlaylist"
          class="w-full px-4 py-2 text-xs text-sims2-sky hover:bg-white/5 transition-colors flex items-center justify-between"
        >
          <span>Playlist ({{ tracks.length }} tracks)</span>
          <span>{{ showPlaylist ? '▲' : '▼' }}</span>
        </button>
        <div v-if="showPlaylist" class="max-h-40 overflow-y-auto">
          <button
            v-for="(track, i) in tracks"
            :key="track.id"
            @click="playTrack(i)"
            class="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
            :class="i === currentIndex ? 'bg-green-500/15 text-green-300' : 'text-sims2-cream/80'"
          >
            <span class="text-xs">{{ i === currentIndex && isPlaying ? '♫' : '♪' }}</span>
            <span class="truncate">{{ track.title }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Hidden YouTube iframe -->
  <div class="hidden">
    <div id="yt-player"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Music, X, SkipBack, SkipForward, Play, Pause, Volume1, Volume2 } from 'lucide-vue-next'

const expanded = ref(false)
const isPlaying = ref(false)
const showPlaylist = ref(false)
const volume = ref(30)
const currentIndex = ref(0)

let player = null
let apiReady = false

// Curated Sims soundtrack — YouTube video IDs
const tracks = [
  { id: 'XR9-y4u9mew', title: 'Neighborhood 1', game: 'The Sims 2' },
  { id: 'AoVfbGjHMHg', title: 'Neighborhood 2', game: 'The Sims 2' },
  { id: 'XO4GfI3RVQY', title: 'Neighborhood 3', game: 'The Sims 2' },
  { id: 'VVefPkm36Nk', title: 'Build Mode 1', game: 'The Sims 2' },
  { id: 'mxHo0MbtkUE', title: 'Build Mode 2', game: 'The Sims 2' },
  { id: '7TjIxQnAkvE', title: 'Buy Mode 1', game: 'The Sims 2' },
  { id: 'IadnwIJQOlk', title: 'Buy Mode 2', game: 'The Sims 2' },
  { id: '5tFj0JEb8NI', title: 'CAS Theme', game: 'The Sims 2' },
  { id: 'cepJB2mELBM', title: 'Main Theme', game: 'The Sims 4' },
  { id: 'iSVR1j3OjPk', title: 'Build Mode', game: 'The Sims 4' }
]

const currentTrack = ref(tracks[0])

function loadYouTubeAPI() {
  if (window.YT && window.YT.Player) {
    apiReady = true
    createPlayer()
    return
  }

  const tag = document.createElement('script')
  tag.src = 'https://www.youtube.com/iframe_api'
  document.head.appendChild(tag)

  window.onYouTubeIframeAPIReady = () => {
    apiReady = true
    createPlayer()
  }
}

function createPlayer() {
  player = new window.YT.Player('yt-player', {
    height: '0',
    width: '0',
    videoId: tracks[currentIndex.value].id,
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  })
}

function onPlayerReady() {
  player.setVolume(volume.value)
}

function onPlayerStateChange(event) {
  // YT.PlayerState.ENDED === 0
  if (event.data === 0) {
    nextTrack()
  }
  // YT.PlayerState.PLAYING === 1
  isPlaying.value = event.data === 1
}

function togglePlay() {
  if (!player) return
  if (isPlaying.value) {
    player.pauseVideo()
  } else {
    player.playVideo()
  }
}

function playTrack(index) {
  currentIndex.value = index
  currentTrack.value = tracks[index]
  if (player && player.loadVideoById) {
    player.loadVideoById(tracks[index].id)
    isPlaying.value = true
  }
}

function nextTrack() {
  const next = (currentIndex.value + 1) % tracks.length
  playTrack(next)
}

function prevTrack() {
  const prev = (currentIndex.value - 1 + tracks.length) % tracks.length
  playTrack(prev)
}

function setVolume() {
  if (player && player.setVolume) {
    player.setVolume(volume.value)
  }
}

// Persist volume preference
watch(volume, (v) => {
  localStorage.setItem('simaja_music_volume', String(v))
})

onMounted(() => {
  const saved = localStorage.getItem('simaja_music_volume')
  if (saved) volume.value = Number(saved)
  loadYouTubeAPI()
})

onUnmounted(() => {
  if (player && player.destroy) {
    player.destroy()
  }
})
</script>
