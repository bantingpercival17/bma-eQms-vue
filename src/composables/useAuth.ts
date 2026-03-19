// src/composables/useAuth.ts

import { ref } from 'vue';
import { useApi } from './useApi'; // Import the API composable
import type { User, AuthResponse } from '../types'; // Import types

export function useAuth() {
    const token = ref<string | null>(localStorage.getItem('laravel_api_token'));
    const user = ref<User | null>(null);

    // Use the API composable for network requests
    const { callApi, loading, error, message } = useApi();

    /**
     * Handles user login.
     * @param email User's email
     * @param password User's password
     */
    const login = async (emailValue: string, passwordValue: string) => {
        const response = await callApi<AuthResponse>('/login', 'POST', {
            email: emailValue,
            password: passwordValue,
        });

        if (response && response.access_token) {
            token.value = response.access_token;
            user.value = response.user;
            localStorage.setItem('laravel_api_token', response.access_token);
            message.value = 'Login successful!';
        } else {
            token.value = null;
            user.value = null;
            localStorage.removeItem('laravel_api_token');
            error.value = 'Login failed. Please check your credentials.';
        }
    };

    /**
     * Handles user logout.
     */
    const logout = () => {
        token.value = null;
        user.value = null;
        localStorage.removeItem('laravel_api_token');
        message.value = 'Logged out successfully.';
        error.value = '';
    };

    /**
     * Fetches the authenticated user's profile.
     */
    const fetchProfile = async () => {
        if (!token.value) {
            error.value = 'Not authenticated. Please log in to fetch profile.';
            return;
        }
        const response = await callApi<{ user: User }>('/user', 'GET', undefined, token.value);
        if (response?.user) {
            user.value = response.user;
        } else {
            error.value = 'Failed to fetch user profile.';
        }
    };

    return {
        token,
        user,
        login,
        logout,
        fetchProfile,
        // Expose loading, error, message from useApi for auth operations
        loading: loading,
        error: error,
        message: message,
    };
}
