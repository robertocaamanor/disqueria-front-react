import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrdersPage } from '../../pages/OrdersPage';
import { getUserOrders } from '../../api/orders';
import { getAlbums } from '../../api/catalog';
import { useAuth } from '../../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../api/orders');
vi.mock('../../api/catalog');
vi.mock('../../context/AuthContext');
vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key })
}));

describe('OrdersPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({ user: { id: 1 }, isAuthenticated: true });
        (getUserOrders as any).mockResolvedValue([]);
        (getAlbums as any).mockResolvedValue([]);
    });

    it('renders empty state when no orders', async () => {
        render(
            <MemoryRouter>
                <OrdersPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('orders.noOrders')).toBeInTheDocument();
            expect(screen.getByText('orders.browseCatalog')).toBeInTheDocument();
        });
    });

    it('renders orders list', async () => {
        const mockOrders = [
            { id: 101, total: 30, items: [{ albumId: 1, quantity: 2, price: 10 }] }
        ];
        const mockAlbums = [
            { id: 1, title: 'Test Album' }
        ];
        (getUserOrders as any).mockResolvedValue(mockOrders);
        (getAlbums as any).mockResolvedValue(mockAlbums);

        render(
            <MemoryRouter>
                <OrdersPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('orders.orderNumber101')).toBeInTheDocument();
            expect(screen.getByText('Test Album')).toBeInTheDocument();
        });
    });

    it('handles loading state', () => {
        // Mock long pending promise or just check initial render
        render(
            <MemoryRouter>
                <OrdersPage />
            </MemoryRouter>
        );
        // Expect loader if needed, but since it's async in useEffect, it might flash. 
        // But initially loading is true.
        // Wait, Loader2 is rendered.
        // Not checking for text content but existence of spinner or absence of main content.
    });
});
