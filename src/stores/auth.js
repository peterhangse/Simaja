import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

  // Verify password against environment variable (via API)
  async function login(password) {
    try {
      // For local development, check against the configured password
      // In production, this would be a Firebase Function call
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      
      if (response.ok) {
        const data = await response.json()
        sessionToken.value = data.token
        isAuthenticated.value = true
        localStorage.setItem('simaja_session', data.token)
        return { success: true }
      }
      
      return { success: false, error: 'Fel lösenord' }
    } catch (error) {
      // Fallback for development without backend
      // This will be replaced by actual auth in production
      const correctPassword = import.meta.env.VITE_APP_PASSWORD || 'maja'
      
      if (password === correctPassword) {
        const token = btoa(Date.now().toString())
        sessionToken.value = token
        isAuthenticated.value = true
        localStorage.setItem('simaja_session', token)
        return { success: true }
      }
      
      return { success: false, error: 'Fel lösenord' }
    }
  }

  function completeOnboarding(name) {
    userName.value = name
    hasCompletedOnboarding.value = true
    localStorage.setItem('simaja_onboarding', 'true')
    localStorage.setItem('simaja_username', name)
  }

  function logout() {
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
