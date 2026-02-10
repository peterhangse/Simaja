<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
    <AppHeader />

    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Page header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-3xl font-bold text-gray-800">🌳 Släktträd</h2>
          <p class="text-gray-500 mt-1">Visualisera relationer mellan dina Simar</p>
        </div>
        <div class="flex gap-2">
          <button
            @click="resetZoom"
            class="px-4 py-2 bg-white text-gray-700 rounded-xl shadow-sm hover:shadow transition-all"
          >
            🔍 Återställ zoom
          </button>
          <button
            @click="exportImage"
            class="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-sm hover:shadow-lg transition-all"
          >
            📸 Exportera bild
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl p-4 shadow-sm mb-4 flex flex-wrap gap-4 items-center">
        <!-- Search -->
        <div class="flex items-center gap-2">
          <span class="text-gray-500">🔎</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Sök Sim..."
            class="px-3 py-2 rounded-lg border border-gray-200 w-40 focus:border-purple-500 outline-none"
            @keyup.enter="searchAndCenter"
          />
          <button
            v-if="searchQuery"
            @click="searchAndCenter"
            class="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
          >
            Hitta
          </button>
        </div>
        
        <div class="flex items-center gap-2">
          <span class="text-gray-500">🌍</span>
          <select v-model="filterWorld" class="px-3 py-2 rounded-lg border border-gray-200">
            <option value="">Alla världar</option>
            <option v-for="world in simsStore.worlds" :key="world.id" :value="world.id">
              {{ world.name }}
            </option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-gray-500">🔗</span>
          <select v-model="filterRelationType" class="px-3 py-2 rounded-lg border border-gray-200">
            <option value="">Alla relationer</option>
            <option value="family">Familj (förälder/barn/syskon)</option>
            <option value="romantic">Romantiska (partner/ex)</option>
            <option value="social">Sociala (vän/fiende)</option>
          </select>
        </div>
        
        <!-- Legend -->
        <div class="flex-1 flex justify-end gap-4 text-sm">
          <span class="flex items-center gap-1">
            <span class="w-4 h-1 bg-green-500 rounded"></span> Familj
          </span>
          <span class="flex items-center gap-1">
            <span class="w-4 h-1 bg-pink-500 rounded"></span> Romantisk
          </span>
          <span class="flex items-center gap-1">
            <span class="w-4 h-1 bg-blue-500 rounded"></span> Vän
          </span>
          <span class="flex items-center gap-1">
            <span class="w-4 h-1 bg-red-500 rounded dashed"></span> Fiende
          </span>
        </div>
      </div>

      <!-- Cytoscape container -->
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden relative" style="height: calc(100vh - 320px)">
        <div v-if="simsStore.sims.length === 0" class="h-full flex items-center justify-center text-gray-400">
          <div class="text-center">
            <span class="text-6xl">🌳</span>
            <p class="mt-4">Lägg till Simar för att se släktträdet</p>
          </div>
        </div>
        <div v-else ref="cyContainer" class="w-full h-full"></div>
        
        <!-- Hover tooltip -->
        <div
          v-if="hoverSim"
          ref="tooltipEl"
          class="absolute bg-white rounded-xl shadow-lg p-3 pointer-events-none z-50 border border-gray-100"
          :style="{ left: tooltipPos.x + 'px', top: tooltipPos.y + 'px' }"
        >
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 overflow-hidden flex-shrink-0">
              <img v-if="hoverSim.imageUrl" :src="hoverSim.imageUrl" class="w-full h-full object-cover" />
              <span v-else class="w-full h-full flex items-center justify-center text-xl">👤</span>
            </div>
            <div>
              <p class="font-bold text-gray-800">{{ hoverSim.name }}</p>
              <p class="text-sm text-gray-500">{{ hoverSim.age || 'Okänd ålder' }} {{ getGenderIcon(hoverSim.gender) }}</p>
              <p class="text-xs text-gray-400">{{ getHouseName(hoverSim.houseId) }}</p>
            </div>
          </div>
          <div v-if="hoverSim.traits?.length" class="mt-2 flex flex-wrap gap-1">
            <span 
              v-for="trait in hoverSim.traits.slice(0, 3)" 
              :key="trait"
              class="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs"
            >
              {{ trait }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Hint -->
      <p class="text-center text-gray-400 text-sm mt-2">
        Hovra för info • Klicka för detaljer • Dra för att flytta
      </p>
    </main>

    <!-- Sim detail popup -->
    <Modal v-model="showSimPopup" :title="selectedSim?.name || 'Sim'">
      <div v-if="selectedSim" class="text-center">
        <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-200 to-purple-300 overflow-hidden mb-4">
          <img v-if="selectedSim.imageUrl" :src="selectedSim.imageUrl" class="w-full h-full object-cover" />
          <span v-else class="w-full h-full flex items-center justify-center text-4xl">👤</span>
        </div>
        <h3 class="text-xl font-bold text-gray-800">{{ selectedSim.name }}</h3>
        <p class="text-gray-500">{{ selectedSim.age }}</p>
        <div v-if="selectedSim.traits?.length" class="mt-4 flex flex-wrap justify-center gap-2">
          <span 
            v-for="trait in selectedSim.traits" 
            :key="trait"
            class="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs"
          >
            {{ trait }}
          </span>
        </div>
        <router-link
          :to="`/sims/${selectedSim.id}`"
          class="mt-6 block px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl"
        >
          Visa profil →
        </router-link>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useSimsStore } from '@/stores/sims'
