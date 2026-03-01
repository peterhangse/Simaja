<template>
  <div class="relative" ref="pickerRef">
    <button
      @click="open = !open"
      class="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg border border-white/30 transition-colors text-sm"
    >
      <Save :size="12" class="text-white/80" />
      <span class="font-medium text-white max-w-[100px] truncate">{{ activeProfile?.name || 'Default Save' }}</span>
      <ChevronDown v-if="!open" :size="12" class="text-white/80" />
      <ChevronUp v-else :size="12" class="text-white/80" />
    </button>

    <!-- Dropdown -->
    <div
      v-if="open"
      class="absolute right-0 top-full mt-2 w-64 s2-panel overflow-hidden z-50"
    >
      <div class="p-3 border-b border-gray-200">
        <p class="text-xs font-semibold text-sims2-sky uppercase tracking-wide">Save Files</p>
      </div>

      <!-- Profile list -->
      <div class="max-h-48 overflow-y-auto">
        <button
          v-for="profile in simsStore.profiles"
          :key="profile.id"
          @click="selectProfile(profile.id)"
          class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group"
          :class="profile.id === simsStore.activeProfileId ? 'bg-green-500/15' : ''"
        >
          <div class="flex items-center gap-2">
            <span class="text-sm">{{ profile.id === simsStore.activeProfileId ? '✓' : '' }}</span>
            <span class="text-sm font-medium" :class="profile.id === simsStore.activeProfileId ? 'text-green-700' : 'text-sims2-cream'">
              {{ profile.name }}
            </span>
          </div>
          <button
            v-if="profile.id !== 'default'"
            @click.stop="confirmDelete(profile)"
            class="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 text-xs"
          >
            <Trash2 :size="12" />
          </button>
        </button>
      </div>

      <!-- Create new -->
      <div class="border-t border-gray-200 p-3">
        <div v-if="!creating" class="flex justify-center">
          <button
            @click="creating = true"
            class="text-sm text-sims2-gold hover:text-sims2-gold-light font-medium"
          >
            + New save file
          </button>
        </div>
        <div v-else class="flex gap-2">
          <input
            v-model="newName"
            @keyup.enter="createProfile"
            placeholder="Save name..."
            class="flex-1 px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-sims2-cream placeholder-gray-400 focus:border-emerald-400 outline-none"
            ref="nameInput"
          />
          <button
            @click="createProfile"
            :disabled="!newName.trim()"
            class="px-3 py-1.5 s2-btn s2-btn-green text-sm disabled:opacity-50"
          >
            ✓
          </button>
        </div>
      </div>
    </div>

    <!-- Delete confirm -->
    <div
      v-if="deleteTarget"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="deleteTarget = null"
    >
      <div class="s2-panel p-6 max-w-sm mx-4">
        <p class="text-sims2-cream font-medium mb-2">Delete "{{ deleteTarget.name }}"?</p>
        <p class="text-sm text-sims2-sky mb-4">This will not delete the Sims data, but you won't be able to filter by this profile anymore.</p>
        <div class="flex gap-3">
          <button @click="deleteTarget = null" class="flex-1 s2-btn s2-btn-ghost py-2">Cancel</button>
          <button @click="doDelete" class="flex-1 s2-btn s2-btn-danger py-2">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useSimsStore } from '@/stores/sims'
import { Save, ChevronDown, ChevronUp, Trash2 } from 'lucide-vue-next'

const simsStore = useSimsStore()

const open = ref(false)
const creating = ref(false)
const newName = ref('')
const nameInput = ref(null)
const deleteTarget = ref(null)
const pickerRef = ref(null)

const activeProfile = computed(() =>
  simsStore.profiles.find(p => p.id === simsStore.activeProfileId) || { name: 'Default Save' }
)

watch(creating, async (v) => {
  if (v) {
    await nextTick()
    nameInput.value?.focus()
  }
})

async function selectProfile(id) {
  if (id === simsStore.activeProfileId) {
    open.value = false
    return
  }
  await simsStore.switchProfile(id)
  open.value = false
}

async function createProfile() {
  const name = newName.value.trim()
  if (!name) return
  try {
    const profile = await simsStore.addProfile(name)
    if (!profile) {
      console.error('addProfile returned nothing')
      return
    }
    newName.value = ''
    creating.value = false
    await simsStore.switchProfile(profile.id)
    open.value = false
  } catch (err) {
    console.error('Failed to create save file:', err)
    alert('Could not create save file: ' + (err.message || 'Unknown error'))
  }
}

function confirmDelete(profile) {
  deleteTarget.value = profile
}

async function doDelete() {
  if (deleteTarget.value) {
    await simsStore.deleteProfile(deleteTarget.value.id)
    deleteTarget.value = null
  }
}

// Close on outside click
function handleClickOutside(e) {
  if (pickerRef.value && !pickerRef.value.contains(e.target) && !deleteTarget.value) {
    open.value = false
    creating.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
