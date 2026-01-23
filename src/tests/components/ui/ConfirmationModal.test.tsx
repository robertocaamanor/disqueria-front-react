import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';

describe('ConfirmationModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onConfirm: vi.fn(),
        title: 'Confirm Action',
        message: 'Are you sure?',
    };

    it('does not render when not open', () => {
        render(<ConfirmationModal {...defaultProps} isOpen={false} />);
        expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
    });

    it('renders title and message when open', () => {
        render(<ConfirmationModal {...defaultProps} />);
        expect(screen.getByText('Confirm Action')).toBeInTheDocument();
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    });

    it('calls onClose when cancel is clicked', () => {
        render(<ConfirmationModal {...defaultProps} />);
        fireEvent.click(screen.getByText('Cancel'));
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('calls onConfirm when confirm is clicked', () => {
        render(<ConfirmationModal {...defaultProps} />);
        fireEvent.click(screen.getByText('Confirm'));
        expect(defaultProps.onConfirm).toHaveBeenCalled();
    });

    it('shows loading state', () => {
        render(<ConfirmationModal {...defaultProps} isLoading={true} />);
        expect(screen.getByText('Processing...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Processing.../i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeDisabled();
    });

    it('can trigger close via close icon', () => {
        render(<ConfirmationModal {...defaultProps} />);
        // Finding the close button (top right X)
        // Usually buttons having icons without text should have aria-label, but checking the code, it doesn't.
        // It's the first button in the structure or we can find by svg class if needed, or add aria-label in source.
        const buttons = screen.getAllByRole('button'); // 3 buttons: X, Cancel, Confirm
        fireEvent.click(buttons[0]);
        expect(defaultProps.onClose).toHaveBeenCalled();
    });
});
