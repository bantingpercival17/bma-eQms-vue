import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes'; // Authenticated routes
import PublicRoutes from './PublicRoutes'; // Public routes
import { useAuthStore } from '@/stores/auth'; // Pinia auth store
import { useUIStore } from '@/stores/ui'; // Pinia UI store (for loading spinner)
import EmployeeRoutes from './EmployeeRoutes';

// -------------------------------------------------------------
// ROUTER CONFIGURATION
// -------------------------------------------------------------
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    PublicRoutes, // spread ensures routes are loaded correctly
    /* MainRoutes, */
    EmployeeRoutes,
    {
      path: '/:pathMatch(.*)*', // Catch-all for 404s
      component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
    }
  ]
});

// -------------------------------------------------------------
// TYPE INTERFACES (optional, for better IntelliSense)
// -------------------------------------------------------------
interface User {
  id: number;
  name: string;
}

interface AuthStore {
  user: User | null;
  returnUrl: string | null;
  login(username: string, password: string): Promise<void>;
  logout(): void;
}

// -------------------------------------------------------------
// GLOBAL ROUTE GUARD
// -------------------------------------------------------------
router.beforeEach(async (to, from, next) => {
  const uiStore = useUIStore();
  const auth: AuthStore = useAuthStore();

  uiStore.isLoading = true;

  const publicPages = ['/login'];
  const isPublicPage = publicPages.includes(to.path);
  const authRequired = !isPublicPage && to.matched.some((r) => r.meta.requiresAuth);
  /*   console.log(authRequired)
    console.log(to.path) */
  // 🚪 Redirect unauthenticated users trying to access protected routes
  if (auth.user) {
    if (authRequired) {
      next();
    } else {
      next({ path: '/dashboard' });
    }
  } else {
    if (authRequired || to.path === '/') {
      next({ path: '/login' });
    } else {
      next();
    }
  }
});

// -------------------------------------------------------------
// STOP LOADING AFTER NAVIGATION
// -------------------------------------------------------------
router.afterEach(() => {
  const uiStore = useUIStore();
  uiStore.isLoading = false;
});
