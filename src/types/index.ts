// src/types/index.ts

export interface User {
    id: number;
    name: string;
    image: string;
    email: string;
    // Add other user properties as needed
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number; // typically seconds
    user: User;
}

export interface Item {
    id: number;
    name: string;
    description: string;
    // Add other item properties as needed
}
