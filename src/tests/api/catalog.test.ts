import { describe, it, expect, vi, beforeEach } from 'vitest';
import client from '../../api/client';
import { getArtists, createArtist, getAlbums, createAlbum } from '../../api/catalog';

vi.mock('../../api/client', () => {
    return {
        default: {
            get: vi.fn(),
            post: vi.fn(),
            interceptors: {
                request: { use: vi.fn() }
            }
        }
    };
});

describe('Catalog API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getArtists calls correct endpoint', async () => {
        const mockData = [{ id: 1, name: 'Artist' }];
        (client.get as any).mockResolvedValue({ data: mockData });

        const result = await getArtists();
        expect(client.get).toHaveBeenCalledWith('/catalog/artists');
        expect(result).toEqual(mockData);
    });

    it('createArtist calls correct endpoint', async () => {
        const mockData = { id: 1, name: 'New Artist' };
        const input = { name: 'New Artist', country: 'US' };
        (client.post as any).mockResolvedValue({ data: mockData });

        const result = await createArtist(input);
        expect(client.post).toHaveBeenCalledWith('/catalog/artists', input);
        expect(result).toEqual(mockData);
    });

    it('getAlbums calls correct endpoint', async () => {
        const mockData = [{ id: 1, title: 'Album' }];
        (client.get as any).mockResolvedValue({ data: mockData });

        const result = await getAlbums();
        expect(client.get).toHaveBeenCalledWith('/catalog/albums');
        expect(result).toEqual(mockData);
    });

    it('createAlbum calls correct endpoint', async () => {
        const mockData = { id: 1, title: 'New Album' };
        const input = { title: 'New Album', artistId: 1, price: 10 };
        (client.post as any).mockResolvedValue({ data: mockData });

        const result = await createAlbum(input);
        expect(client.post).toHaveBeenCalledWith('/catalog/albums', input);
        expect(result).toEqual(mockData);
    });
});
