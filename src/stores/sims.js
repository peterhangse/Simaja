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
  writeBatch,
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
  const profiles = ref([])
  const activeProfileId = ref(localStorage.getItem('simaja_profile') || 'default')
  const isLoading = ref(false)
  const error = ref(null)

  // Profile helper — matches documents to active profile
  function matchesProfile(docProfileId) {
    const pid = activeProfileId.value
    if (pid === 'default') return !docProfileId || docProfileId === 'default'
    return docProfileId === pid
  }

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

  // Planned / Active sims
  const activeSims = computed(() => sims.value.filter(s => s.status !== 'planned'))
  const plannedSims = computed(() => sims.value.filter(s => s.status === 'planned'))

  // Actions - Worlds
  async function fetchWorlds() {
    isLoading.value = true
    try {
      const snapshot = await getDocs(collection(db, 'worlds'))
      worlds.value = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(w => matchesProfile(w.profileId))
        .sort((a, b) => (a.order || 0) - (b.order || 0))
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
        profileId: activeProfileId.value,
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
      const batch = writeBatch(db)
      
      // Find all houses in this world
      const worldHouses = houses.value.filter(h => h.worldId === id)
      const worldHouseIds = worldHouses.map(h => h.id)
      
      // Find all sims in those houses
      const worldSims = sims.value.filter(s => worldHouseIds.includes(s.houseId))
      const worldSimIds = worldSims.map(s => s.id)
      
      // Delete relationships involving these sims
      const affectedRels = relationships.value.filter(r => 
        worldSimIds.includes(r.sim1Id) || worldSimIds.includes(r.sim2Id)
      )
      affectedRels.forEach(r => batch.delete(doc(db, 'relationships', r.id)))
      
      // Delete diary entries for these sims
      const affectedDiary = diaryEntries.value.filter(d => worldSimIds.includes(d.simId))
      affectedDiary.forEach(d => batch.delete(doc(db, 'diary', d.id)))
      
      // Delete the sims
      worldSims.forEach(s => batch.delete(doc(db, 'sims', s.id)))
      
      // Delete the houses
      worldHouses.forEach(h => batch.delete(doc(db, 'houses', h.id)))
      
      // Delete the world
      batch.delete(doc(db, 'worlds', id))
      
      await batch.commit()
      
      // Update local state
      relationships.value = relationships.value.filter(r => !affectedRels.find(ar => ar.id === r.id))
      diaryEntries.value = diaryEntries.value.filter(d => !affectedDiary.find(ad => ad.id === d.id))
      sims.value = sims.value.filter(s => !worldSimIds.includes(s.id))
      houses.value = houses.value.filter(h => !worldHouseIds.includes(h.id))
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
      houses.value = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(h => matchesProfile(h.profileId))
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
        profileId: activeProfileId.value,
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
      const batch = writeBatch(db)
      
      // Find sims in this house
      const houseSims = sims.value.filter(s => s.houseId === id)
      const houseSimIds = houseSims.map(s => s.id)
      
      // Delete relationships involving these sims
      const affectedRels = relationships.value.filter(r => 
        houseSimIds.includes(r.sim1Id) || houseSimIds.includes(r.sim2Id)
      )
      affectedRels.forEach(r => batch.delete(doc(db, 'relationships', r.id)))
      
      // Delete diary entries for these sims
      const affectedDiary = diaryEntries.value.filter(d => houseSimIds.includes(d.simId))
      affectedDiary.forEach(d => batch.delete(doc(db, 'diary', d.id)))
      
      // Delete the sims
      houseSims.forEach(s => batch.delete(doc(db, 'sims', s.id)))
      
      // Delete the house
      batch.delete(doc(db, 'houses', id))
      
      await batch.commit()
      
      // Update local state
      relationships.value = relationships.value.filter(r => !affectedRels.find(ar => ar.id === r.id))
      diaryEntries.value = diaryEntries.value.filter(d => !affectedDiary.find(ad => ad.id === d.id))
      sims.value = sims.value.filter(s => !houseSimIds.includes(s.id))
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
      sims.value = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(s => matchesProfile(s.profileId))
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
        profileId: activeProfileId.value,
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
      const batch = writeBatch(db)
      
      // Delete relationships involving this sim from Firestore
      const affectedRels = relationships.value.filter(r => r.sim1Id === id || r.sim2Id === id)
      affectedRels.forEach(r => batch.delete(doc(db, 'relationships', r.id)))
      
      // Delete diary entries for this sim from Firestore
      const affectedDiary = diaryEntries.value.filter(d => d.simId === id)
      affectedDiary.forEach(d => batch.delete(doc(db, 'diary', d.id)))
      
      // Delete the sim
      batch.delete(doc(db, 'sims', id))
      
      await batch.commit()
      
      // Update local state
      sims.value = sims.value.filter(s => s.id !== id)
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
      relationships.value = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(r => matchesProfile(r.profileId))
    } catch (err) {
      error.value = err.message
    }
  }

  async function addRelationship(relationData) {
    try {
      const docRef = await addDoc(collection(db, 'relationships'), {
        ...relationData,
        profileId: activeProfileId.value,
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
      diaryEntries.value = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(d => matchesProfile(d.profileId))
    } catch (err) {
      error.value = err.message
    }
  }

  async function addDiaryEntry(entryData) {
    try {
      const docRef = await addDoc(collection(db, 'diary'), {
        ...entryData,
        profileId: activeProfileId.value,
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
      await fetchProfiles()
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

  // Profiles
  async function fetchProfiles() {
    try {
      const snapshot = await getDocs(collection(db, 'profiles'))
      profiles.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      // Ensure we always have a default profile entry
      if (!profiles.value.find(p => p.id === 'default')) {
        profiles.value.unshift({ id: 'default', name: 'Default Save', createdAt: new Date().toISOString() })
      }
    } catch (err) {
      error.value = err.message
    }
  }

  async function addProfile(name) {
    try {
      const docRef = await addDoc(collection(db, 'profiles'), {
        name,
        createdAt: new Date().toISOString()
      })
      const newProfile = { id: docRef.id, name }
      profiles.value.push(newProfile)
      return newProfile
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function deleteProfile(profileId) {
    if (profileId === 'default') return
    try {
      await deleteDoc(doc(db, 'profiles', profileId))
      profiles.value = profiles.value.filter(p => p.id !== profileId)
      // If we deleted the active profile, switch to default
      if (activeProfileId.value === profileId) {
        await switchProfile('default')
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function switchProfile(profileId) {
    activeProfileId.value = profileId
    localStorage.setItem('simaja_profile', profileId)
    // Refetch all data filtered to new profile
    await Promise.all([
      fetchWorlds(),
      fetchHouses(),
      fetchSims(),
      fetchRelationships(),
      fetchDiaryEntries()
    ])
  }

  return {
    // State
    worlds,
    houses,
    sims,
    relationships,
    diaryEntries,
    profiles,
    activeProfileId,
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
    activeSims,
    plannedSims,
    
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
    initializeData,
    fetchProfiles,
    addProfile,
    deleteProfile,
    switchProfile
  }
})
