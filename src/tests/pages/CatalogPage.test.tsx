import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CatalogPage } from '../../pages/CatalogPage';
import { getArtists, getAlbums } from '../../api/catalog';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../api/catalog');
vi.mock('../../context/AuthContext');
vi.mock('../../context/ToastContext');
vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key })
}));

describe('CatalogPage', () => {
    const mockArtists = [
        { id: 1, name: 'Artist 1', country: 'US' },
        { id: 2, name: 'Artist 2', country: 'UK' }
    ];
    const mockAlbums = [
        { id: 1, title: 'Album 1', artist: { id: 1 }, price: 10, year: 2020 },
        { id: 2, title: 'Album 2', artist: { id: 2 }, price: 15, year: 2021 }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (getArtists as any).mockResolvedValue(mockArtists);
        (getAlbums as any).mockResolvedValue(mockAlbums);
        (useAuth as any).mockReturnValue({ user: { id: 1 }, isAuthenticated: true });
        (useToast as any).mockReturnValue({ showToast: vi.fn() });
    });

    it('renders catalogs of artists and albums', async () => {
        render(
            <MemoryRouter>
                <CatalogPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Artist 1')).toBeInTheDocument();
            expect(screen.getByText('Album 1')).toBeInTheDocument();
        });
    });

    it('filters artists', async () => {
        render(
            <MemoryRouter>
                <CatalogPage />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Artist 1')).toBeInTheDocument());

        fireEvent.change(screen.getByPlaceholderText('catalog.searchPlaceholder'), { target: { value: 'Artist 2' } });

        await waitFor(() => {
            expect(screen.queryByText('Artist 1')).not.toBeInTheDocument();
            expect(screen.getByText('Artist 2')).toBeInTheDocument();
        });
    });

    it('can open create artist modal', async () => {
        render(
            <MemoryRouter>
                <CatalogPage />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('catalog.addArtist')).toBeInTheDocument());
        fireEvent.click(screen.getByText('catalog.addArtist'));
        expect(screen.getByText('modals.addArtistTitle')).toBeInTheDocument(); // Mocked or actual modal
    });
});
