<template>
  <form @submit.prevent="saveDiaryEntry" class="space-y-4">
    <!-- Date -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Datum
      </label>
      <input
        v-model="form.date"
        type="date"
        class="input-field"
      />
    </div>

    <!-- Text -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Vad hände? *
      </label>
      <textarea
        v-model="form.text"
        placeholder="Beskriv händelsen..."
        rows="5"
        class="input-field resize-none"
        required
      />
    </div>

    <!-- Quick templates -->
    <div>
      <p class="text-sm text-gray-500 mb-2">Snabbmallar:</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="template in templates"
          :key="template.text"
          type="button"
          @click="addTemplate(template.text)"
          class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm hover:bg-amber-200 transition-colors"
        >
          {{ template.icon }} {{ template.label }}
        </button>
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
        :disabled="isSaving || !form.text.trim()"
        class="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
      >
        {{ isSaving ? 'Sparar...' : 'Spara' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useSimsStore } from '@/stores/sims'

const props = defineProps({
  simId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['saved', 'cancel'])

const simsStore = useSimsStore()

const isSaving = ref(false)

const form = reactive({
  date: new Date().toISOString().split('T')[0],
  text: ''
})

const templates = [
  { icon: '💑', label: 'Förälskelse', text: 'Träffade någon speciell idag! ' },
  { icon: '💍', label: 'Giftermål', text: 'Giftermål! ' },
  { icon: '👶', label: 'Barn', text: 'Fick barn! ' },
  { icon: '🎂', label: 'Födelsedag', text: 'Firade födelsedag! ' },
  { icon: '💼', label: 'Jobb', text: 'Nytt jobb som ' },
  { icon: '🏠', label: 'Flytt', text: 'Flyttade till ' },
  { icon: '⚰️', label: 'Död', text: 'Gick bort idag. ' },
  { icon: '🎓', label: 'Uppnått', text: 'Uppnådde ' }
]

function addTemplate(text) {
  form.text = text
}

async function saveDiaryEntry() {
  if (!form.text.trim()) return

  isSaving.value = true

  try {
    await simsStore.addDiaryEntry({
      simId: props.simId,
      date: form.date,
      text: form.text.trim()
    })

    emit('saved')
  } catch (error) {
    console.error('Error saving diary entry:', error)
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none;
}
</style>
