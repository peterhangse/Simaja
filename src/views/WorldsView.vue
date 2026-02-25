<template>
  <div class="min-h-screen">
    <!-- Header -->
    <AppHeader />

    <main class="max-w-7xl mx-auto px-4 py-8 relative z-[1]">
      <!-- Page header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-3xl font-bold text-sims2-gold font-display"><Globe :size="28" class="inline text-green-400" /> My Worlds</h2>
          <p class="text-sims2-sky mt-1">Manage your Sims worlds</p>
        </div>
        <button
          @click="showAddModal = true"
          class="s2-btn s2-btn-green flex items-center gap-2"
        >
          <span>+</span> New World
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="simsStore.isLoading" class="text-center py-12">
        <div class="animate-spin w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full mx-auto"></div>
        <p class="text-sims2-sky mt-4">Loading worlds...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="simsStore.worlds.length === 0" class="text-center py-12 s2-panel">
        <Globe :size="48" class="mx-auto text-sims2-sky opacity-50" />
        <h3 class="text-xl font-bold text-sims2-gold mt-4 mb-2">No worlds yet</h3>
        <p class="text-sims2-sky mb-6">Create your first world to get started!</p>
        <button 
          @click="showAddModal = true"
          class="s2-btn s2-btn-green"
        >
          Create first world
        </button>
      </div>

      <!-- Worlds grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="world in simsStore.worlds"
          :key="world.id"
          class="s2-card overflow-hidden group"
        >
          <!-- World image -->
          <div class="h-40 bg-gradient-to-br from-sims2-navy to-sims2-panel relative overflow-hidden">
            <img 
              v-if="world.imageUrl" 
              :src="world.imageUrl" 
              :alt="world.name"
              class="w-full h-full object-cover"
            />
            <span v-else class="absolute inset-0 flex items-center justify-center"><Globe :size="48" class="text-sims2-sky opacity-30" /></span>
            
            <!-- Actions overlay -->
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button
                @click.stop="editWorld(world)"
                class="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center backdrop-blur-sm border border-white/20"
              >
                <Pencil :size="14" class="text-white" />
              </button>
              <button
                @click.stop="confirmDelete(world)"
                class="w-8 h-8 rounded-full bg-black/50 hover:bg-red-900/70 flex items-center justify-center backdrop-blur-sm border border-white/20"
              >
                <Trash2 :size="14" class="text-red-400" />
              </button>
            </div>
          </div>

          <!-- World info -->
          <div class="p-4">
            <router-link :to="`/worlds/${world.id}`" class="block">
              <h3 class="text-xl font-bold text-sims2-cream hover:text-sims2-gold transition-colors">
                {{ world.name }}
              </h3>
            </router-link>
            <p v-if="world.description" class="text-sims2-sky text-sm mt-1 line-clamp-2 opacity-80">
              {{ world.description }}
            </p>
            
            <!-- Stats -->
            <div class="flex gap-4 mt-4 text-sm text-sims2-sky">
              <span class="flex items-center gap-1">
                <Home :size="14" /> {{ simsStore.getHousesByWorld(world.id).length }} houses
              </span>
              <span class="flex items-center gap-1">
                <User :size="14" /> {{ simsStore.getSimsByWorld(world.id).length }} sims
              </span>
            </div>

            <!-- View button -->
            <router-link
              :to="`/worlds/${world.id}`"
              class="s2-btn mt-4 block w-full py-2 text-center text-sm no-underline"
            >
              View details →
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <!-- Add/Edit World Modal -->
    <Modal v-model="showAddModal" :title="editingWorld ? 'Edit world' : 'Create new world'">
      <WorldForm 
        :world="editingWorld" 
        @saved="onSaved" 
        @cancel="closeModal" 
      />
    </Modal>

    <!-- Delete confirmation -->
    <Modal v-model="showDeleteModal" title="Delete world?">
      <div class="text-center">
        <AlertTriangle :size="40" class="mx-auto text-amber-400" />
        <p class="text-sims2-cream mt-4 mb-6">
          Are you sure you want to delete <strong class="text-sims2-gold">{{ worldToDelete?.name }}</strong>?
          <br />
          <span class="text-red-400 text-sm">This will also delete all houses and Sims in the world!</span>
        </p>
        <div class="flex gap-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 s2-btn s2-btn-ghost py-3 px-4"
          >
            Cancel
          </button>
          <button
            @click="deleteWorld"
            class="flex-1 s2-btn s2-btn-danger py-3 px-4"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSimsStore } from '@/stores/sims'
import AppHeader from '@/components/AppHeader.vue'
import Modal from '@/components/Modal.vue'
import WorldForm from '@/components/forms/WorldForm.vue'
import { Globe, Home, User, Pencil, Trash2, AlertTriangle } from 'lucide-vue-next'

const simsStore = useSimsStore()

const showAddModal = ref(false)
const showDeleteModal = ref(false)
const editingWorld = ref(null)
const worldToDelete = ref(null)

function editWorld(world) {
  editingWorld.value = world
  showAddModal.value = true
}

function confirmDelete(world) {
  worldToDelete.value = world
  showDeleteModal.value = true
}

async function deleteWorld() {
  if (worldToDelete.value) {
    await simsStore.deleteWorld(worldToDelete.value.id)
    showDeleteModal.value = false
    worldToDelete.value = null
  }
}

function onSaved() {
  closeModal()
}

function closeModal() {
  showAddModal.value = false
  editingWorld.value = null
}
</script>
