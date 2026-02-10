<template>
  <form @submit.prevent="saveWorld" class="space-y-4">
    <!-- World name -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Världens namn *
      </label>
      <input
        v-model="form.name"
        type="text"
        placeholder="T.ex. Willow Creek"
        class="input-field"
        required
      />
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Beskrivning
      </label>
      <textarea
        v-model="form.description"
        placeholder="Beskriv världen..."
        rows="3"
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
          class="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300"
        >
          <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover" />
          <span v-else class="text-3xl">🌍</span>
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
        class="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
      >
        {{ isSaving ? 'Sparar...' : (editMode ? 'Uppdatera' : 'Skapa värld') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useSimsStore } from '@/stores/sims'

const props = defineProps({
  world: {
    type: Object,
    default: null
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
  description: ''
})

onMounted(() => {
  if (props.world) {
    editMode.value = true
    form.name = props.world.name
    form.description = props.world.description || ''
    imagePreview.value = props.world.imageUrl || null
  }
})

function handleImageChange(event) {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

async function saveWorld() {
  if (!form.name.trim()) return

  isSaving.value = true

  try {
    let imageUrl = props.world?.imageUrl || null

    // Upload image if new one selected
    if (imageFile.value) {
      const path = `worlds/${Date.now()}_${imageFile.value.name}`
      imageUrl = await simsStore.uploadImage(imageFile.value, path)
    }

    const worldData = {
      name: form.name.trim(),
      description: form.description.trim(),
      imageUrl
    }

    if (editMode.value && props.world) {
      await simsStore.updateWorld(props.world.id, worldData)
    } else {
      await simsStore.addWorld(worldData)
    }

    emit('saved')
  } catch (error) {
    console.error('Error saving world:', error)
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none;
}
</style>
