<template>
  <div class="space-y-6">
    <!-- Step 1: Upload -->
    <div v-if="step === 'upload'" class="space-y-4">
      <!-- Instructions -->
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 class="font-semibold text-blue-800 mb-2">📸 Så här gör du:</h4>
        <ol class="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Öppna Sims 4 och klicka på din Sim</li>
          <li>Öppna Simology-panelen (visar traits, skills etc)</li>
          <li>Tryck <kbd class="px-1.5 py-0.5 bg-blue-200 rounded text-xs">C</kbd> för att ta screenshot</li>
          <li>Ladda upp bilden här nedan</li>
        </ol>
      </div>

      <!-- Drop zone -->
      <div
        @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @click="$refs.fileInput.click()"
        class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
        :class="isDragging 
          ? 'border-green-500 bg-green-50' 
          : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'"
      >
        <div class="text-5xl mb-4">{{ isDragging ? '📥' : '🖼️' }}</div>
        <p class="text-gray-700 font-medium mb-2">
          {{ isDragging ? 'Släpp bilden här!' : 'Dra och släpp en screenshot här' }}
        </p>
        <p class="text-gray-500 text-sm">eller klicka för att välja fil</p>
        <input
          type="file"
          accept="image/*"
          @change="handleFileSelect"
          class="hidden"
          ref="fileInput"
        />
      </div>

      <!-- Preview if file selected but not processed yet -->
      <div v-if="selectedFile && !isProcessing" class="relative">
        <img 
          :src="previewUrl" 
          alt="Preview" 
          class="w-full rounded-xl shadow-sm max-h-64 object-contain bg-gray-100"
        />
        <button
          @click="clearFile"
          class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          ✕
        </button>
      </div>

      <!-- Process button -->
      <div v-if="selectedFile && !isProcessing" class="flex gap-3">
        <button
          @click="$emit('cancel')"
          class="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
        >
          Avbryt
        </button>
        <button
          @click="processImage"
          class="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          🔍 Analysera
        </button>
      </div>
    </div>

    <!-- Step 2: Processing -->
    <div v-if="step === 'processing'" class="space-y-6 py-8">
      <div class="text-center">
        <div class="text-6xl mb-4 animate-pulse">🔍</div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">Analyserar screenshot...</h3>
        <p class="text-gray-500 mb-4">Detta kan ta några sekunder</p>
        
        <!-- Progress bar -->
        <div class="max-w-xs mx-auto">
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300"
              :style="{ width: `${progress}%` }"
            />
          </div>
          <p class="text-sm text-gray-500 mt-2">{{ progress }}%</p>
        </div>
      </div>

      <!-- Preview image -->
      <img 
        v-if="previewUrl"
        :src="previewUrl" 
        alt="Preview" 
        class="w-full rounded-xl shadow-sm max-h-40 object-contain bg-gray-100 opacity-50"
      />
    </div>

    <!-- Step 3: Results -->
    <div v-if="step === 'results'" class="space-y-4">
      <!-- Error state -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4">
        <h4 class="font-semibold text-red-800 flex items-center gap-2">
          <span>⚠️</span> Kunde inte analysera bilden
        </h4>
        <p class="text-sm text-red-700 mt-1">{{ error }}</p>
        <button
          @click="resetToUpload"
          class="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
        >
          Prova igen
        </button>
      </div>

      <!-- Success state -->
      <div v-else class="space-y-4">
        <!-- Preview thumbnail -->
        <div class="flex items-center gap-4 bg-gray-50 rounded-xl p-3">
          <img 
            :src="previewUrl" 
            alt="Preview" 
            class="w-16 h-16 rounded-lg object-cover bg-gray-200"
          />
          <div class="flex-1">
            <p class="font-medium text-gray-800">Hittade Sim-data</p>
            <p class="text-sm text-gray-500">Kontrollera och korrigera nedan</p>
          </div>
          <button
            @click="resetToUpload"
            class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            Ny bild
          </button>
        </div>

        <!-- Editable fields -->
        <form @submit.prevent="createSim" class="space-y-4">
          <!-- Name -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-sm font-medium text-gray-700">Namn *</label>
              <ConfidenceBadge :confidence="parsedData.name.confidence" />
            </div>
            <input
              v-model="formData.name"
              type="text"
              placeholder="Simens namn"
              class="input-field"
              required
            />
          </div>

          <!-- Age -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-sm font-medium text-gray-700">Ålder</label>
              <ConfidenceBadge :confidence="parsedData.age.confidence" />
            </div>
            <select v-model="formData.age" class="input-field">
              <option value="">Välj ålder...</option>
              <option v-for="age in ageOptions" :key="age" :value="age">{{ age }}</option>
            </select>
          </div>

          <!-- Traits -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-sm font-medium text-gray-700">
                Personlighetsdrag ({{ formData.traits.length }}/3)
              </label>
              <span v-if="parsedData.traits.length > 0" class="text-xs text-gray-500">
                Hittade {{ parsedData.traits.length }} st
              </span>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="trait in traitOptions"
                :key="trait"
                type="button"
                @click="toggleTrait(trait)"
                class="px-3 py-1 rounded-full text-sm transition-all"
                :class="formData.traits.includes(trait) 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                :disabled="formData.traits.length >= 3 && !formData.traits.includes(trait)"
              >
                {{ trait }}
              </button>
            </div>
          </div>

          <!-- Aspiration -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-sm font-medium text-gray-700">Aspiration</label>
              <ConfidenceBadge :confidence="parsedData.aspiration.confidence" />
            </div>
            <select v-model="formData.aspiration" class="input-field">
              <option value="">Välj aspiration...</option>
              <optgroup v-for="(asps, category) in aspirationOptions" :key="category" :label="category">
                <option v-for="asp in asps" :key="asp" :value="asp">{{ asp }}</option>
              </optgroup>
            </select>
          </div>

          <!-- Career -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-sm font-medium text-gray-700">Karriär</label>
              <ConfidenceBadge :confidence="parsedData.career.confidence" />
            </div>
            <select v-model="formData.career" class="input-field">
              <option value="">Välj karriär...</option>
              <option v-for="career in careerOptions" :key="career" :value="career">
                {{ career }}
              </option>
            </select>
          </div>

          <!-- House selection (required, not from OCR) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Hus * 
              <span class="text-gray-400 font-normal">(välj manuellt)</span>
            </label>
            <select v-model="formData.houseId" class="input-field" required>
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

          <!-- Skills preview (if found) -->
          <div v-if="parsedData.skills.length > 0">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Hittade skills
              <span class="text-gray-400 font-normal">(sparas ej automatiskt)</span>
            </label>
            <div class="bg-gray-50 rounded-lg p-3 space-y-1">
              <div 
                v-for="skill in parsedData.skills" 
                :key="skill.name"
                class="flex items-center justify-between text-sm"
              >
                <span class="text-gray-700">{{ skill.name }}</span>
                <span class="font-medium text-gray-900">Nivå {{ skill.level }}</span>
              </div>
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
              :disabled="isSaving || !formData.name.trim() || !formData.houseId"
              class="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {{ isSaving ? 'Sparar...' : 'Skapa Sim' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onUnmounted } from 'vue'
