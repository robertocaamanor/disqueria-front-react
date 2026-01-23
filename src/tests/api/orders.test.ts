import { describe, it, expect, vi, beforeEach } from 'vitest';
import client from '../../api/client';
import { createOrder, getUserOrders } from '../../api/orders';

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

describe('Orders API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('createOrder calls correct endpoint', async () => {
        const mockData = { id: 1, total: 20 };
        const input = { userId: 1, items: [{ albumId: 1, quantity: 2, price: 10 }] };
        (client.post as any).mockResolvedValue({ data: mockData });

        const result = await createOrder(input);
        expect(client.post).toHaveBeenCalledWith('/orders', input);
        expect(result).toEqual(mockData);
    });

    it('getUserOrders calls correct endpoint', async () => {
        const mockData = [{ id: 1, total: 20 }];
        (client.get as any).mockResolvedValue({ data: mockData });

        const result = await getUserOrders(123);
        expect(client.get).toHaveBeenCalledWith('/orders/user/123');
        expect(result).toEqual(mockData);
    });
});
