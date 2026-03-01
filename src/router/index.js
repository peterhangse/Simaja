import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: () => import('@/views/OnboardingView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/worlds',
    name: 'Worlds',
    component: () => import('@/views/WorldsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/worlds/:worldId',
    name: 'WorldDetail',
    component: () => import('@/views/WorldDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/sims',
    name: 'Sims',
    component: () => import('@/views/SimsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/sims/:simId',
    name: 'SimDetail',
    component: () => import('@/views/SimDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/family-tree',
    name: 'FamilyTree',
    component: () => import('@/views/FamilyTreeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/floor-plan',
    name: 'FloorPlan',
    component: () => import('@/views/FloorPlanView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const hasCompletedOnboarding = authStore.hasCompletedOnboarding

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (isAuthenticated && to.name === 'Login') {
    next('/')
  } else if (isAuthenticated && !hasCompletedOnboarding && to.name !== 'Onboarding') {
    next('/onboarding')
  } else {
    next()
  }
})

export default router
