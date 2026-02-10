<template>
  <form @submit.prevent="saveSim" class="space-y-4">
    <!-- Tabs -->
    <div class="flex gap-2 border-b border-gray-200 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        @click="activeTab = tab.id"
        class="px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px"
        :class="activeTab === tab.id 
          ? 'border-green-500 text-green-600' 
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
            class="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 cursor-pointer hover:border-green-400 transition-colors"
            @click="$refs.fileInput.click()"
          >
            <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover" />
            <span v-else class="text-3xl">👤</span>
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
            placeholder="Simens namn *"
            class="input-field"
            required
          />
          <div class="grid grid-cols-2 gap-2">
            <select v-model="form.age" class="input-field">
              <option value="">Ålder...</option>
              <option v-for="age in ageOptions" :key="age" :value="age">{{ age }}</option>
            </select>
            <select v-model="form.gender" class="input-field">
              <option value="">Kön...</option>
              <option value="Kvinna">Kvinna</option>
              <option value="Man">Man</option>
              <option value="Annat">Annat</option>
            </select>
          </div>
        </div>
      </div>

      <!-- House selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Hus *</label>
        <select v-model="form.houseId" class="input-field" required>
          <option value="">Välj hus...</option>
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
        <p v-if="simsStore.houses.length === 0" class="text-sm text-amber-600 mt-1">
          ⚠️ Du måste skapa ett hus först
        </p>
      </div>
    </div>

    <!-- Personality Tab -->
    <div v-show="activeTab === 'personality'" class="space-y-4">
      <!-- Traits -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Personlighetsdrag (välj upp till 3)
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="trait in traitOptions"
            :key="trait"
            type="button"
            @click="toggleTrait(trait)"
            class="px-3 py-1 rounded-full text-sm transition-all"
            :class="form.traits.includes(trait) 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            :disabled="form.traits.length >= 3 && !form.traits.includes(trait)"
          >
            {{ trait }}
          </button>
        </div>
      </div>

      <!-- Aspiration -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Aspiration</label>
        <select v-model="form.aspiration" class="input-field">
          <option value="">Välj aspiration...</option>
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
          <label class="block text-sm font-medium text-gray-700 mb-1">Hårfärg</label>
          <input v-model="form.hairColor" type="text" placeholder="T.ex. Brun" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ögonfärg</label>
          <input v-model="form.eyeColor" type="text" placeholder="T.ex. Blå" class="input-field" />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Klädstil</label>
        <input v-model="form.style" type="text" placeholder="Beskriv stilen..." class="input-field" />
      </div>
    </div>

    <!-- Career Tab -->
    <div v-show="activeTab === 'career'" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Karriär</label>
        <select v-model="form.career" class="input-field">
          <option value="">Välj karriär...</option>
          <option v-for="career in careerOptions" :key="career" :value="career">{{ career }}</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Färdigheter</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="skill in skillOptions"
            :key="skill"
            type="button"
            @click="toggleSkill(skill)"
            class="px-3 py-1 rounded-full text-sm transition-all"
            :class="form.skills.includes(skill) 
              ? 'bg-blue-500 text-white' 
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
        <label class="block text-sm font-medium text-gray-700 mb-1">Anteckningar</label>
        <textarea
          v-model="form.notes"
          placeholder="Skriv anteckningar om denna Sim..."
          rows="5"
          class="input-field resize-none"
        />
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 pt-4 border-t border-gray-100">
      <button
        type="button"
        @click="$emit('cancel')"
        class="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
      >
        Avbryt
      </button>
      <button
        type="submit"
        :disabled="isSaving || !form.name.trim() || !form.houseId"
        class="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
      >
        {{ isSaving ? 'Sparar...' : (editMode ? 'Uppdatera' : 'Skapa Sim') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useSimsStore } from '@/stores/sims'

const props = defineProps({
  sim: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['saved', 'cancel'])

const simsStore = useSimsStore()

const editMode = ref(false)
const isSaving = ref(false)
const activeTab = ref('basic')
const imagePreview = ref(null)
const imageFile = ref(null)

const tabs = [
  { id: 'basic', label: 'Grundläggande', icon: '👤' },
  { id: 'personality', label: 'Personlighet', icon: '💭' },
  { id: 'appearance', label: 'Utseende', icon: '👗' },
  { id: 'career', label: 'Karriär', icon: '💼' },
  { id: 'notes', label: 'Anteckningar', icon: '📝' }
]

const form = reactive({
  name: '',
  age: '',
  gender: '',
  houseId: '',
  traits: [],
  aspiration: '',
  hairColor: '',
  eyeColor: '',
  style: '',
  career: '',
  skills: [],
  notes: ''
})

const ageOptions = ['Baby', 'Toddler', 'Barn', 'Tonåring', 'Ung vuxen', 'Vuxen', 'Äldre']

const traitOptions = [
  'Aktiv', 'Ambitiös', 'Bokmal', 'Brommig', 'Cheerful', 'Clumsy',
  'Creative', 'Evil', 'Family-Oriented', 'Foodie', 'Geek', 'Genius',
  'Gloomy', 'Glutton', 'Good', 'Goofball', 'Hot-Headed', 'Jealous',
  'Kleptomaniac', 'Lazy', 'Loner', 'Loves Outdoors', 'Materialistic',
  'Mean', 'Music Lover', 'Neat', 'Noncommittal', 'Outgoing', 'Paranoid',
  'Perfectionist', 'Romantic', 'Self-Assured', 'Slob', 'Snob', 'Squeamish'
]

const aspirationOptions = {
  'Kreativitet': ['Master Chef', 'Master Mixologist', 'Musical Genius', 'Painter Extraordinaire', 'Bestselling Author'],
  'Fortune': ['Fabulously Wealthy', 'Mansion Baron'],
  'Familia': ['Big Happy Family', 'Successful Lineage', 'Super Parent'],
  'Kärlek': ['Serial Romantic', 'Soulmate'],
  'Kunskap': ['Computer Whiz', 'Nerd Brain', 'Renaissance Sim'],
  'Popularitet': ['Friend of the World', 'Party Animal', 'Joke Star'],
  'Atletisk': ['Bodybuilder'],
  'Natur': ['Angler Extraordinaire', 'Curator', 'The Curator', 'Freelance Botanist']
}

const careerOptions = [
  'Arbetslös', 'Astronaut', 'Idrottare', 'Business', 'Kriminell',
  'Kritiker', 'Underhållare', 'Målare', 'Hemlig agent',
  'Författare', 'Teknik', 'Läkare', 'Vetenskapsman', 'Influencer',
  'Skådespelare', 'Konservator', 'Ingenjör', 'Jurist', 'Militär'
]

const skillOptions = [
  'Matlagning', 'Mixologi', 'Gitarr', 'Piano', 'Violin', 'Fiol',
  'Fitness', 'Programmering', 'Logik', 'Fiske', 'Trädgårdsarbete',
  'Målning', 'Skrivande', 'Comedy', 'Charisma', 'Skicklighet',
  'Fotografi', 'Raketteknik', 'Hantverk', 'Videosspel', 'Bowling',
  'Vältalighet', 'Mekanik', 'Fotografering', 'DJ'
]

onMounted(() => {
  if (props.sim) {
    editMode.value = true
    Object.assign(form, {
      name: props.sim.name,
      age: props.sim.age || '',
      gender: props.sim.gender || '',
      houseId: props.sim.houseId || '',
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
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

async function saveSim() {
  if (!form.name.trim() || !form.houseId) return

  isSaving.value = true

  try {
    let imageUrl = props.sim?.imageUrl || null

    if (imageFile.value) {
      const path = `sims/${Date.now()}_${imageFile.value.name}`
      imageUrl = await simsStore.uploadImage(imageFile.value, path)
    }

    const simData = {
      name: form.name.trim(),
      age: form.age,
      gender: form.gender,
      houseId: form.houseId,
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
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none text-sm;
}
</style>
