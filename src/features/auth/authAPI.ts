// src/features/auth/authAPI.ts

export interface LoginResponse {
    token: string;
    userId: string;
    role: string;
}

export async function login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        // credentials: 'include', // Uncomment if using cookie-based auth
    });

    const data = await response.json().catch(() => ({ message: 'An unknown error occurred' }));

    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }

    // Make sure the backend response contains the expected "token"
    return data;
}
