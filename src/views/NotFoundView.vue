<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center px-4">
      <Search :size="64" class="mx-auto text-sims2-sky/40 mb-6" />
      <h1 class="text-4xl font-bold text-sims2-gold mb-3 font-display">Page Not Found</h1>
      <p class="text-sims2-sky mb-8 text-lg">The page you're looking for doesn't exist or has been moved.</p>
      <router-link
        to="/"
        class="s2-btn s2-btn-green px-8 py-3 inline-block"
      >
        ← Back to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { Search } from 'lucide-vue-next'
</script>
