import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginPage } from '../../pages/LoginPage';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { login } from '../../api/auth';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../context/AuthContext');
vi.mock('../../context/ToastContext');
vi.mock('../../api/auth');
vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key })
}));

// Mock react-router-dom useNavigate
const useNavigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => useNavigateMock,
    };
});

describe('LoginPage', () => {
    const loginAuthMock = vi.fn();
    const showToastMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({ login: loginAuthMock });
        (useToast as any).mockReturnValue({ showToast: showToastMock });
    });

    it('renders login form', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        expect(screen.getByLabelText('auth.email')).toBeInTheDocument();
        expect(screen.getByLabelText('auth.password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'auth.signIn' })).toBeInTheDocument();
    });

    it('calls login API and auth context on valid submission', async () => {
        (login as any).mockResolvedValue({
            access_token: 'abc.def.ghi',
            user: { id: 1 }
        });

        // Mock window.atob for JWT decoding
        vi.spyOn(window, 'atob').mockReturnValue(JSON.stringify({ sub: 1, username: 'test@test.com' }));

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('auth.email'), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText('auth.password'), { target: { value: 'password' } });

        fireEvent.click(screen.getByRole('button', { name: 'auth.signIn' }));

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith('test@test.com', 'password');
            expect(loginAuthMock).toHaveBeenCalled();
            // LoginPage doesn't show toast on success in the code! It just navigates.
            // Wait, looking at LoginPage.tsx:
            // login(data.access_token, userWithId); navigate('/catalog');
            // It does NOT showToast success.
            expect(useNavigateMock).toHaveBeenCalledWith('/catalog');
        });
    });

    it('handles login error', async () => {
        (login as any).mockRejectedValue({ response: { data: { message: 'auth.invalidCredentials' } } });

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('auth.email'), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText('auth.password'), { target: { value: 'wrong' } });

        fireEvent.click(screen.getByRole('button', { name: 'auth.signIn' }));

        await waitFor(() => {
            expect(login).toHaveBeenCalled();
            expect(loginAuthMock).not.toHaveBeenCalled();
            // It calls setError, rendering error message text.
            expect(screen.getByText('auth.invalidCredentials')).toBeInTheDocument();
        });
    });
});
