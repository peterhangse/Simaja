<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
    <!-- Header -->
    <AppHeader />

    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Page header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-3xl font-bold text-gray-800">🌍 Mina världar</h2>
          <p class="text-gray-500 mt-1">Hantera dina Sims-världar</p>
        </div>
        <button
          @click="showAddModal = true"
          class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <span>+</span> Ny värld
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="simsStore.isLoading" class="text-center py-12">
        <div class="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
        <p class="text-gray-500 mt-4">Laddar världar...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="simsStore.worlds.length === 0" class="text-center py-12 bg-white rounded-2xl shadow-sm">
        <span class="text-6xl">🌍</span>
        <h3 class="text-xl font-bold text-gray-800 mt-4 mb-2">Inga världar ännu</h3>
        <p class="text-gray-500 mb-6">Skapa din första värld för att komma igång!</p>
        <button 
          @click="showAddModal = true"
          class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg"
        >
          Skapa första världen
        </button>
      </div>

      <!-- Worlds grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="world in simsStore.worlds"
          :key="world.id"
          class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
        >
          <!-- World image -->
          <div class="h-40 bg-gradient-to-br from-green-200 to-emerald-300 relative overflow-hidden">
            <img 
              v-if="world.imageUrl" 
              :src="world.imageUrl" 
              :alt="world.name"
              class="w-full h-full object-cover"
            />
            <span v-else class="absolute inset-0 flex items-center justify-center text-6xl opacity-50">🌍</span>
            
            <!-- Actions overlay -->
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button
                @click.stop="editWorld(world)"
                class="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow"
              >
                ✏️
              </button>
              <button
                @click.stop="confirmDelete(world)"
                class="w-8 h-8 rounded-full bg-white/90 hover:bg-red-100 flex items-center justify-center shadow"
              >
                🗑️
              </button>
            </div>
          </div>

          <!-- World info -->
          <div class="p-4">
            <router-link :to="`/worlds/${world.id}`" class="block">
              <h3 class="text-xl font-bold text-gray-800 hover:text-green-600 transition-colors">
                {{ world.name }}
              </h3>
            </router-link>
            <p v-if="world.description" class="text-gray-500 text-sm mt-1 line-clamp-2">
              {{ world.description }}
            </p>
            
            <!-- Stats -->
            <div class="flex gap-4 mt-4 text-sm text-gray-500">
              <span class="flex items-center gap-1">
                🏠 {{ simsStore.getHousesByWorld(world.id).length }} hus
              </span>
              <span class="flex items-center gap-1">
                👤 {{ simsStore.getSimsByWorld(world.id).length }} simar
              </span>
            </div>

            <!-- View button -->
            <router-link
              :to="`/worlds/${world.id}`"
              class="mt-4 block w-full py-2 text-center bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-green-100 hover:text-green-700 transition-colors"
            >
              Visa detaljer →
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <!-- Add/Edit World Modal -->
    <Modal v-model="showAddModal" :title="editingWorld ? 'Redigera värld' : 'Skapa ny värld'">
      <WorldForm 
        :world="editingWorld" 
        @saved="onSaved" 
        @cancel="closeModal" 
      />
    </Modal>

    <!-- Delete confirmation -->
    <Modal v-model="showDeleteModal" title="Ta bort värld?">
      <div class="text-center">
        <span class="text-5xl">⚠️</span>
        <p class="text-gray-600 mt-4 mb-6">
          Är du säker på att du vill ta bort <strong>{{ worldToDelete?.name }}</strong>?
          <br />
          <span class="text-red-500 text-sm">Detta tar även bort alla hus och Simar i världen!</span>
        </p>
        <div class="flex gap-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Avbryt
          </button>
          <button
            @click="deleteWorld"
            class="flex-1 py-3 px-4 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
          >
            Ta bort
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
