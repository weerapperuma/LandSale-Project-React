import usersData from '../../data/users.json';

export interface User {
    id: string;
    email: string;
    name?: string;
}

export interface LoginResponse {
    user: User;
    token: string | null;
}

// Import users from users.json and map to our format
const mockUsers = usersData.map(user => ({
    id: user.userId,
    email: user.userEmail,
    password: user.userPassword, // Note: In real app, this would be hashed
    name: user.userName
}));

// Mock login function for testing
export async function mockLogin(credentials: { email: string; password: string }): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);
    
    if (!user) {
        throw new Error('Invalid email or password');
    }
    
    return {
        user: { id: user.id, email: user.email, name: user.name },
        token: `mock-token-${user.id}-${Date.now()}`
    };
}

// Real API function (for production)
export async function login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials),
        });
        
        if (!response.ok) {
            throw new Error('Failed to login');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        // Fallback to mock login if real API is not available
        console.warn('Real API not available, using mock login');
        return mockLogin(credentials);
    }
}

// Use mock login for development
export const loginUser = mockLogin;