export { apiController };

interface User {
    id: number;
    username: string;
    password?: string;
    firstName: string;
    lastName: string;
}

interface ResponseBody {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    token: string;
}

const apiUrl = 'https://your-laravel-api.com/api'; // Update to your API base URL

const apiController = {
    authenticate,
    getUsers,
};

// --- Authenticate User ---
async function authenticate(username: string, password: string, link: string): Promise<ResponseBody> {
    const response = await fetch(link, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            email: username,
            password: password,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
    }

    const data = await response.json();

    return {
        id: data.user.id,
        username: data.user.email,
        firstName: data.user.first_name,
        lastName: data.user.last_name,
        token: data.token,
    };
}

// --- Get Authenticated Users ---
async function getUsers(token: string): Promise<User[]> {
    const response = await fetch(`${apiUrl}/users`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unauthorized access');
    }

    const data = await response.json();

    return data.map((user: any) => ({
        id: user.id,
        username: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
    }));
}
