<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
    <AppHeader />

    <main class="max-w-4xl mx-auto px-4 py-8">
      <!-- Back link -->
      <router-link to="/sims" class="text-purple-600 hover:text-purple-700 flex items-center gap-1 mb-4">
        ← Tillbaka till alla Simar
      </router-link>

      <!-- Loading -->
      <div v-if="!sim" class="text-center py-12">
        <div class="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
      </div>

      <template v-else>
        <!-- Sim profile card -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div class="md:flex">
            <!-- Image -->
            <div class="md:w-64 h-64 bg-gradient-to-br from-purple-200 to-purple-300 relative flex-shrink-0">
              <img 
                v-if="sim.imageUrl" 
                :src="sim.imageUrl" 
                :alt="sim.name"
                class="w-full h-full object-cover"
              />
              <span v-else class="absolute inset-0 flex items-center justify-center text-8xl opacity-30">👤</span>
            </div>

            <!-- Info -->
            <div class="p-6 flex-1">
              <div class="flex items-start justify-between">
                <div>
                  <h2 class="text-3xl font-bold text-gray-800">{{ sim.name }}</h2>
                  <p class="text-gray-500 mt-1">
                    {{ sim.age || 'Okänd ålder' }}
                    <span v-if="sim.gender"> • {{ sim.gender }}</span>
                  </p>
                </div>
                <div class="flex gap-2">
                  <button
                    @click="showEditModal = true"
                    class="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    ✏️ Redigera
                  </button>
                  <button
                    @click="showDeleteModal = true"
                    class="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <!-- Location -->
              <div v-if="houseInfo" class="mt-4 text-gray-600">
                <router-link :to="`/worlds/${houseInfo.world.id}`" class="hover:text-purple-600">
                  🌍 {{ houseInfo.world.name }}
                </router-link>
                <span class="mx-2">→</span>
                <span>🏠 {{ houseInfo.house.name }}</span>
              </div>

              <!-- Traits -->
              <div v-if="sim.traits?.length" class="mt-4">
                <p class="text-sm text-gray-500 mb-2">Personlighetsdrag:</p>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="trait in sim.traits" 
                    :key="trait"
                    class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {{ trait }}
                  </span>
                </div>
              </div>

              <!-- Aspiration -->
              <div v-if="sim.aspiration" class="mt-4">
                <p class="text-sm text-gray-500">Aspiration:</p>
                <p class="text-purple-600 font-medium">⭐ {{ sim.aspiration }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="flex border-b border-gray-100">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="flex-1 px-6 py-4 text-center font-medium transition-colors"
              :class="activeTab === tab.id 
                ? 'text-purple-600 border-b-2 border-purple-500 bg-purple-50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
            >
              {{ tab.icon }} {{ tab.label }}
            </button>
          </div>

          <div class="p-6">
            <!-- Details tab -->
            <div v-if="activeTab === 'details'" class="space-y-6">
              <!-- Appearance -->
              <div v-if="sim.hairColor || sim.eyeColor || sim.style">
                <h4 class="font-semibold text-gray-800 mb-3">👗 Utseende</h4>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div v-if="sim.hairColor">
                    <span class="text-gray-500">Hårfärg:</span>
                    <p class="font-medium">{{ sim.hairColor }}</p>
                  </div>
                  <div v-if="sim.eyeColor">
                    <span class="text-gray-500">Ögonfärg:</span>
                    <p class="font-medium">{{ sim.eyeColor }}</p>
                  </div>
                  <div v-if="sim.style">
                    <span class="text-gray-500">Klädstil:</span>
                    <p class="font-medium">{{ sim.style }}</p>
                  </div>
                </div>
              </div>

              <!-- Career -->
              <div v-if="sim.career || sim.skills?.length">
                <h4 class="font-semibold text-gray-800 mb-3">💼 Karriär & Färdigheter</h4>
                <div v-if="sim.career" class="mb-3">
                  <span class="text-gray-500">Karriär:</span>
                  <p class="font-medium">{{ sim.career }}</p>
                </div>
                <div v-if="sim.skills?.length" class="flex flex-wrap gap-2">
                  <span 
                    v-for="skill in sim.skills" 
                    :key="skill"
                    class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>

              <!-- Notes -->
              <div v-if="sim.notes">
                <h4 class="font-semibold text-gray-800 mb-3">📝 Anteckningar</h4>
                <p class="text-gray-600 whitespace-pre-wrap">{{ sim.notes }}</p>
              </div>

              <!-- Empty state -->
              <div v-if="!sim.hairColor && !sim.eyeColor && !sim.style && !sim.career && !sim.skills?.length && !sim.notes" 
                   class="text-center py-8 text-gray-400">
                <span class="text-4xl">📋</span>
                <p class="mt-2">Inga detaljer tillagda ännu.</p>
                <button @click="showEditModal = true" class="mt-2 text-purple-600 hover:underline">
                  Lägg till detaljer →
                </button>
              </div>
            </div>

            <!-- Relationships tab -->
            <div v-if="activeTab === 'relationships'">
              <div class="flex justify-between items-center mb-4">
                <h4 class="font-semibold text-gray-800">Relationer</h4>
                <button
                  @click="showAddRelationModal = true"
                  class="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors text-sm"
                >
                  + Lägg till relation
                </button>
              </div>

              <div v-if="simRelationships.length === 0" class="text-center py-8 text-gray-400">
                <span class="text-4xl">💕</span>
                <p class="mt-2">Inga relationer tillagda ännu.</p>
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="rel in simRelationships"
                  :key="rel.id"
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div class="flex items-center gap-4">
                    <router-link 
                      :to="`/sims/${rel.otherSim.id}`"
                      class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 overflow-hidden flex-shrink-0"
                    >
                      <img v-if="rel.otherSim.imageUrl" :src="rel.otherSim.imageUrl" class="w-full h-full object-cover" />
                      <span v-else class="w-full h-full flex items-center justify-center">👤</span>
                    </router-link>
                    <div>
                      <router-link :to="`/sims/${rel.otherSim.id}`" class="font-medium text-gray-800 hover:text-purple-600">
                        {{ rel.otherSim.name }}
                      </router-link>
                      <p class="text-sm" :class="relationshipColor(rel.type)">
                        {{ relationshipLabel(rel.type) }}
                      </p>
                    </div>
                  </div>
                  <button
                    @click="deleteRelation(rel.id)"
                    class="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>

            <!-- Diary tab -->
            <div v-if="activeTab === 'diary'">
              <div class="flex justify-between items-center mb-4">
                <h4 class="font-semibold text-gray-800">Dagbok</h4>
                <button
                  @click="showAddDiaryModal = true"
                  class="px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors text-sm"
                >
                  + Ny anteckning
                </button>
              </div>

              <div v-if="diary.length === 0" class="text-center py-8 text-gray-400">
                <span class="text-4xl">📖</span>
                <p class="mt-2">Dagboken är tom.</p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="entry in diary"
                  :key="entry.id"
                  class="p-4 bg-amber-50 rounded-xl border-l-4 border-amber-400"
                >
                  <div class="flex justify-between items-start mb-2">
                    <span class="text-sm text-amber-600 font-medium">
                      📅 {{ formatDate(entry.date) }}
                    </span>
                    <button
                      @click="deleteDiaryEntry(entry.id)"
                      class="text-gray-400 hover:text-red-500 transition-colors text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                  <p class="text-gray-700 whitespace-pre-wrap">{{ entry.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </main>

    <!-- Edit Sim Modal -->
    <Modal v-model="showEditModal" title="Redigera Sim">
      <SimForm :sim="sim" @saved="onSimSaved" @cancel="showEditModal = false" />
    </Modal>

    <!-- Delete Sim Modal -->
    <Modal v-model="showDeleteModal" title="Ta bort Sim?">
      <div class="text-center">
        <span class="text-5xl">⚠️</span>
        <p class="text-gray-600 mt-4 mb-6">
          Är du säker på att du vill ta bort <strong>{{ sim?.name }}</strong>?
          <br />
          <span class="text-red-500 text-sm">Detta kan inte ångras!</span>
        </p>
        <div class="flex gap-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl"
          >
            Avbryt
          </button>
          <button
            @click="deleteSim"
            class="flex-1 py-3 px-4 bg-red-500 text-white font-semibold rounded-xl"
          >
            Ta bort
          </button>
        </div>
      </div>
    </Modal>

    <!-- Add Relationship Modal -->
    <Modal v-model="showAddRelationModal" title="Lägg till relation">
      <RelationshipForm :simId="simId" @saved="onRelationSaved" @cancel="showAddRelationModal = false" />
    </Modal>

    <!-- Add Diary Entry Modal -->
    <Modal v-model="showAddDiaryModal" title="Ny dagboksanteckning">
      <DiaryForm :simId="simId" @saved="onDiarySaved" @cancel="showAddDiaryModal = false" />
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSimsStore } from '@/stores/sims'
import AppHeader from '@/components/AppHeader.vue'
import Modal from '@/components/Modal.vue'
import SimForm from '@/components/forms/SimForm.vue'
import RelationshipForm from '@/components/forms/RelationshipForm.vue'
import DiaryForm from '@/components/forms/DiaryForm.vue'

