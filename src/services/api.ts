import { useAuthStore } from '@/stores/auth'
import { router } from '@/router'

const baseUrl = import.meta.env.VITE_API_URL

export async function api(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const authStore = useAuthStore()

    const res = await fetch(baseUrl + url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            ...(authStore.token && {
                Authorization: `Bearer ${authStore.token}`
            })
        }
    })

    // 🔐 եթե unauthorized
    if (res.status === 401) {
        authStore.logout()
        router.push({ name: 'Login' })
    }

    // ❌ handle errors
    if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw {
            status: res.status,
            error
        }
    }

    return res
}