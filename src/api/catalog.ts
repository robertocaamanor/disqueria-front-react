import client from './client';

export const getArtists = async () => {
    const response = await client.get('/catalog/artists');
    return response.data;
};

export const createArtist = async (data: { name: string; country?: string }) => {
    const response = await client.post('/catalog/artists', data);
    return response.data;
};

export const getAlbums = async () => {
    const response = await client.get('/catalog/albums');
    return response.data;
};

export const createAlbum = async (data: any) => {
    const response = await client.post('/catalog/albums', data);
    return response.data;
};

export const updateArtist = async (id: number, data: { name: string; country?: string }) => {
    const response = await client.put(`/catalog/artists/${id}`, data);
    return response.data;
};

export const updateAlbum = async (id: number, data: any) => {
    const response = await client.put(`/catalog/albums/${id}`, data);
    return response.data;
};

export const deleteArtist = async (id: number) => {
    const response = await client.delete(`/catalog/artists/${id}`);
    return response.data;
};

export const deleteAlbum = async (id: number) => {
    const response = await client.delete(`/catalog/albums/${id}`);
    return response.data;
};
