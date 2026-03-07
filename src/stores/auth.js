import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/services/firebase'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const userName = ref('')
  const hasCompletedOnboarding = ref(false)
  const sessionToken = ref(null)

  // Check if there's an existing session in localStorage
  function checkSession() {
    const savedSession = localStorage.getItem('simaja_session')
    const savedOnboarding = localStorage.getItem('simaja_onboarding')
    const savedUserName = localStorage.getItem('simaja_username')

    if (savedSession) {
      sessionToken.value = savedSession
      isAuthenticated.value = true

      if (savedOnboarding === 'true') {
        hasCompletedOnboarding.value = true
      }

      if (savedUserName) {
        userName.value = savedUserName
      }

      return true
    }
    return false
  }

  // Verify password using Firebase Authentication
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      sessionToken.value = await userCredential.user.getIdToken()
      isAuthenticated.value = true
      localStorage.setItem('simaja_session', sessionToken.value)
      return { success: true }
    } catch (error) {
      console.error(error)
      return { success: false, error: 'Invalid email or password' }
    }
  }

  function completeOnboarding(name) {
    userName.value = name
    hasCompletedOnboarding.value = true
    localStorage.setItem('simaja_onboarding', 'true')
    localStorage.setItem('simaja_username', name)
  }

  async function logout() {
    await signOut(auth)
    isAuthenticated.value = false
    sessionToken.value = null
    userName.value = ''
    hasCompletedOnboarding.value = false
    localStorage.removeItem('simaja_session')
    localStorage.removeItem('simaja_onboarding')
    localStorage.removeItem('simaja_username')
  }

  return {
    isAuthenticated,
    userName,
    hasCompletedOnboarding,
    sessionToken,
    checkSession,
    login,
    completeOnboarding,
    logout
  }
})
