import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db, storage } from '@/services/firebase'
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

export const useSimsStore = defineStore('sims', () => {
  // State
  const worlds = ref([])
  const houses = ref([])
  const sims = ref([])
  const relationships = ref([])
  const diaryEntries = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Computed
  const getWorldById = computed(() => (id) => worlds.value.find(w => w.id === id))
  const getHouseById = computed(() => (id) => houses.value.find(h => h.id === id))
  const getSimById = computed(() => (id) => sims.value.find(s => s.id === id))
  
  const getHousesByWorld = computed(() => (worldId) => 
    houses.value.filter(h => h.worldId === worldId)
  )
  
  const getSimsByHouse = computed(() => (houseId) => 
    sims.value.filter(s => s.houseId === houseId)
  )
  
  const getSimsByWorld = computed(() => (worldId) => {
    const worldHouses = houses.value.filter(h => h.worldId === worldId)
    const houseIds = worldHouses.map(h => h.id)
    return sims.value.filter(s => houseIds.includes(s.houseId))
  })

  const getRelationshipsForSim = computed(() => (simId) => 
    relationships.value.filter(r => r.sim1Id === simId || r.sim2Id === simId)
  )

  const getDiaryForSim = computed(() => (simId) => 
    diaryEntries.value
      .filter(d => d.simId === simId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  )

  // Actions - Worlds
  async function fetchWorlds() {
    isLoading.value = true
    try {
      const q = query(collection(db, 'worlds'), orderBy('order', 'asc'))
      const snapshot = await getDocs(q)
      worlds.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      error.value = err.message
      console.error('Error fetching worlds:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function addWorld(worldData) {
    try {
      const docRef = await addDoc(collection(db, 'worlds'), {
        ...worldData,
        order: worlds.value.length,
        createdAt: new Date().toISOString()
      })
      const newWorld = { id: docRef.id, ...worldData, order: worlds.value.length }
      worlds.value.push(newWorld)
      return newWorld
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function updateWorld(id, worldData) {
    try {
      await updateDoc(doc(db, 'worlds', id), worldData)
      const index = worlds.value.findIndex(w => w.id === id)
      if (index !== -1) {
        worlds.value[index] = { ...worlds.value[index], ...worldData }
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function deleteWorld(id) {
    try {
      await deleteDoc(doc(db, 'worlds', id))
      worlds.value = worlds.value.filter(w => w.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // Actions - Houses
  async function fetchHouses() {
    isLoading.value = true
    try {
      const snapshot = await getDocs(collection(db, 'houses'))
      houses.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function addHouse(houseData) {
    try {
      const docRef = await addDoc(collection(db, 'houses'), {
        ...houseData,
        createdAt: new Date().toISOString()
      })
      const newHouse = { id: docRef.id, ...houseData }
      houses.value.push(newHouse)
      return newHouse
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function updateHouse(id, houseData) {
    try {
      await updateDoc(doc(db, 'houses', id), houseData)
      const index = houses.value.findIndex(h => h.id === id)
      if (index !== -1) {
        houses.value[index] = { ...houses.value[index], ...houseData }
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function deleteHouse(id) {
    try {
      await deleteDoc(doc(db, 'houses', id))
      houses.value = houses.value.filter(h => h.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // Actions - Sims
  async function fetchSims() {
    isLoading.value = true
    try {
      const snapshot = await getDocs(collection(db, 'sims'))
      sims.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function addSim(simData) {
    try {
      const docRef = await addDoc(collection(db, 'sims'), {
        ...simData,
        createdAt: new Date().toISOString()
      })
      const newSim = { id: docRef.id, ...simData }
      sims.value.push(newSim)
      return newSim
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function updateSim(id, simData) {
    try {
      await updateDoc(doc(db, 'sims', id), simData)
      const index = sims.value.findIndex(s => s.id === id)
      if (index !== -1) {
        sims.value[index] = { ...sims.value[index], ...simData }
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function deleteSim(id) {
    try {
      await deleteDoc(doc(db, 'sims', id))
      sims.value = sims.value.filter(s => s.id !== id)
      // Also delete related relationships and diary entries
      relationships.value = relationships.value.filter(r => r.sim1Id !== id && r.sim2Id !== id)
      diaryEntries.value = diaryEntries.value.filter(d => d.simId !== id)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // Actions - Relationships
  async function fetchRelationships() {
    try {
      const snapshot = await getDocs(collection(db, 'relationships'))
      relationships.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      error.value = err.message
    }
  }

  async function addRelationship(relationData) {
    try {
      const docRef = await addDoc(collection(db, 'relationships'), {
        ...relationData,
        createdAt: new Date().toISOString()
      })
      const newRelation = { id: docRef.id, ...relationData }
      relationships.value.push(newRelation)
      return newRelation
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function deleteRelationship(id) {
    try {
      await deleteDoc(doc(db, 'relationships', id))
      relationships.value = relationships.value.filter(r => r.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // Actions - Diary
  async function fetchDiaryEntries() {
    try {
      const snapshot = await getDocs(collection(db, 'diary'))
      diaryEntries.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      error.value = err.message
    }
  }

  async function addDiaryEntry(entryData) {
    try {
      const docRef = await addDoc(collection(db, 'diary'), {
        ...entryData,
        createdAt: new Date().toISOString()
      })
      const newEntry = { id: docRef.id, ...entryData }
      diaryEntries.value.push(newEntry)
      return newEntry
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function deleteDiaryEntry(id) {
    try {
      await deleteDoc(doc(db, 'diary', id))
      diaryEntries.value = diaryEntries.value.filter(d => d.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // Image upload
  async function uploadImage(file, path) {
    try {
      const imageRef = storageRef(storage, path)
      await uploadBytes(imageRef, file)
      const url = await getDownloadURL(imageRef)
      return url
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // Initialize - fetch all data
  async function initializeData() {
    isLoading.value = true
    try {
      await Promise.all([
        fetchWorlds(),
        fetchHouses(),
        fetchSims(),
        fetchRelationships(),
        fetchDiaryEntries()
      ])
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    worlds,
    houses,
    sims,
    relationships,
    diaryEntries,
    isLoading,
    error,
    
    // Computed
    getWorldById,
    getHouseById,
    getSimById,
    getHousesByWorld,
    getSimsByHouse,
    getSimsByWorld,
    getRelationshipsForSim,
    getDiaryForSim,
    
    // Actions
    fetchWorlds,
    addWorld,
    updateWorld,
    deleteWorld,
    fetchHouses,
    addHouse,
    updateHouse,
    deleteHouse,
    fetchSims,
    addSim,
    updateSim,
    deleteSim,
    fetchRelationships,
    addRelationship,
    deleteRelationship,
    fetchDiaryEntries,
    addDiaryEntry,
    deleteDiaryEntry,
    uploadImage,
    initializeData
  }
})