import AppHeader from '@/components/AppHeader.vue'
import Modal from '@/components/Modal.vue'

const simsStore = useSimsStore()

const cyContainer = ref(null)
const tooltipEl = ref(null)
const filterWorld = ref('')
const filterRelationType = ref('')
const showSimPopup = ref(false)
const selectedSim = ref(null)
const searchQuery = ref('')
const hoverSim = ref(null)
const tooltipPos = ref({ x: 0, y: 0 })

let cy = null

// Age emoji helper
function getAgeEmoji(age) {
  const ageMap = {
    'Baby': '👶',
    'Spädbarn': '👶',
    'Infant': '👶',
    'Toddler': '🧒',
    'Småbarn': '🧒',
    'Barn': '👧',
    'Child': '👧',
    'Tonåring': '👦',
    'Teen': '👦',
    'Ung vuxen': '🧑',
    'Young Adult': '🧑',
    'Vuxen': '👨',
    'Adult': '👨',
    'Äldre': '👴',
    'Elder': '👴'
  }
  return ageMap[age] || '👤'
}

// Gender icon helper
function getGenderIcon(gender) {
  if (gender === 'Kvinna' || gender === 'Female') return '♀'
  if (gender === 'Man' || gender === 'Male') return '♂'
  return ''
}

// Get house name
function getHouseName(houseId) {
  const house = simsStore.houses.find(h => h.id === houseId)
  return house?.name || 'Okänt hus'
}

// Relationship type labels in Swedish
function getRelationLabel(type) {
  const labels = {
    parent: 'förälder',
    child: 'barn',
    sibling: 'syskon',
    spouse: 'gift',
    ex: 'ex',
    friend: 'vän',
    enemy: 'fiende',
    roommate: 'rumskompis',
    mentor: 'mentor'
  }
  return labels[type] || type
}

// Filter sims based on world
const filteredSims = computed(() => {
  if (!filterWorld.value) return simsStore.sims
  
  const worldHouses = simsStore.houses
    .filter(h => h.worldId === filterWorld.value)
    .map(h => h.id)
  
  return simsStore.sims.filter(s => worldHouses.includes(s.houseId))
})

// Filter relationships based on type
const filteredRelationships = computed(() => {
  let rels = simsStore.relationships
  
  // Filter by relationship type category
  if (filterRelationType.value === 'family') {
    rels = rels.filter(r => ['parent', 'child', 'sibling'].includes(r.type))
  } else if (filterRelationType.value === 'romantic') {
    rels = rels.filter(r => ['spouse', 'ex'].includes(r.type))
  } else if (filterRelationType.value === 'social') {
    rels = rels.filter(r => ['friend', 'enemy', 'roommate', 'mentor'].includes(r.type))
  }
  
  // Only include relationships where both sims are in filtered list
  const simIds = filteredSims.value.map(s => s.id)
  return rels.filter(r => simIds.includes(r.sim1Id) && simIds.includes(r.sim2Id))
})