import { useSimsStore } from '@/stores/sims'
import { processScreenshot, validateOcrResult, terminateWorker } from '@/services/ocrService'
import { getTraitOptions, getAspirationOptions, getCareerOptions, getAgeOptions } from '@/data/sims4Data'

// Confidence badge component (inline)
const ConfidenceBadge = {
  props: ['confidence'],
  template: `
    <span 
      v-if="confidence > 0"
      class="text-xs px-2 py-0.5 rounded-full"
      :class="confidenceClass"
    >
      {{ confidence }}% säker
    </span>
  `,
  computed: {
    confidenceClass() {
      if (this.confidence >= 90) return 'bg-green-100 text-green-700'
      if (this.confidence >= 70) return 'bg-yellow-100 text-yellow-700'
      return 'bg-red-100 text-red-700'
    }
  }
}

const emit = defineEmits(['imported', 'cancel'])

const simsStore = useSimsStore()

// State
const step = ref('upload') // 'upload' | 'processing' | 'results'
const selectedFile = ref(null)
const previewUrl = ref(null)
const isDragging = ref(false)
const isProcessing = ref(false)
const isSaving = ref(false)
const progress = ref(0)
const error = ref(null)

// Options from data file
const traitOptions = getTraitOptions()
const aspirationOptions = getAspirationOptions()
const careerOptions = getCareerOptions()
const ageOptions = getAgeOptions()

