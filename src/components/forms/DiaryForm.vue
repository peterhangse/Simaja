<template>
  <form @submit.prevent="saveDiaryEntry" class="space-y-4">
    <!-- Date -->
    <div>
      <label class="block s2-label mb-1">
        Date
      </label>
      <input
        v-model="form.date"
        type="date"
        class="input-field"
      />
    </div>

    <!-- Text -->
    <div>
      <label class="block s2-label mb-1">
        What happened? *
      </label>
      <textarea
        v-model="form.text"
        placeholder="Describe the event..."
        rows="5"
        class="input-field resize-none"
        required
      />
    </div>

    <!-- Quick templates -->
    <div>
      <p class="text-sm text-[var(--s2-sky)] mb-2">Quick templates:</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="template in templates"
          :key="template.text"
          type="button"
          @click="addTemplate(template.text)"
            class="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm hover:bg-amber-100 transition-colors border border-amber-200"
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
        class="flex-1 s2-btn s2-btn-ghost py-3 px-4"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="isSaving || !form.text.trim()"
        class="flex-1 s2-btn s2-btn-gold py-3 px-4 disabled:opacity-50"
      >
        {{ isSaving ? 'Saving...' : 'Save' }}
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
  { icon: '💑', label: 'Romance', text: 'Met someone special today! ' },
  { icon: '💍', label: 'Marriage', text: 'Got married! ' },
  { icon: '👶', label: 'Baby', text: 'Had a baby! ' },
  { icon: '🎂', label: 'Birthday', text: 'Celebrated birthday! ' },
  { icon: '💼', label: 'Job', text: 'Got new job as ' },
  { icon: '🏠', label: 'Moved', text: 'Moved to ' },
  { icon: '⚰️', label: 'Death', text: 'Passed away today. ' },
  { icon: '🎓', label: 'Achievement', text: 'Achieved ' }
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
