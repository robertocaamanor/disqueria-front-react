import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Toast, type ToastProps } from '../../../components/ui/Toast';

describe('Toast', () => {
    const defaultProps: ToastProps = {
        id: '1',
        message: 'Test Message',
        type: 'success',
        onClose: vi.fn(),
    };

    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders message correctly', () => {
        render(<Toast {...defaultProps} />);
        expect(screen.getByText('Test Message')).toBeInTheDocument();
    });

    it('renders correct styles based on type', () => {
        const { rerender } = render(<Toast {...defaultProps} type="success" />);
        expect(screen.getByText('Test Message').parentElement).toHaveClass('border-green-500/20');

        rerender(<Toast {...defaultProps} type="error" />);
        expect(screen.getByText('Test Message').parentElement).toHaveClass('border-red-500/20');
    });

    it('calls onClose when close button is clicked', () => {
        render(<Toast {...defaultProps} />);
        fireEvent.click(screen.getByRole('button'));
        expect(defaultProps.onClose).toHaveBeenCalledWith('1');
    });

    it('auto closes after 5 seconds', () => {
        render(<Toast {...defaultProps} />);

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(defaultProps.onClose).toHaveBeenCalledWith('1');
    });

    it('clears timer on unmount', () => {
        const { unmount } = render(<Toast {...defaultProps} />);
        unmount();

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        // Should not have called it again if unmounted (though this test relies on implementation details of clearTimeout)
        // A better check is that no side effects happen.
        // But since we are mocking, we just ensure calls count doesn't increase unexpectedly.
        // Since we refreshed mock in test above, let's reset to be sure.
        vi.clearAllMocks();

        // Re-render and unmount
        const props = { ...defaultProps, onClose: vi.fn() };
        const { unmount: unmount2 } = render(<Toast {...props} />);
        unmount2();

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(props.onClose).not.toHaveBeenCalled();
    });
});
