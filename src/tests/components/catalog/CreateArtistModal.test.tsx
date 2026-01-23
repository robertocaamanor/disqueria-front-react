import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateArtistModal } from '../../../components/catalog/CreateArtistModal';
import { createArtist } from '../../../api/catalog';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';

// Mocks
vi.mock('../../../api/catalog');
vi.mock('react-i18next');
vi.mock('../../../context/ToastContext');

describe('CreateArtistModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onSuccess: vi.fn(),
    };

    const showToastMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useTranslation as any).mockReturnValue({ t: (key: string) => key });
        (useToast as any).mockReturnValue({ showToast: showToastMock });
    });

    it('does not render when closed', () => {
        render(<CreateArtistModal {...defaultProps} isOpen={false} />);
        expect(screen.queryByText('modals.addArtistTitle')).not.toBeInTheDocument();
    });

    it('renders form elements', () => {
        render(<CreateArtistModal {...defaultProps} />);
        expect(screen.getByText('modals.addArtistTitle')).toBeInTheDocument();
        expect(screen.getByText('modals.artistName')).toBeInTheDocument(); // Input label is using t()
        expect(screen.getByText('common.country')).toBeInTheDocument();
    });

    it('calls createArtist and onSuccess on valid submission', async () => {
        (createArtist as any).mockResolvedValue({});

        render(<CreateArtistModal {...defaultProps} />);

        fireEvent.change(screen.getByPlaceholderText('e.g. The Beatles'), { target: { value: 'New Artist' } });
        fireEvent.change(screen.getByPlaceholderText('e.g. UK'), { target: { value: 'US' } });

        fireEvent.click(screen.getByText('modals.createArtist'));

        await waitFor(() => {
            expect(createArtist).toHaveBeenCalledWith({ name: 'New Artist', country: 'US' });
            expect(showToastMock).toHaveBeenCalledWith('modals.artistCreated', 'success');
            expect(defaultProps.onSuccess).toHaveBeenCalled();
            expect(defaultProps.onClose).toHaveBeenCalled();
        });
    });

    it('handles API error', async () => {
        (createArtist as any).mockRejectedValue(new Error('Failed'));

        render(<CreateArtistModal {...defaultProps} />);

        fireEvent.change(screen.getByPlaceholderText('e.g. The Beatles'), { target: { value: 'New Artist' } });
        fireEvent.click(screen.getByText('modals.createArtist'));

        await waitFor(() => {
            expect(createArtist).toHaveBeenCalled();
            expect(showToastMock).toHaveBeenCalledWith('common.error', 'error');
            expect(defaultProps.onSuccess).not.toHaveBeenCalled();
        });
    });
});

