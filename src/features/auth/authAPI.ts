export interface User {
    id: string;
    email: string;
}

export interface LoginResponse {
    user: User ;
    token: string | null;
}
export async function login(credentials:{ email: string, password: string} ): Promise<LoginResponse> {
    const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
    })
    if (!response.ok) {
        throw new Error('Failed to login')
    }
    const data = await response.json()
    return data
}