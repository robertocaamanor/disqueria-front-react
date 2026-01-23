import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import React from 'react';

// Wrapper component to use the hook
const TestComponent = () => {
    const { user, token, login, logout, isAuthenticated } = useAuth();
    return (
        <div>
            <div data-testid="user">{user ? user.name : 'No User'}</div>
            <div data-testid="token">{token ? token : 'No Token'}</div>
            <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
            <button onClick={() => login('fake-token', { name: 'Test User' })}>Login</button>
            <button onClick={() => logout()}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    it('provides default values', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
        expect(screen.getByTestId('user')).toHaveTextContent('No User');
    });

    it('allows login to update state', async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
            expect(screen.getByTestId('token')).toHaveTextContent('fake-token');
            expect(screen.getByTestId('user')).toHaveTextContent('Test User');
        });
    });

    it('allows logout to clear state', async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        fireEvent.click(screen.getByText('Login'));
        await waitFor(() => expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated'));

        fireEvent.click(screen.getByText('Logout'));

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
            expect(screen.getByTestId('user')).toHaveTextContent('No User');
        });
    });

    it('initializes from localStorage', () => {
        localStorage.setItem('token', 'stored-token');
        localStorage.setItem('user', JSON.stringify({ name: 'Stored User' }));

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
        expect(screen.getByTestId('token')).toHaveTextContent('stored-token');
        expect(screen.getByTestId('user')).toHaveTextContent('Stored User');

        localStorage.clear();
    });
});
