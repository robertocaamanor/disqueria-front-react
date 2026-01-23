import { describe, it, expect, vi, beforeEach } from 'vitest';
import client from '../../api/client';
import { login, register } from '../../api/auth';

vi.mock('../../api/client', () => {
    return {
        default: {
            post: vi.fn(),
            get: vi.fn(),
            interceptors: {
                request: { use: vi.fn() }
            }
        }
    };
});

describe('Auth API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('login calls correct endpoint and returns data', async () => {
        const mockResponse = { data: { token: 'abc', user: { id: 1 } } };
        (client.post as any).mockResolvedValue(mockResponse);

        const result = await login('test@test.com', 'password');

        expect(client.post).toHaveBeenCalledWith('/auth/login', { email: 'test@test.com', password: 'password' });
        expect(result).toEqual(mockResponse.data);
    });

    it('register calls correct endpoint and returns data', async () => {
        const mockResponse = { data: { id: 1, email: 'test@test.com' } };
        (client.post as any).mockResolvedValue(mockResponse);

        const userData = { email: 'test@test.com', password: 'password', name: 'Test' };
        const result = await register(userData);

        expect(client.post).toHaveBeenCalledWith('/users', userData);
        expect(result).toEqual(mockResponse.data);
    });
});
