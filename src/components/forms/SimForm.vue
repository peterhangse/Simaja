<template>
  <form @submit.prevent="saveSim" class="space-y-4">
    <!-- Error message -->
    <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
      ⚠️ {{ errorMessage }}
    </div>

    <!-- Sim status toggle -->
    <div class="flex gap-2 bg-gray-100 rounded-xl p-1 border border-gray-200">
      <button
        type="button"
        @click="form.status = 'active'"
        class="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all"
        :class="form.status === 'active' ? 'bg-green-100 shadow text-green-700 border border-green-300' : 'text-gray-500 hover:text-gray-700'"
      >
        👤 Active Sim
      </button>
      <button
        type="button"
        @click="form.status = 'planned'"
        class="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all"
        :class="form.status === 'planned' ? 'bg-amber-100 shadow text-amber-700 border border-amber-300' : 'text-gray-500 hover:text-gray-700'"
      >
        💡 Planned Sim
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b border-gray-200 mb-4">
      <button
        v-for="tab in visibleTabs"
        :key="tab.id"
        type="button"
        @click="activeTab = tab.id"
        class="px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px"
        :class="activeTab === tab.id 
          ? 'border-emerald-600 text-emerald-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        {{ tab.icon }} {{ tab.label }}
      </button>
    </div>

    <!-- Basic Info Tab -->
    <div v-show="activeTab === 'basic'" class="space-y-4">
      <!-- Image and name row -->
      <div class="flex gap-4">
        <div>
          <div 
            class="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden s2-upload-zone cursor-pointer transition-colors"
            @click="$refs.fileInput.click()"
          >
            <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover" />
            <span v-else class="text-3xl">{{ form.status === 'planned' ? '💡' : '👤' }}</span>
          </div>
          <input
            type="file"
            accept="image/*"
            @change="handleImageChange"
            class="hidden"
            ref="fileInput"
          />
        </div>
        <div class="flex-1 space-y-3">
          <input
            v-model="form.name"
            type="text"
            placeholder="Sim name *"
            class="input-field"
            required
          />
          <div class="grid grid-cols-2 gap-2">
            <select v-model="form.age" class="input-field">
              <option value="">Age...</option>
              <option v-for="age in ageOptions" :key="age" :value="age">{{ age }}</option>
            </select>
            <select v-model="form.gender" class="input-field">
              <option value="">Gender...</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <!-- House selection (only for active sims) -->
      <div v-if="form.status === 'active'">
        <label class="block s2-label mb-1">House *</label>
        <select v-model="form.houseId" class="input-field" :required="form.status === 'active'">
          <option value="">Choose house...</option>
          <optgroup v-for="world in simsStore.worlds" :key="world.id" :label="world.name">
            <option 
              v-for="house in simsStore.getHousesByWorld(world.id)" 
              :key="house.id" 
              :value="house.id"
            >
              {{ house.name }}
            </option>
          </optgroup>
        </select>
        <p v-if="simsStore.houses.length === 0" class="text-sm text-amber-400 mt-1">
          ⚠️ You need to create a house first
        </p>
      </div>

      <!-- Planned sim concept (only for planned sims) -->
      <div v-if="form.status === 'planned'" class="space-y-3">
        <div>
          <label class="block s2-label mb-1">Concept</label>
          <textarea
            v-model="form.concept"
            placeholder="Describe your idea for this Sim..."
            rows="2"
            class="input-field resize-none"
          />
        </div>
        <div>
          <label class="block s2-label mb-1">Interests</label>
          <input
            v-model="form.interests"
            type="text"
            placeholder="e.g. cooking, gardening, music (comma separated)"
            class="input-field"
          />
        </div>
      </div>
    </div>

    <!-- Personality Tab -->
    <div v-show="activeTab === 'personality'" class="space-y-4">
      <!-- Traits -->
      <div>
        <label class="block s2-label mb-2">
          Traits (choose up to 3)
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="trait in traitOptions"
            :key="trait"
            type="button"
            @click="toggleTrait(trait)"
            class="px-3 py-1 rounded-full text-sm transition-all"
            :class="form.traits.includes(trait) 
              ? 'bg-green-100 text-green-700 ring-1 ring-green-400' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            :disabled="form.traits.length >= 3 && !form.traits.includes(trait)"
          >
            {{ trait }}
          </button>
        </div>
      </div>

      <!-- Aspiration -->
      <div>
        <label class="block s2-label mb-1">Aspiration</label>
        <select v-model="form.aspiration" class="input-field">
          <option value="">Choose aspiration...</option>
          <optgroup v-for="(asps, category) in aspirationOptions" :key="category" :label="category">
            <option v-for="asp in asps" :key="asp" :value="asp">{{ asp }}</option>
          </optgroup>
        </select>
      </div>
    </div>

    <!-- Appearance Tab -->
    <div v-show="activeTab === 'appearance'" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block s2-label mb-1">Hair color</label>
          <input v-model="form.hairColor" type="text" placeholder="e.g. Brown" class="input-field" />
        </div>
        <div>
          <label class="block s2-label mb-1">Eye color</label>
          <input v-model="form.eyeColor" type="text" placeholder="e.g. Blue" class="input-field" />
        </div>
      </div>
      <div>
        <label class="block s2-label mb-1">Clothing style</label>
        <input v-model="form.style" type="text" placeholder="Describe the style..." class="input-field" />
      </div>
    </div>

    <!-- Career Tab -->
    <div v-show="activeTab === 'career'" class="space-y-4">
      <div>
        <label class="block s2-label mb-1">Career</label>
        <select v-model="form.career" class="input-field">
          <option value="">Choose career...</option>
          <option v-for="career in careerOptions" :key="career" :value="career">{{ career }}</option>
        </select>
      </div>
      
      <div>
        <label class="block s2-label mb-2">Skills</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="skill in skillOptions"
            :key="skill"
            type="button"
            @click="toggleSkill(skill)"
            class="px-3 py-1 rounded-full text-sm transition-all"
            :class="form.skills.includes(skill) 
              ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            {{ skill }}
          </button>
        </div>
      </div>
    </div>

    <!-- Notes Tab -->
    <div v-show="activeTab === 'notes'" class="space-y-4">
      <div>
        <label class="block s2-label mb-1">Notes</label>
        <textarea
          v-model="form.notes"
          placeholder="Write notes about this Sim..."
          rows="5"
          class="input-field resize-none"
        />
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 pt-4 border-t border-gray-200">
      <button
        type="button"
        @click="$emit('cancel')"
        class="s2-btn s2-btn-ghost py-3 px-4"
      >
        Cancel
      </button>
      <button
        v-if="!editMode"
        type="button"
        @click="$emit('import')"
        class="s2-btn s2-btn-ghost py-3 px-4 flex items-center gap-2"
      >
        📸 Import
      </button>
      <button
        type="submit"
        :disabled="isSaving || !form.name.trim() || (form.status === 'active' && !form.houseId)"
        class="flex-1 s2-btn s2-btn-green py-3 px-4 disabled:opacity-50"
      >
        {{ isSaving ? 'Saving...' : (editMode ? 'Update' : 'Create Sim') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useSimsStore } from '@/stores/sims'
import { getTraitOptions, getAspirationOptions, getCareerOptions, getSkillOptions, getAgeOptions } from '@/data/sims4Data'

const props = defineProps({
  sim: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['saved', 'cancel', 'import'])

const simsStore = useSimsStore()

const editMode = ref(false)
const isSaving = ref(false)
const activeTab = ref('basic')
const imagePreview = ref(null)
const imageFile = ref(null)
const errorMessage = ref('')

const allTabs = [
  { id: 'basic', label: 'Basic', icon: '👤' },
  { id: 'personality', label: 'Personality', icon: '💭' },
  { id: 'appearance', label: 'Appearance', icon: '👗' },
  { id: 'career', label: 'Career', icon: '💼' },
  { id: 'notes', label: 'Notes', icon: '📝' }
]

const visibleTabs = computed(() => allTabs)

const form = reactive({
  name: '',
  age: '',
  gender: '',
  houseId: '',
  status: 'active',
  concept: '',
  interests: '',
  traits: [],
  aspiration: '',
  hairColor: '',
  eyeColor: '',
  style: '',
  career: '',
  skills: [],
  notes: ''
})

const ageOptions = getAgeOptions()

const traitOptions = getTraitOptions()

const aspirationOptions = getAspirationOptions()

const careerOptions = getCareerOptions()

const skillOptions = getSkillOptions()

onMounted(() => {
  if (props.sim) {
    editMode.value = true
    Object.assign(form, {
      name: props.sim.name,
      age: props.sim.age || '',
      gender: props.sim.gender || '',
      houseId: props.sim.houseId || '',
      status: props.sim.status || 'active',
      concept: props.sim.concept || '',
      interests: (props.sim.interests || []).join(', '),
      traits: props.sim.traits || [],
      aspiration: props.sim.aspiration || '',
      hairColor: props.sim.hairColor || '',
      eyeColor: props.sim.eyeColor || '',
      style: props.sim.style || '',
      career: props.sim.career || '',
      skills: props.sim.skills || [],
      notes: props.sim.notes || ''
    })
    imagePreview.value = props.sim.imageUrl || null
  }
})

function toggleTrait(trait) {
  const index = form.traits.indexOf(trait)
  if (index > -1) {
    form.traits.splice(index, 1)
  } else if (form.traits.length < 3) {
    form.traits.push(trait)
  }
}

function toggleSkill(skill) {
  const index = form.skills.indexOf(skill)
  if (index > -1) {
    form.skills.splice(index, 1)
  } else {
    form.skills.push(skill)
  }
}

function handleImageChange(event) {
  const file = event.target.files[0]
  if (file) {
    errorMessage.value = ''
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = 'Image is too large. Maximum size is 5 MB.'
      return
    }
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

async function saveSim() {
  if (!form.name.trim()) return
  if (form.status === 'active' && !form.houseId) return

  isSaving.value = true
  errorMessage.value = ''

  try {
    let imageUrl = props.sim?.imageUrl || null

    if (imageFile.value) {
      if (imageFile.value.size > 5 * 1024 * 1024) {
        errorMessage.value = 'Image is too large. Maximum size is 5 MB.'
        isSaving.value = false
        return
      }
      const path = `sims/${Date.now()}_${imageFile.value.name}`
      imageUrl = await simsStore.uploadImage(imageFile.value, path)
    }

    const simData = {
      name: form.name.trim(),
      age: form.age,
      gender: form.gender,
      houseId: form.status === 'active' ? form.houseId : '',
      status: form.status,
      concept: form.concept,
      interests: form.interests.split(',').map(i => i.trim()).filter(Boolean),
      traits: form.traits,
      aspiration: form.aspiration,
      hairColor: form.hairColor,
      eyeColor: form.eyeColor,
      style: form.style,
      career: form.career,
      skills: form.skills,
      notes: form.notes,
      imageUrl
    }

    if (editMode.value && props.sim) {
      await simsStore.updateSim(props.sim.id, simData)
    } else {
      await simsStore.addSim(simData)
    }

    emit('saved')
  } catch (error) {
    console.error('Error saving sim:', error)
    errorMessage.value = 'Failed to save Sim. Please try again.'
  } finally {
    isSaving.value = false
  }
}
</script>
