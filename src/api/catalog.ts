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
