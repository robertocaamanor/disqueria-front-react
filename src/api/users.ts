import client from './client';

export const findUser = async (email: string) => {
    const response = await client.get(`/users/${email}`);
    return response.data;
};
