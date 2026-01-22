import client from './client';

export const login = async (email: string, password: string) => {
    const response = await client.post('/auth/login', { email, password });
    return response.data;
};

// Assuming register user endpoint is in Users controller but it's a public endpoint
export const register = async (userData: any) => {
    const response = await client.post('/users', userData);
    return response.data;
};
