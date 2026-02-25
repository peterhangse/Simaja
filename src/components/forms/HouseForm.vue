<template>
  <form @submit.prevent="saveHouse" class="space-y-4">
    <!-- Error message -->
    <div v-if="errorMessage" class="bg-red-500/15 border border-red-500/30 rounded-xl p-3 text-sm text-red-300">
      ⚠️ {{ errorMessage }}
    </div>

    <!-- House name -->
    <div>
      <label class="block s2-label mb-1">
        House name *
      </label>
      <input
        v-model="form.name"
        type="text"
        placeholder="e.g. Sunny Villa"
        class="input-field"
        required
      />
    </div>

    <!-- Address -->
    <div>
      <label class="block s2-label mb-1">
        Address
      </label>
      <input
        v-model="form.address"
        type="text"
        placeholder="e.g. 123 Sim Lane"
        class="input-field"
      />
    </div>

    <!-- Description -->
    <div>
      <label class="block s2-label mb-1">
        Description
      </label>
      <textarea
        v-model="form.description"
        placeholder="Describe the house..."
        rows="2"
        class="input-field resize-none"
      />
    </div>

    <!-- Image upload -->
    <div>
      <label class="block s2-label mb-1">
        Image (optional)
      </label>
      <div class="flex items-center gap-4">
        <div 
          class="w-20 h-20 rounded-xl bg-black/20 flex items-center justify-center overflow-hidden s2-upload-zone"
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
            class="s2-btn s2-btn-ghost px-4 py-2 text-sm"
          >
            Choose image
          </button>
          <p v-if="imageFile && imageFile.size > 5 * 1024 * 1024" class="text-xs text-red-500 mt-1">
            Image must be under 5 MB
          </p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 pt-4">
      <button
        type="button"
        @click="$emit('cancel')"
        class="flex-1 s2-btn s2-btn-ghost py-3 px-4"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="isSaving || !form.name.trim() || (imageFile && imageFile.size > 5 * 1024 * 1024)"
        class="flex-1 s2-btn s2-btn-green py-3 px-4 disabled:opacity-50"
      >
        {{ isSaving ? 'Saving...' : (editMode ? 'Update' : 'Create house') }}
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
const errorMessage = ref('')

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
    errorMessage.value = ''
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = 'Image is too large. Maximum size is 5 MB.'
      return
    }
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

async function saveHouse() {
  if (!form.name.trim()) return

  isSaving.value = true
  errorMessage.value = ''

  try {
    let imageUrl = props.house?.imageUrl || null

    if (imageFile.value) {
      if (imageFile.value.size > 5 * 1024 * 1024) {
        errorMessage.value = 'Image is too large. Maximum size is 5 MB.'
        isSaving.value = false
        return
      }
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
    errorMessage.value = 'Failed to save house. Please try again.'
  } finally {
    isSaving.value = false
  }
}
</script>
