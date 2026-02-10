<template>
  <svg viewBox="0 0 100 120" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="plumbobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color: currentColor; stop-opacity: 0.7" />
        <stop offset="50%" style="stop-color: currentColor; stop-opacity: 1" />
        <stop offset="100%" style="stop-color: currentColor; stop-opacity: 0.8" />
      </linearGradient>
    </defs>
    <!-- Main diamond shape -->
    <polygon 
      points="50,0 100,40 50,120 0,40" 
      fill="url(#plumbobGrad)"
    />
    <!-- Inner highlight lines -->
    <polygon 
      points="50,10 85,40 50,100 15,40" 
      fill="none" 
      stroke="rgba(255,255,255,0.4)" 
      stroke-width="2"
    />
    <!-- Top facet highlight -->
    <polygon 
      points="50,0 100,40 50,50 0,40" 
      fill="rgba(255,255,255,0.2)"
    />
  </svg>
</template>

<script setup>
// PlumbobIcon - The iconic Sims diamond
</script>
