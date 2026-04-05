import { defineStore } from 'pinia';
import { router } from '@/router';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  roleID: number;
  department: string;
  image: string;
  token: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  returnUrl: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: JSON.parse(localStorage.getItem('user') || 'null')?.token || null,
    returnUrl: null
  }),
  getters: {
    userRole: (state): string | null => state.user?.role || null,
    isAdmin: (state): boolean => state.user?.role === 'Administrator'
  },
  actions: {
    async login(email: string, password: string) {
      const user = await fetchWrapper.post(`${baseUrl}login`, { email, password });
      localStorage.setItem('user', JSON.stringify(user));
      window.location.reload()
    },
    async loginWithGoogle() {
      window.location.href = `${baseUrl}auth/google/redirect`;
    },

    // 🚀 Google OAuth Callback (Step 2: Handle response from backend)
    async googleLogin(credential: string) {
      // Decode value in base64 and json parse
      let credentialDecode = atob(credential);
      credentialDecode = JSON.parse(credentialDecode);
      localStorage.setItem('user', JSON.stringify(credentialDecode));
      window.location.reload();
      // Optionally, you can parse the user data and set it in the store
    },
    
    logout() {
      this.user = null;
      localStorage.removeItem('user');
      router.push('/login');
    }
  }
});