// Build Cytoscape elements
const cyElements = computed(() => {
  const nodes = filteredSims.value.map(sim => ({
    data: {
      id: sim.id,
      name: sim.name,
      label: `${getAgeEmoji(sim.age)} ${sim.name}`,
      image: sim.imageUrl || null,
      age: sim.age || '',
      gender: sim.gender || '',
      worldId: getSimWorldId(sim.houseId)
    }
  }))
  
  const edges = filteredRelationships.value.map(rel => ({
    data: {
      id: rel.id,
      source: rel.sim1Id,
      target: rel.sim2Id,
      type: rel.type,
      label: getRelationLabel(rel.type)
    }
  }))
  
  return [...nodes, ...edges]
})

function getSimWorldId(houseId) {
  const house = simsStore.houses.find(h => h.id === houseId)
  return house?.worldId || null
}

function getEdgeColor(type) {
  const colors = {
    parent: '#22c55e',
    child: '#22c55e',
    sibling: '#22c55e',
    spouse: '#ec4899',
    ex: '#f9a8d4',
    friend: '#3b82f6',
    enemy: '#ef4444',
    roommate: '#eab308',
    mentor: '#a855f7'
  }
  return colors[type] || '#9ca3af'
}

function getEdgeStyle(type) {
  if (['ex', 'enemy'].includes(type)) return 'dashed'
  return 'solid'
}

async function initCytoscape() {
  if (!cyContainer.value || filteredSims.value.length === 0) return
  
  // Dynamically import cytoscape
  const cytoscape = (await import('cytoscape')).default
  const dagre = (await import('cytoscape-dagre')).default
  
  cytoscape.use(dagre)
  
  cy = cytoscape({
    container: cyContainer.value,
    elements: cyElements.value,
    style: [
      {
        selector: 'node',
        style: {
          'label': 'data(label)',
          'text-valign': 'bottom',
          'text-margin-y': 8,
          'font-size': '11px',
          'font-weight': '600',
          'color': '#374151',
          'width': 60,
          'height': 60,
          'background-color': '#e9d5ff',
          'background-image': 'data(image)',
          'background-fit': 'cover',
          'background-clip': 'node',
          'border-width': 3,
          'border-color': '#a855f7',
          'border-opacity': 0.8,
          'transition-property': 'border-width, border-color, opacity',
          'transition-duration': '0.2s'
        }
      },
      {
        selector: 'node:selected',
        style: {
          'border-width': 5,
          'border-color': '#7c3aed'
        }
      },
      {
        selector: 'node.highlighted',
        style: {
          'border-width': 5,
          'border-color': '#7c3aed'
        }
      },
      {
        selector: 'node.dimmed',
        style: {
          'opacity': 0.3
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'curve-style': 'bezier',
          'target-arrow-shape': 'none',
          'label': 'data(label)',
          'font-size': '9px',
          'color': '#6b7280',
          'text-rotation': 'autorotate',
          'text-margin-y': -8,
          'text-opacity': 0.7,
          'transition-property': 'width, opacity',
          'transition-duration': '0.2s'
        }
      },
      {
        selector: 'edge.highlighted',
        style: {
          'width': 4,
          'text-opacity': 1,
          'z-index': 999
        }
      },
      {
        selector: 'edge.dimmed',
        style: {
          'opacity': 0.15
        }
      },
      // Family edges (green)
      {
        selector: 'edge[type="parent"], edge[type="child"], edge[type="sibling"]',
        style: {
          'line-color': '#22c55e',
          'line-style': 'solid'
        }
      },
      // Romantic edges (pink)
      {
        selector: 'edge[type="spouse"]',
        style: {
          'line-color': '#ec4899',
          'line-style': 'solid',
          'width': 3
        }
      },
      {
        selector: 'edge[type="ex"]',
        style: {
          'line-color': '#f9a8d4',
          'line-style': 'dashed'
        }
      },
      // Social edges
      {
        selector: 'edge[type="friend"]',
        style: {
          'line-color': '#3b82f6',
          'line-style': 'dotted'
        }
      },
      {
        selector: 'edge[type="enemy"]',
        style: {
          'line-color': '#ef4444',
          'line-style': 'dashed'
        }
      },
      {
        selector: 'edge[type="roommate"]',
        style: {
          'line-color': '#eab308',
          'line-style': 'dotted'
        }
      },
      {
        selector: 'edge[type="mentor"]',
        style: {
          'line-color': '#a855f7',
          'line-style': 'dotted'
        }
      }
    ],
    layout: {
      name: 'dagre',
      rankDir: 'TB',
      nodeSep: 80,
      rankSep: 100,
      padding: 50
    },
    minZoom: 0.2,
    maxZoom: 3,
    wheelSensitivity: 0.3
  })
  
  // Hover handlers for tooltip
  cy.on('mouseover', 'node', (evt) => {
    const nodeId = evt.target.id()
    hoverSim.value = simsStore.sims.find(s => s.id === nodeId)
    updateTooltipPosition(evt)
  })
  
  cy.on('mousemove', 'node', (evt) => {
    updateTooltipPosition(evt)
  })
  
  cy.on('mouseout', 'node', () => {
    hoverSim.value = null
  })
  
  // Click handler - highlight connected edges
  cy.on('tap', 'node', (evt) => {
    const node = evt.target
    const nodeId = node.id()
    
    // Clear previous highlights
    cy.elements().removeClass('highlighted dimmed')
    
    // Get connected edges and nodes
    const connectedEdges = node.connectedEdges()
    const connectedNodes = connectedEdges.connectedNodes()
    
    // Dim all, then highlight connected
    cy.elements().addClass('dimmed')
    node.removeClass('dimmed').addClass('highlighted')
    connectedEdges.removeClass('dimmed').addClass('highlighted')
    connectedNodes.removeClass('dimmed')
    
    // Show popup
    selectedSim.value = simsStore.sims.find(s => s.id === nodeId)
    showSimPopup.value = true
  })
  
  // Click on background to clear highlights
  cy.on('tap', (evt) => {
    if (evt.target === cy) {
      cy.elements().removeClass('highlighted dimmed')
    }
  })
}

