import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterPage } from '../../pages/RegisterPage';
import { useToast } from '../../context/ToastContext';
import { register } from '../../api/auth';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../context/ToastContext');
vi.mock('../../api/auth');
vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key })
}));

const useNavigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => useNavigateMock,
    };
});

describe('RegisterPage', () => {
    const showToastMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useToast as any).mockReturnValue({ showToast: showToastMock });
    });

    it('renders register form', () => {
        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        );
        expect(screen.getByLabelText('auth.name')).toBeInTheDocument();
        expect(screen.getByLabelText('auth.email')).toBeInTheDocument();
        expect(screen.getByLabelText('auth.password')).toBeInTheDocument();
    });

    it('calls register API on valid submission', async () => {
        (register as any).mockResolvedValue({});

        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('auth.name'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByLabelText('auth.email'), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText('auth.password'), { target: { value: 'password' } });

        fireEvent.click(screen.getByRole('button', { name: 'auth.signUp' }));

        await waitFor(() => {
            expect(register).toHaveBeenCalledWith({
                name: 'Test User',
                email: 'test@test.com',
                password: 'password'
            });
            // Toast mock call check might also need update if component changed keys?
            // Component uses navigate('/login'). It doesn't show toast success on register in the code I saw!
            // Wait, RegisterPage.tsx: await registerApi(...); navigate('/login');
            // It does NOT show toast success. It sets error on failure.
            // So my test checking for success is WRONG.
            expect(useNavigateMock).toHaveBeenCalledWith('/login');
        });
    });

    it('handles register error', async () => {
        (register as any).mockRejectedValue({ response: { data: { message: 'Failed' } } });

        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('auth.name'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByLabelText('auth.email'), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText('auth.password'), { target: { value: 'password' } });

        fireEvent.click(screen.getByRole('button', { name: 'auth.signUp' }));

        await waitFor(() => {
            expect(register).toHaveBeenCalled();
            // It sets error state which renders text.
            expect(screen.getByText('Failed')).toBeInTheDocument();
            // Does not show toast
        });
    });
});