// Parsed OCR data
const parsedData = reactive({
  name: { value: '', confidence: 0 },
  age: { value: '', confidence: 0 },
  traits: [],
  aspiration: { value: '', confidence: 0 },
  career: { value: '', confidence: 0 },
  skills: [],
  rawText: ''
})

// Form data (editable by user)
const formData = reactive({
  name: '',
  age: '',
  traits: [],
  aspiration: '',
  career: '',
  houseId: ''
})

// Cleanup on unmount
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  terminateWorker()
})

// File handling
function handleDrop(event) {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    selectFile(file)
  }
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    selectFile(file)
  }
}

function selectFile(file) {
  selectedFile.value = file
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = URL.createObjectURL(file)
}

function clearFile() {
  selectedFile.value = null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
}

function resetToUpload() {
  step.value = 'upload'
  error.value = null
  progress.value = 0
  clearFile()
}

// OCR processing
async function processImage() {
  if (!selectedFile.value) return

  step.value = 'processing'
  isProcessing.value = true
  error.value = null
  progress.value = 0

  try {
    // Process the screenshot
    const result = await processScreenshot(selectedFile.value, (p) => {
      progress.value = p
    })

    // Validate result
    const validation = validateOcrResult(result)
    if (!validation.valid) {
      error.value = validation.reason
      step.value = 'results'
      return
    }

    // Store parsed data
    Object.assign(parsedData, result)

    // Pre-fill form with parsed data
    formData.name = result.name.value || ''
    formData.age = result.age.value || ''
    formData.traits = result.traits.map(t => t.value).slice(0, 3)
    formData.aspiration = result.aspiration.value || ''
    formData.career = result.career.value || ''

    step.value = 'results'
  } catch (err) {
    console.error('OCR processing error:', err)
    error.value = 'Ett fel uppstod vid analys av bilden. Prova igen.'
    step.value = 'results'
  } finally {
    isProcessing.value = false
  }
}

// Trait handling
function toggleTrait(trait) {
  const index = formData.traits.indexOf(trait)
  if (index > -1) {
    formData.traits.splice(index, 1)
  } else if (formData.traits.length < 3) {
    formData.traits.push(trait)
  }
}

// Create the Sim
async function createSim() {
  if (!formData.name.trim() || !formData.houseId) return

  isSaving.value = true

  try {
    const simData = {
      name: formData.name.trim(),
      age: formData.age,
      gender: '',
      houseId: formData.houseId,
      traits: formData.traits,
      aspiration: formData.aspiration,
      hairColor: '',
      eyeColor: '',
      style: '',
      career: formData.career,
      skills: [],
      notes: `Importerad från screenshot.\n\nHittade skills:\n${parsedData.skills.map(s => `- ${s.name}: Nivå ${s.level}`).join('\n') || 'Inga'}`,
      imageUrl: null
    }

    await simsStore.addSim(simData)
    emit('imported', simData)
  } catch (err) {
    console.error('Error creating sim:', err)
    error.value = 'Kunde inte spara Sim. Prova igen.'
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all;
}

kbd {
  font-family: monospace;
}
</style>
