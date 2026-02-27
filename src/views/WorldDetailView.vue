<template>
  <div class="min-h-screen">
    <AppHeader />

    <main class="max-w-7xl mx-auto px-4 py-8 relative z-[1]">
      <!-- Back link -->
      <router-link to="/worlds" class="text-sims2-sky hover:text-sims2-gold flex items-center gap-1 mb-4">
        ← Back to worlds
      </router-link>

      <!-- Loading -->
      <div v-if="!world" class="text-center py-12">
        <div class="animate-spin w-12 h-12 border-4 border-sims2-sky border-t-transparent rounded-full mx-auto"></div>
      </div>

      <template v-else>
        <!-- World header -->
        <div class="s2-panel overflow-hidden mb-8">
          <div class="h-48 bg-gradient-to-br from-sims2-navy to-sims2-panel relative">
            <img 
              v-if="world.imageUrl" 
              :src="world.imageUrl" 
              :alt="world.name"
              class="w-full h-full object-cover"
            />
            <span v-else class="absolute inset-0 flex items-center justify-center"><Globe :size="64" class="text-sims2-sky opacity-20" /></span>
          </div>
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div>
                <h2 class="text-3xl font-bold text-sims2-gold font-display">{{ world.name }}</h2>
                <p v-if="world.description" class="text-sims2-sky mt-2">{{ world.description }}</p>
              </div>
              <button
                @click="showEditWorldModal = true"
                class="s2-btn px-4 py-2 text-sm flex items-center gap-1"
              >
                <Pencil :size="14" /> Edit
              </button>
            </div>
            
            <!-- Stats -->
            <div class="flex gap-6 mt-4 text-sims2-sky">
              <span class="flex items-center gap-1"><Home :size="16" /> {{ houses.length }} houses</span>
              <span class="flex items-center gap-1"><User :size="16" /> {{ worldSims.length }} sims</span>
            </div>
          </div>
        </div>

        <!-- Houses section -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-2xl font-bold text-sims2-gold font-display"><Home :size="22" class="inline text-blue-600" /> Houses in {{ world.name }}</h3>
          <button
            @click="showAddHouseModal = true"
            class="s2-btn flex items-center gap-1"
          >
            + New house
          </button>
        </div>

        <!-- Empty houses state -->
        <div v-if="houses.length === 0" class="text-center py-8 s2-panel mb-8">
          <Home :size="40" class="mx-auto text-sims2-sky opacity-40" />
          <p class="text-sims2-sky mt-4">No houses in this world yet.</p>
          <button 
            @click="showAddHouseModal = true"
            class="s2-btn mt-4"
          >
            Create first house
          </button>
        </div>

        <!-- Houses grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div
            v-for="house in houses"
            :key="house.id"
            class="s2-card overflow-hidden group"
          >
            <div class="h-32 bg-gradient-to-br from-sims2-navy to-sims2-panel relative">
              <img 
                v-if="house.imageUrl" 
                :src="house.imageUrl" 
                :alt="house.name"
                class="w-full h-full object-cover"
              />
              <span v-else class="absolute inset-0 flex items-center justify-center"><Home :size="36" class="text-sims2-sky opacity-30" /></span>
              
              <!-- Actions -->
              <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  @click.stop="editHouse(house)"
                  class="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center backdrop-blur-sm border border-white/20"
                >
                  <Pencil :size="14" class="text-white" />
                </button>
                <button
                  @click.stop="confirmDeleteHouse(house)"
                  class="w-8 h-8 rounded-full bg-black/50 hover:bg-red-900/70 flex items-center justify-center backdrop-blur-sm border border-white/20"
                >
                  <Trash2 :size="14" class="text-red-500" />
                </button>
              </div>
            </div>
            
            <div class="p-4">
              <h4 class="font-bold text-sims2-cream">{{ house.name }}</h4>
              <p v-if="house.address" class="text-sm text-sims2-sky">{{ house.address }}</p>
              
              <!-- Sims in house -->
              <div class="mt-3">
                <p class="text-xs text-sims2-sky/60 mb-2">Residents:</p>
                <div class="flex flex-wrap gap-1">
                  <router-link
                    v-for="sim in getSimsInHouse(house.id)"
                    :key="sim.id"
                    :to="`/sims/${sim.id}`"
                    class="hover:ring-2 hover:ring-sims2-gold transition-all rounded-full"
                    :title="sim.name"
                  >
                    <SimAvatar :sim="sim" size="xs" />
                  </router-link>
                  <button
                    @click="addSimToHouse(house)"
                    class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-green-100 hover:text-green-600 transition-colors text-gray-400 border border-gray-200"
                    title="Add Sim"
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
    <Modal v-model="showEditWorldModal" title="Edit world">
      <WorldForm :world="world" @saved="onWorldSaved" @cancel="showEditWorldModal = false" />
    </Modal>

    <!-- Add/Edit House Modal -->
    <Modal v-model="showAddHouseModal" :title="editingHouse ? 'Edit house' : 'Create new house'">
      <HouseForm 
        :house="editingHouse" 
        :worldId="worldId"
        @saved="onHouseSaved" 
        @cancel="closeHouseModal" 
      />
    </Modal>

    <!-- Add Sim Modal -->
    <Modal v-model="showAddSimModal" title="Add Sim">
      <SimForm 
        :sim="prefilledSim"
        @saved="onSimSaved" 
        @cancel="showAddSimModal = false" 
      />
    </Modal>

    <!-- Delete House confirmation -->
    <Modal v-model="showDeleteHouseModal" title="Delete house?">
      <div class="text-center">
        <AlertTriangle :size="40" class="mx-auto text-amber-500" />
        <p class="text-sims2-cream mt-4 mb-6">
          Are you sure you want to delete <strong class="text-sims2-gold">{{ houseToDelete?.name }}</strong>?
        </p>
        <div class="flex gap-3">
          <button
            @click="showDeleteHouseModal = false"
            class="flex-1 s2-btn s2-btn-ghost py-3 px-4"
          >
            Cancel
          </button>
          <button
            @click="deleteHouse"
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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSimsStore } from '@/stores/sims'
import AppHeader from '@/components/AppHeader.vue'
import Modal from '@/components/Modal.vue'
import WorldForm from '@/components/forms/WorldForm.vue'
import HouseForm from '@/components/forms/HouseForm.vue'
import SimForm from '@/components/forms/SimForm.vue'
import SimAvatar from '@/components/SimAvatar.vue'
import { Globe, Home, User, Pencil, Trash2, AlertTriangle } from 'lucide-vue-next'

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