const route = useRoute()
const router = useRouter()
const simsStore = useSimsStore()

const simId = computed(() => route.params.simId)
const sim = computed(() => simsStore.getSimById(simId.value))
const diary = computed(() => simsStore.getDiaryForSim(simId.value))

const houseInfo = computed(() => {
  if (!sim.value?.houseId) return null
  const house = simsStore.houses.find(h => h.id === sim.value.houseId)
  if (!house) return null
  const world = simsStore.worlds.find(w => w.id === house.worldId)
  return { house, world }
})

const simRelationships = computed(() => {
  const rels = simsStore.getRelationshipsForSim(simId.value)
  return rels.map(rel => {
    const otherId = rel.sim1Id === simId.value ? rel.sim2Id : rel.sim1Id
    const otherSim = simsStore.sims.find(s => s.id === otherId)
    return { ...rel, otherSim }
  }).filter(rel => rel.otherSim)
})

const activeTab = ref('details')
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showAddRelationModal = ref(false)
const showAddDiaryModal = ref(false)

const tabs = [
  { id: 'details', label: 'Detaljer', icon: '📋' },
  { id: 'relationships', label: 'Relationer', icon: '💕' },
  { id: 'diary', label: 'Dagbok', icon: '📖' }
]

const relationshipTypes = {
  parent: { label: 'Förälder', color: 'text-green-600' },
  child: { label: 'Barn', color: 'text-green-600' },
  sibling: { label: 'Syskon', color: 'text-green-600' },
  spouse: { label: 'Partner', color: 'text-pink-600' },
  ex: { label: 'Ex', color: 'text-pink-400' },
  friend: { label: 'Vän', color: 'text-blue-600' },
  enemy: { label: 'Fiende', color: 'text-red-600' },
  roommate: { label: 'Roommate', color: 'text-yellow-600' },
  mentor: { label: 'Mentor', color: 'text-purple-600' }
}

function relationshipLabel(type) {
  return relationshipTypes[type]?.label || type
}

function relationshipColor(type) {
  return relationshipTypes[type]?.color || 'text-gray-600'
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function onSimSaved() {
  showEditModal.value = false
}

async function deleteSim() {
  await simsStore.deleteSim(simId.value)
  router.push('/sims')
}

async function deleteRelation(relId) {
  await simsStore.deleteRelationship(relId)
}

async function deleteDiaryEntry(entryId) {
  await simsStore.deleteDiaryEntry(entryId)
}

function onRelationSaved() {
  showAddRelationModal.value = false
}

function onDiarySaved() {
  showAddDiaryModal.value = false
}
</script>
