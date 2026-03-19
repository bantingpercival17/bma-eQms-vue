interface LoginResponse {
    token: string;
    user: {
        id: number;
        username: string;
        firstName: string;
        lastName: string;
    };
}

async function login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch('http://your-laravel-domain.com/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ email: username, password })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
}