function updateTooltipPosition(evt) {
  const containerRect = cyContainer.value.getBoundingClientRect()
  const renderedPos = evt.target.renderedPosition()
  tooltipPos.value = {
    x: Math.min(renderedPos.x + 40, containerRect.width - 200),
    y: Math.max(renderedPos.y - 60, 10)
  }
}

// Search and center on a Sim
function searchAndCenter() {
  if (!cy || !searchQuery.value.trim()) return
  
  const query = searchQuery.value.trim().toLowerCase()
  const matchingNode = cy.nodes().filter(node => {
    return node.data('name').toLowerCase().includes(query)
  }).first()
  
  if (matchingNode.length > 0) {
    // Clear previous highlights
    cy.elements().removeClass('highlighted dimmed')
    
    // Highlight the found node and its connections
    const connectedEdges = matchingNode.connectedEdges()
    const connectedNodes = connectedEdges.connectedNodes()
    
    cy.elements().addClass('dimmed')
    matchingNode.removeClass('dimmed').addClass('highlighted')
    connectedEdges.removeClass('dimmed').addClass('highlighted')
    connectedNodes.removeClass('dimmed')
    
    // Animate to center on the node
    cy.animate({
      center: { eles: matchingNode },
      zoom: 1.5
    }, {
      duration: 500
    })
    
    // Show popup
    selectedSim.value = simsStore.sims.find(s => s.id === matchingNode.id())
    showSimPopup.value = true
  }
}

function resetZoom() {
  if (cy) {
    cy.fit(50)
  }
}

function exportImage() {
  if (!cy) return
  
  const png = cy.png({
    output: 'blob',
    bg: '#ffffff',
    full: true,
    scale: 2
  })
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(png)
  link.download = 'slakttrad.png'
  link.click()
  URL.revokeObjectURL(link.href)
}

// Watch for changes and reinitialize
watch([filteredSims, filteredRelationships], async () => {
  await nextTick()
  if (cy) {
    cy.destroy()
    cy = null
  }
  initCytoscape()
}, { deep: true })

// Clear highlights when popup closes
watch(showSimPopup, (isOpen) => {
  if (!isOpen && cy) {
    cy.elements().removeClass('highlighted dimmed')
  }
})

onMounted(async () => {
  await nextTick()
  initCytoscape()
})

onUnmounted(() => {
  if (cy) {
    cy.destroy()
    cy = null
  }
})
</script>

<style>
.dashed {
  border-style: dashed;
}
</style>
