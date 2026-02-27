<template>
  <div class="space-y-6">
    <!-- Step 1: Upload -->
    <div v-if="step === 'upload'" class="space-y-4">
      <!-- Instructions -->
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 class="font-semibold text-[var(--s2-sky)] mb-2">📸 How to do it:</h4>
        <ol class="text-sm text-blue-600 space-y-1 list-decimal list-inside">
          <li>Open Sims 4 and click on your Sim</li>
          <li>Open the Simology panel (shows traits, skills etc)</li>
          <li>Press <kbd class="px-1.5 py-0.5 bg-blue-100 rounded text-xs">C</kbd> to take a screenshot</li>
          <li>Upload the image below</li>
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
          ? 'border-green-500/60 bg-green-500/10' 
          : 'border-[var(--s2-border)] hover:border-[var(--s2-border-strong)] hover:bg-gray-50'"
      >
        <div class="text-5xl mb-4">{{ isDragging ? '📥' : '🖼️' }}</div>
        <p class="text-[var(--s2-cream)] font-medium mb-2">
          {{ isDragging ? 'Drop the image here!' : 'Drag and drop a screenshot here' }}
        </p>
        <p class="text-[var(--s2-sky)] text-sm">or click to choose a file</p>
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
          class="flex-1 s2-btn s2-btn-ghost py-3 px-4"
        >
          Cancel
        </button>
        <button
          @click="processImage"
          class="flex-1 s2-btn s2-btn-green py-3 px-4"
        >
          🔍 Analyze
        </button>
      </div>
    </div>

    <!-- Step 2: Processing -->
    <div v-if="step === 'processing'" class="space-y-6 py-8">
      <div class="text-center">
        <div class="text-6xl mb-4 animate-pulse">🔍</div>
        <h3 class="text-xl font-bold text-[var(--s2-gold)] mb-2">Analyzing screenshot...</h3>
        <p class="text-[var(--s2-sky)] mb-4">This may take a few seconds</p>
        
        <!-- Progress bar -->
        <div class="max-w-xs mx-auto">
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300"
              :style="{ width: `${progress}%` }"
            />
          </div>
          <p class="text-sm text-[var(--s2-sky)] mt-2">{{ progress }}%</p>
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
        <h4 class="font-semibold text-red-600 flex items-center gap-2">
          <span>⚠️</span> Could not analyze the image
        </h4>
        <p class="text-sm text-red-600 mt-1">{{ error }}</p>
        <button
          @click="resetToUpload"
          class="mt-3 s2-btn s2-btn-danger px-4 py-2 text-sm"
        >
          Try again
        </button>
      </div>

      <!-- Success state -->
      <div v-else class="space-y-4">
        <!-- Preview thumbnail -->
        <div class="flex items-center gap-4 s2-panel-inner rounded-xl p-3">
          <img 
            :src="previewUrl" 
            alt="Preview" 
            class="w-16 h-16 rounded-lg object-cover bg-gray-100"
          />
          <div class="flex-1">
            <p class="font-medium text-[var(--s2-cream)]">Found Sim data</p>
            <p class="text-sm text-[var(--s2-sky)]">Review and correct below</p>
          </div>
          <button
            @click="resetToUpload"
            class="px-3 py-1 text-sm text-[var(--s2-sky)] hover:text-white"
          >
            New image
          </button>
        </div>

        <!-- Editable fields -->
        <form @submit.prevent="createSim" class="space-y-4">
          <!-- Name -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block s2-label">Name *</label>
              <ConfidenceBadge :confidence="parsedData.name.confidence" />
            </div>
            <input
              v-model="formData.name"
              type="text"
              placeholder="Sim's name"
              class="input-field"
              required
            />
          </div>

          <!-- Age -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block s2-label">Age</label>
              <ConfidenceBadge :confidence="parsedData.age.confidence" />
            </div>
            <select v-model="formData.age" class="input-field">
              <option value="">Choose age...</option>
              <option v-for="age in ageOptions" :key="age" :value="age">{{ age }}</option>
            </select>
          </div>

          <!-- Traits -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block s2-label">
                Personality traits ({{ formData.traits.length }}/3)
              </label>
              <span v-if="parsedData.traits.length > 0" class="text-xs text-[var(--s2-sky)]">
                Found {{ parsedData.traits.length }}
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
                  ? 'bg-green-100 text-green-700 ring-1 ring-green-400' 
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
              <label class="block s2-label">Aspiration</label>
              <ConfidenceBadge :confidence="parsedData.aspiration.confidence" />
            </div>
            <select v-model="formData.aspiration" class="input-field">
              <option value="">Choose aspiration...</option>
              <optgroup v-for="(asps, category) in aspirationOptions" :key="category" :label="category">
                <option v-for="asp in asps" :key="asp" :value="asp">{{ asp }}</option>
              </optgroup>
            </select>
          </div>

          <!-- Career -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block s2-label">Career</label>
              <ConfidenceBadge :confidence="parsedData.career.confidence" />
            </div>
            <select v-model="formData.career" class="input-field">
              <option value="">Choose career...</option>
              <option v-for="career in careerOptions" :key="career" :value="career">
                {{ career }}
              </option>
            </select>
          </div>

          <!-- House selection (required, not from OCR) -->
          <div>
            <label class="block s2-label mb-1">House * 
              <span class="text-[var(--s2-sky)] font-normal">(choose manually)</span>
            </label>
            <select v-model="formData.houseId" class="input-field" required>
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
              ⚠️ You must create a house first
            </p>
          </div>

          <!-- Skills preview (if found) -->
          <div v-if="parsedData.skills.length > 0">
            <label class="block s2-label mb-2">
              Found skills
              <span class="text-[var(--s2-sky)] font-normal">(not saved automatically)</span>
            </label>
            <div class="s2-panel-inner rounded-lg p-3 space-y-1">
              <div 
                v-for="skill in parsedData.skills" 
                :key="skill.name"
                class="flex items-center justify-between text-sm"
              >
                <span class="text-[var(--s2-cream)]">{{ skill.name }}</span>
                <span class="font-medium text-white">Level {{ skill.level }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="$emit('cancel')"
              class="flex-1 s2-btn s2-btn-ghost py-3 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSaving || !formData.name.trim() || !formData.houseId"
              class="flex-1 s2-btn s2-btn-green py-3 px-4 disabled:opacity-50"
            >
              {{ isSaving ? 'Saving...' : 'Create Sim' }}
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
      {{ confidence }}% confident
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
    error.value = 'An error occurred while analyzing the image. Try again.'
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
      notes: `Imported from screenshot.\n\nFound skills:\n${parsedData.skills.map(s => `- ${s.name}: Level ${s.level}`).join('\n') || 'None'}`,
      imageUrl: null
    }

    await simsStore.addSim(simData)
    emit('imported', simData)
  } catch (err) {
    console.error('Error creating sim:', err)
    error.value = 'Could not save Sim. Try again.'
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
kbd {
  font-family: monospace;
}
</style>
