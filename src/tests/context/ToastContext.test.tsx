import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ToastProvider, useToast } from '../../context/ToastContext';
import React from 'react';

const TestComponent = () => {
    const { showToast } = useToast();
    return (
        <button onClick={() => showToast('Test Message', 'success')}>Show Toast</button>
    );
};

describe('ToastContext', () => {
    it('shows toast when showToast is called', () => {
        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        );

        fireEvent.click(screen.getByText('Show Toast'));

        expect(screen.getByText('Test Message')).toBeInTheDocument();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('can remove toast', async () => {
        vi.useFakeTimers();
        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        );

        fireEvent.click(screen.getByText('Show Toast'));
        expect(screen.getByText('Test Message')).toBeInTheDocument();

        // Simulate close button click
        const closeBtn = screen.getByLabelText('Close');
        fireEvent.click(closeBtn);

        expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
        vi.useRealTimers();
    });

    it('throws error if used outside provider', () => {
        // Suppress console.error
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => render(<TestComponent />)).toThrow('useToast must be used within a ToastProvider');

        consoleSpy.mockRestore();
    });
});
