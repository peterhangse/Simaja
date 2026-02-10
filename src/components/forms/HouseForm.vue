<template>
  <form @submit.prevent="saveHouse" class="space-y-4">
    <!-- House name -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Husets namn *
      </label>
      <input
        v-model="form.name"
        type="text"
        placeholder="T.ex. Villa Solsken"
        class="input-field"
        required
      />
    </div>

    <!-- Address -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Adress
      </label>
      <input
        v-model="form.address"
        type="text"
        placeholder="T.ex. Simvägen 123"
        class="input-field"
      />
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Beskrivning
      </label>
      <textarea
        v-model="form.description"
        placeholder="Beskriv huset..."
        rows="2"
        class="input-field resize-none"
      />
    </div>

    <!-- Image upload -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Bild (valfritt)
      </label>
      <div class="flex items-center gap-4">
        <div 
          class="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300"
        >
          <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover" />
          <span v-else class="text-2xl">🏠</span>
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            @change="handleImageChange"
            class="hidden"
            ref="fileInput"
          />
          <button
            type="button"
            @click="$refs.fileInput.click()"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Välj bild
          </button>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 pt-4">
      <button
        type="button"
        @click="$emit('cancel')"
        class="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
      >
        Avbryt
      </button>
      <button
        type="submit"
        :disabled="isSaving || !form.name.trim()"
        class="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
      >
        {{ isSaving ? 'Sparar...' : (editMode ? 'Uppdatera' : 'Skapa hus') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useSimsStore } from '@/stores/sims'

const props = defineProps({
  house: {
    type: Object,
    default: null
  },
  worldId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['saved', 'cancel'])

const simsStore = useSimsStore()

const editMode = ref(false)
const isSaving = ref(false)
const imagePreview = ref(null)
const imageFile = ref(null)

const form = reactive({
  name: '',
  address: '',
  description: ''
})

onMounted(() => {
  if (props.house) {
    editMode.value = true
    form.name = props.house.name
    form.address = props.house.address || ''
    form.description = props.house.description || ''
    imagePreview.value = props.house.imageUrl || null
  }
})

function handleImageChange(event) {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

async function saveHouse() {
  if (!form.name.trim()) return

  isSaving.value = true

  try {
    let imageUrl = props.house?.imageUrl || null

    if (imageFile.value) {
      const path = `houses/${Date.now()}_${imageFile.value.name}`
      imageUrl = await simsStore.uploadImage(imageFile.value, path)
    }

    const houseData = {
      name: form.name.trim(),
      address: form.address.trim(),
      description: form.description.trim(),
      worldId: props.worldId,
      imageUrl
    }

    if (editMode.value && props.house) {
      await simsStore.updateHouse(props.house.id, houseData)
    } else {
      await simsStore.addHouse(houseData)
    }

    emit('saved')
  } catch (error) {
    console.error('Error saving house:', error)
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none;
}
</style>
