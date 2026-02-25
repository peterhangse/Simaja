<template>
  <div class="min-h-screen">
    <AppHeader />

    <main class="max-w-4xl mx-auto px-4 py-8 relative z-[1]">
      <!-- Back link -->
      <router-link to="/sims" class="text-sims2-sky hover:text-sims2-gold flex items-center gap-1 mb-4">
        ← Back to all Sims
      </router-link>

      <!-- Loading -->
      <div v-if="!sim" class="text-center py-12">
        <div class="animate-spin w-12 h-12 border-4 border-sims2-sky border-t-transparent rounded-full mx-auto"></div>
      </div>

      <template v-else>
        <!-- Sim profile card -->
        <div class="s2-panel overflow-hidden mb-6">
          <div class="md:flex">
            <!-- Image -->
            <div class="md:w-64 h-64 relative flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-sims2-navy to-sims2-panel">
              <img 
                v-if="sim.imageUrl" 
                :src="sim.imageUrl" 
                :alt="sim.name"
                class="w-full h-full object-cover"
              />
              <SimAvatar v-else :sim="sim" size="xl" />
            </div>

            <!-- Info -->
            <div class="p-6 flex-1">
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center gap-3">
                    <h2 class="text-3xl font-bold text-sims2-gold font-display">{{ sim.name }}</h2>
                    <span v-if="sim.status === 'planned'" class="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-semibold flex items-center gap-1"><CloudCog :size="14" /> Planned</span>
                    <span v-else class="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold flex items-center gap-1"><CircleDot :size="14" /> Active</span>
                  </div>
                  <p class="text-sims2-sky mt-1">
                    {{ sim.age || 'Unknown age' }}
                    <span v-if="sim.gender"> • {{ sim.gender }}</span>
                  </p>
                </div>
                <div class="flex gap-2">
                  <button
                    @click="showEditModal = true"
                    class="s2-btn px-4 py-2 text-sm flex items-center gap-1"
                  >
                    <Pencil :size="14" /> Edit
                  </button>
                  <button
                    @click="showDeleteModal = true"
                    class="px-4 py-2 bg-red-900/40 text-red-400 rounded-lg border-2 border-red-500/30 hover:bg-red-900/60 transition-colors"
                  >
                    <Trash2 :size="14" />
                  </button>
                </div>
              </div>

              <!-- Location -->
              <div v-if="houseInfo" class="mt-4 text-sims2-sky">
                <router-link :to="`/worlds/${houseInfo.world.id}`" class="hover:text-sims2-gold inline-flex items-center gap-1">
                  <Globe :size="14" /> {{ houseInfo.world.name }}
                </router-link>
                <span class="mx-2">→</span>
                <span class="inline-flex items-center gap-1"><Home :size="14" /> {{ houseInfo.house.name }}</span>
              </div>
              <div v-else-if="sim.status === 'planned'" class="mt-4 text-amber-400 text-sm flex items-center gap-1">
                <CloudCog :size="14" /> No house assigned yet — this Sim is still being planned
              </div>

              <!-- Traits -->
              <div v-if="sim.traits?.length" class="mt-4">
                <p class="text-sm text-sims2-sky mb-2">Personality traits:</p>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="trait in sim.traits" 
                    :key="trait"
                    class="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                  >
                    {{ trait }}
                  </span>
                </div>
              </div>

              <!-- Aspiration -->
              <div v-if="sim.aspiration" class="mt-4">
                <p class="text-sm text-sims2-sky">Aspiration:</p>
                <p class="text-purple-300 font-medium flex items-center gap-1"><Star :size="14" /> {{ sim.aspiration }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="s2-panel overflow-hidden">
          <div class="flex border-b border-sims2-sky/10">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="flex-1 px-6 py-4 text-center font-bold transition-colors"
              :class="activeTab === tab.id 
                ? 'text-sims2-gold border-b-2 border-sims2-gold bg-white/5' 
                : 'text-sims2-sky hover:text-sims2-cream hover:bg-white/5'"
            >
              {{ tab.icon }} {{ tab.label }}
            </button>
          </div>

          <div class="p-6">
            <!-- Details tab -->
            <div v-if="activeTab === 'details'" class="space-y-6">
              <!-- Appearance -->
              <div v-if="sim.hairColor || sim.eyeColor || sim.style">
                <h4 class="font-bold text-sims2-gold mb-3 flex items-center gap-2"><Shirt :size="16" class="text-purple-400" /> Appearance</h4>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div v-if="sim.hairColor">
                    <span class="text-sims2-sky">Hair color:</span>
                    <p class="font-medium text-sims2-cream">{{ sim.hairColor }}</p>
                  </div>
                  <div v-if="sim.eyeColor">
                    <span class="text-sims2-sky">Eye color:</span>
                    <p class="font-medium text-sims2-cream">{{ sim.eyeColor }}</p>
                  </div>
                  <div v-if="sim.style">
                    <span class="text-sims2-sky">Clothing style:</span>
                    <p class="font-medium text-sims2-cream">{{ sim.style }}</p>
                  </div>
                </div>
              </div>

              <!-- Career -->
              <div v-if="sim.career || sim.skills?.length">
                <h4 class="font-bold text-sims2-gold mb-3 flex items-center gap-2"><Briefcase :size="16" class="text-blue-400" /> Career & Skills</h4>
                <div v-if="sim.career" class="mb-3">
                  <span class="text-sims2-sky">Career:</span>
                  <p class="font-medium text-sims2-cream">{{ sim.career }}</p>
                </div>
                <div v-if="sim.skills?.length" class="flex flex-wrap gap-2">
                  <span 
                    v-for="skill in sim.skills" 
                    :key="skill"
                    class="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>

              <!-- Notes -->
              <div v-if="sim.notes">
                <h4 class="font-bold text-sims2-gold mb-3 flex items-center gap-2"><FileText :size="16" class="text-sims2-sky" /> Notes</h4>
                <p class="text-sims2-cream whitespace-pre-wrap">{{ sim.notes }}</p>
              </div>

              <!-- Concept (planned sims) -->
              <div v-if="sim.concept">
                <h4 class="font-bold text-sims2-gold mb-3 flex items-center gap-2"><Lightbulb :size="16" class="text-amber-400" /> Concept</h4>
                <p class="text-sims2-cream whitespace-pre-wrap">{{ sim.concept }}</p>
              </div>

              <!-- Interests -->
              <div v-if="sim.interests?.length">
                <h4 class="font-bold text-sims2-gold mb-3 flex items-center gap-2"><Sparkles :size="16" class="text-amber-400" /> Interests</h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="interest in sim.interests"
                    :key="interest"
                    class="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm"
                  >
                    {{ interest }}
                  </span>
                </div>
              </div>

              <!-- Empty state -->
              <div v-if="!sim.hairColor && !sim.eyeColor && !sim.style && !sim.career && !sim.skills?.length && !sim.notes && !sim.concept && !sim.interests?.length" 
                   class="text-center py-8 text-sims2-sky">
                <ClipboardList :size="32" class="mx-auto text-sims2-sky opacity-40" />
                <p class="mt-2">No details added yet.</p>
                <button @click="showEditModal = true" class="mt-2 text-sims2-gold hover:underline">
                  Add details →
                </button>
              </div>
            </div>

            <!-- Relationships tab -->
            <div v-if="activeTab === 'relationships'">
              <div class="flex justify-between items-center mb-4">
                <h4 class="font-bold text-sims2-gold">Relationships</h4>
                <button
                  @click="showAddRelationModal = true"
                  class="s2-btn text-sm px-4 py-2"
                >
                  + Add relationship
                </button>
              </div>

              <div v-if="simRelationships.length === 0" class="text-center py-8 text-sims2-sky">
                <Heart :size="32" class="mx-auto text-sims2-sky opacity-40" />
                <p class="mt-2">No relationships added yet.</p>
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="rel in simRelationships"
                  :key="rel.id"
                  class="flex items-center justify-between p-4 s2-panel-inner"
                >
                  <div class="flex items-center gap-4 flex-1 min-w-0">
                  <SimAvatar :sim="rel.otherSim" size="sm" />
                    <div class="flex-1 min-w-0">
                      <router-link :to="`/sims/${rel.otherSim.id}`" class="font-medium text-sims2-cream hover:text-sims2-gold">
                        {{ rel.otherSim.name }}
                      </router-link>
                      <p class="text-sm" :class="relationshipColor(rel.type)">
                        {{ relationshipLabel(rel.type) }}
                      </p>
                      <!-- Sims 2 relationship strength bar -->
                      <div class="mt-1.5 flex items-center gap-2">
                        <div class="s2-need-bar flex-1">
                          <div
                            class="s2-need-bar-fill"
                            :class="relationshipBarFill(rel.type)"
                            :style="{ width: (relationshipTypes[rel.type]?.strength || 50) + '%' }"
                          ></div>
                        </div>
                        <span class="text-xs text-sims2-sky w-6 text-right">{{ relationshipTypes[rel.type]?.strength || 50 }}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    @click="deleteRelation(rel.id)"
                    class="text-sims2-sky/40 hover:text-red-400 transition-colors"
                  >
                    <Trash2 :size="14" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Diary tab -->
            <div v-if="activeTab === 'diary'">
              <div class="flex justify-between items-center mb-4">
                <h4 class="font-bold text-sims2-gold">Diary</h4>
                <button
                  @click="showAddDiaryModal = true"
                  class="s2-btn s2-btn-gold text-sm px-4 py-2"
                >
                  + New entry
                </button>
              </div>

              <div v-if="diary.length === 0" class="text-center py-8 text-sims2-sky">
                <BookOpen :size="32" class="mx-auto text-sims2-sky opacity-40" />
                <p class="mt-2">The diary is empty.</p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="entry in diary"
                  :key="entry.id"
                  class="p-4 s2-panel-inner border-l-4 border-sims2-gold"
                >
                  <div class="flex justify-between items-start mb-2">
                    <span class="text-sm text-sims2-gold font-medium flex items-center gap-1">
                      <Calendar :size="12" /> {{ formatDate(entry.date) }}
                    </span>
                    <button
                      @click="deleteDiaryEntry(entry.id)"
                      class="text-sims2-sky/40 hover:text-red-400 transition-colors text-sm"
                    >
                      <Trash2 :size="12" />
                    </button>
                  </div>
                  <p class="text-sims2-cream whitespace-pre-wrap">{{ entry.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </main>

    <!-- Edit Sim Modal -->
    <Modal v-model="showEditModal" title="Edit Sim">
      <SimForm :sim="sim" @saved="onSimSaved" @cancel="showEditModal = false" />
    </Modal>

    <!-- Delete Sim Modal -->
    <Modal v-model="showDeleteModal" title="Delete Sim?">
      <div class="text-center">
        <AlertTriangle :size="40" class="mx-auto text-amber-400" />
        <p class="text-sims2-cream mt-4 mb-6">
          Are you sure you want to delete <strong class="text-sims2-gold">{{ sim?.name }}</strong>?
          <br />
          <span class="text-red-400 text-sm">This cannot be undone!</span>
        </p>
        <div class="flex gap-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 s2-btn s2-btn-ghost py-3 px-4"
          >
            Cancel
          </button>
          <button
            @click="deleteSim"
            class="flex-1 s2-btn s2-btn-danger py-3 px-4"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>

    <!-- Add Relationship Modal -->
    <Modal v-model="showAddRelationModal" title="Add relationship">
      <RelationshipForm :simId="simId" @saved="onRelationSaved" @cancel="showAddRelationModal = false" />
    </Modal>

    <!-- Add Diary Entry Modal -->
    <Modal v-model="showAddDiaryModal" title="New diary entry">
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
import SimAvatar from '@/components/SimAvatar.vue'
import { User, Pencil, Trash2, Globe, Home, CloudCog, CircleDot, Star, Shirt, Briefcase, FileText, Lightbulb, Sparkles, ClipboardList, Heart, BookOpen, Calendar, AlertTriangle } from 'lucide-vue-next'

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
  { id: 'details', label: 'Details', icon: '📋' },
  { id: 'relationships', label: 'Relationships', icon: '�' },
  { id: 'diary', label: 'Diary', icon: '📖' }
]

const relationshipTypes = {
  parent: { label: 'Parent', color: 'text-green-600', barColor: 'bg-green-500', strength: 80 },
  child: { label: 'Child', color: 'text-green-600', barColor: 'bg-green-500', strength: 80 },
  sibling: { label: 'Sibling', color: 'text-green-600', barColor: 'bg-green-400', strength: 70 },
  spouse: { label: 'Spouse', color: 'text-pink-600', barColor: 'bg-pink-500', strength: 95 },
  ex: { label: 'Ex', color: 'text-pink-400', barColor: 'bg-pink-300', strength: 25 },
  friend: { label: 'Friend', color: 'text-blue-600', barColor: 'bg-blue-400', strength: 60 },
  enemy: { label: 'Enemy', color: 'text-red-600', barColor: 'bg-red-500', strength: 10 },
  roommate: { label: 'Roommate', color: 'text-yellow-600', barColor: 'bg-yellow-400', strength: 50 },
  mentor: { label: 'Mentor', color: 'text-purple-300', barColor: 'bg-purple-400', strength: 40 }
}

function relationshipLabel(type) {
  return relationshipTypes[type]?.label || type
}

function relationshipColor(type) {
  return relationshipTypes[type]?.color || 'text-gray-400'
}

function relationshipBarFill(type) {
  const map = { parent: 'fill-green', child: 'fill-green', sibling: 'fill-green', spouse: 'fill-pink', ex: 'fill-pink', friend: 'fill-blue', enemy: 'fill-red', roommate: 'fill-gold', mentor: 'fill-purple' }
  return map[type] || 'fill-blue'
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
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
