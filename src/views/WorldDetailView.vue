<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
    <AppHeader />

    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Back link -->
      <router-link to="/worlds" class="text-green-600 hover:text-green-700 flex items-center gap-1 mb-4">
        ← Tillbaka till världar
      </router-link>

      <!-- Loading -->
      <div v-if="!world" class="text-center py-12">
        <div class="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
      </div>

      <template v-else>
        <!-- World header -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div class="h-48 bg-gradient-to-br from-green-200 to-emerald-300 relative">
            <img 
              v-if="world.imageUrl" 
              :src="world.imageUrl" 
              :alt="world.name"
              class="w-full h-full object-cover"
            />
            <span v-else class="absolute inset-0 flex items-center justify-center text-8xl opacity-30">🌍</span>
          </div>
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div>
                <h2 class="text-3xl font-bold text-gray-800">{{ world.name }}</h2>
                <p v-if="world.description" class="text-gray-500 mt-2">{{ world.description }}</p>
              </div>
              <button
                @click="showEditWorldModal = true"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                ✏️ Redigera
              </button>
            </div>
            
            <!-- Stats -->
            <div class="flex gap-6 mt-4 text-gray-600">
              <span>🏠 {{ houses.length }} hus</span>
              <span>👤 {{ worldSims.length }} simar</span>
            </div>
          </div>
        </div>

        <!-- Houses section -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-2xl font-bold text-gray-800">🏠 Hus i {{ world.name }}</h3>
          <button
            @click="showAddHouseModal = true"
            class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow hover:shadow-lg transition-all"
          >
            + Nytt hus
          </button>
        </div>

        <!-- Empty houses state -->
        <div v-if="houses.length === 0" class="text-center py-8 bg-white rounded-2xl shadow-sm mb-8">
          <span class="text-5xl">🏠</span>
          <p class="text-gray-500 mt-4">Inga hus i denna värld ännu.</p>
          <button 
            @click="showAddHouseModal = true"
            class="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Skapa första huset
          </button>
        </div>

        <!-- Houses grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div
            v-for="house in houses"
            :key="house.id"
            class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
          >
            <div class="h-32 bg-gradient-to-br from-blue-200 to-blue-300 relative">
              <img 
                v-if="house.imageUrl" 
                :src="house.imageUrl" 
                :alt="house.name"
                class="w-full h-full object-cover"
              />
              <span v-else class="absolute inset-0 flex items-center justify-center text-5xl opacity-50">🏠</span>
              
              <!-- Actions -->
              <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  @click.stop="editHouse(house)"
                  class="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow"
                >
                  ✏️
                </button>
                <button
                  @click.stop="confirmDeleteHouse(house)"
                  class="w-8 h-8 rounded-full bg-white/90 hover:bg-red-100 flex items-center justify-center shadow"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <div class="p-4">
              <h4 class="font-bold text-gray-800">{{ house.name }}</h4>
              <p v-if="house.address" class="text-sm text-gray-500">{{ house.address }}</p>
              
              <!-- Sims in house -->
              <div class="mt-3">
                <p class="text-xs text-gray-400 mb-2">Boende:</p>
                <div class="flex flex-wrap gap-1">
                  <router-link
                    v-for="sim in getSimsInHouse(house.id)"
                    :key="sim.id"
                    :to="`/sims/${sim.id}`"
                    class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-purple-400 transition-all"
                    :title="sim.name"
                  >
                    <img v-if="sim.imageUrl" :src="sim.imageUrl" class="w-full h-full object-cover" />
                    <span v-else class="text-xs">👤</span>
                  </router-link>
                  <button
                    @click="addSimToHouse(house)"
                    class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-green-100 hover:text-green-600 transition-colors text-gray-400"
                    title="Lägg till Sim"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </main>

    <!-- Edit World Modal -->
    <Modal v-model="showEditWorldModal" title="Redigera värld">
      <WorldForm :world="world" @saved="onWorldSaved" @cancel="showEditWorldModal = false" />
    </Modal>

    <!-- Add/Edit House Modal -->
    <Modal v-model="showAddHouseModal" :title="editingHouse ? 'Redigera hus' : 'Skapa nytt hus'">
      <HouseForm 
        :house="editingHouse" 
        :worldId="worldId"
        @saved="onHouseSaved" 
        @cancel="closeHouseModal" 
      />
    </Modal>

    <!-- Add Sim Modal -->
    <Modal v-model="showAddSimModal" title="Lägg till Sim">
      <SimForm 
        :sim="prefilledSim"
        @saved="onSimSaved" 
        @cancel="showAddSimModal = false" 
      />
    </Modal>

    <!-- Delete House confirmation -->
    <Modal v-model="showDeleteHouseModal" title="Ta bort hus?">
      <div class="text-center">
        <span class="text-5xl">⚠️</span>
        <p class="text-gray-600 mt-4 mb-6">
          Är du säker på att du vill ta bort <strong>{{ houseToDelete?.name }}</strong>?
        </p>
        <div class="flex gap-3">
          <button
            @click="showDeleteHouseModal = false"
            class="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Avbryt
          </button>
          <button
            @click="deleteHouse"
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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSimsStore } from '@/stores/sims'
import AppHeader from '@/components/AppHeader.vue'
import Modal from '@/components/Modal.vue'
import WorldForm from '@/components/forms/WorldForm.vue'
import HouseForm from '@/components/forms/HouseForm.vue'
import SimForm from '@/components/forms/SimForm.vue'

const route = useRoute()
const simsStore = useSimsStore()

const worldId = computed(() => route.params.worldId)
const world = computed(() => simsStore.getWorldById(worldId.value))
const houses = computed(() => simsStore.getHousesByWorld(worldId.value))
const worldSims = computed(() => simsStore.getSimsByWorld(worldId.value))

const showEditWorldModal = ref(false)
const showAddHouseModal = ref(false)
const showAddSimModal = ref(false)
const showDeleteHouseModal = ref(false)
const editingHouse = ref(null)
const houseToDelete = ref(null)
const prefilledSim = ref(null)

function getSimsInHouse(houseId) {
  return simsStore.getSimsByHouse(houseId)
}

function editHouse(house) {
  editingHouse.value = house
  showAddHouseModal.value = true
}

function confirmDeleteHouse(house) {
  houseToDelete.value = house
  showDeleteHouseModal.value = true
}

async function deleteHouse() {
  if (houseToDelete.value) {
    await simsStore.deleteHouse(houseToDelete.value.id)
    showDeleteHouseModal.value = false
    houseToDelete.value = null
  }
}

function addSimToHouse(house) {
  prefilledSim.value = { houseId: house.id }
  showAddSimModal.value = true
}

function onWorldSaved() {
  showEditWorldModal.value = false
}

function onHouseSaved() {
  closeHouseModal()
}

function closeHouseModal() {
  showAddHouseModal.value = false
  editingHouse.value = null
}

function onSimSaved() {
  showAddSimModal.value = false
  prefilledSim.value = null
}
</script>
