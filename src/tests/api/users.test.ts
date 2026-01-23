import { describe, it, expect, vi, beforeEach } from 'vitest';
import client from '../../api/client';
import { findUser } from '../../api/users';

vi.mock('../../api/client', () => {
    return {
        default: {
            get: vi.fn(),
            interceptors: {
                request: { use: vi.fn() }
            }
        }
    };
});

describe('Users API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('findUser calls correct endpoint', async () => {
        const mockData = { id: 1, email: 'test@test.com' };
        (client.get as any).mockResolvedValue({ data: mockData });

        const result = await findUser('test@test.com');
        expect(client.get).toHaveBeenCalledWith('/users/test@test.com');
        expect(result).toEqual(mockData);
    });
});
