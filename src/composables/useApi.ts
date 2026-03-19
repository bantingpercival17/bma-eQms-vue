// src/composables/useApi.ts

import { ref } from 'vue';

const API_BASE_URL = 'http://localhost:8000/api'; // Your Laravel API Base URL

export function useApi() {
    const loading = ref<boolean>(false);
    const error = ref<string>('');
    const message = ref<string>('');

    /**
     * Generic function to make authenticated API requests.
     * @param endpoint The API endpoint (e.g., '/login', '/items')
     * @param method The HTTP method (GET, POST, PUT, DELETE)
     * @param data The request body data
     * @param authToken The bearer token for authentication
     * @param isFormData Boolean to indicate if data is FormData (for file uploads like PDF)
     */
    const callApi = async <T>(
        endpoint: string,
        method: string = 'GET',
        data?: any,
        authToken: string | null = null,
        isFormData: boolean = false
    ): Promise<T | null> => {
        loading.value = true;
        error.value = '';
        message.value = '';

        const headers: HeadersInit = {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            'Accept': 'application/json',
        };

        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        try {
            const config: RequestInit = {
                method,
                headers,
                body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
            };

            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

            if (response.ok) {
                // Handle PDF blob response specifically
                if (endpoint.includes('/items/pdf') && method === 'GET') {
                    message.value = 'PDF retrieved successfully.';
                    return response.blob() as Promise<T>;
                }

                const result = await response.json();
                message.value = `Operation successful: ${JSON.stringify(result.message || result.data || result)}`;
                return result as T;
            } else {
                const errorData = await response.json();
                error.value = `API Error: ${errorData.message || 'Something went wrong.'} (Status: ${response.status})`;
                return null;
            }
        } catch (err: any) {
            console.error("Fetch error:", err);
            error.value = `Network or request error: ${err.message}`;
            return null;
        } finally {
            loading.value = false;
        }
    };

    return { callApi, loading, error, message };
}
