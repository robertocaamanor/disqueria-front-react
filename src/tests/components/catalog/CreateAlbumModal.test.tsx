import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateAlbumModal } from '../../../components/catalog/CreateAlbumModal';
import { createAlbum } from '../../../api/catalog';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';

// Mocks
vi.mock('../../../api/catalog');
vi.mock('react-i18next');
vi.mock('../../../context/ToastContext');

describe('CreateAlbumModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onSuccess: vi.fn(),
        artists: [{ id: 1, name: 'Artist 1' }, { id: 2, name: 'Artist 2' }],
        preSelectedArtistId: null,
    };

    const showToastMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useTranslation as any).mockReturnValue({ t: (key: string) => key });
        (useToast as any).mockReturnValue({ showToast: showToastMock });
    });

    it('does not render when closed', () => {
        render(<CreateAlbumModal {...defaultProps} isOpen={false} />);
        expect(screen.queryByText('modals.addAlbumTitle')).not.toBeInTheDocument();
    });

    it('renders form elements', () => {
        render(<CreateAlbumModal {...defaultProps} />);
        expect(screen.getByText('modals.addAlbumTitle')).toBeInTheDocument();
        expect(screen.getByText('modals.artist')).toBeInTheDocument();
        expect(screen.getByText('modals.albumTitle')).toBeInTheDocument();
    });

    it('allows valid submission', async () => {
        (createAlbum as any).mockResolvedValue({});

        render(<CreateAlbumModal {...defaultProps} />);

        // Select artist
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });

        // Fill other fields using inputs finding logic
        // We know placeholders: 'e.g. Abbey Road', '1969', '0.00', 'e.g. Rock'
        fireEvent.change(screen.getByPlaceholderText('e.g. Abbey Road'), { target: { value: 'New Album' } });
        fireEvent.change(screen.getByPlaceholderText('1969'), { target: { value: '2022' } });
        fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '10' } });
        fireEvent.change(screen.getByPlaceholderText('e.g. Rock'), { target: { value: 'Rock' } });

        fireEvent.click(screen.getByText('common.create'));

        await waitFor(() => {
            expect(createAlbum).toHaveBeenCalledWith({
                title: 'New Album',
                year: 2022,
                genre: 'Rock',
                price: 10,
                artistId: 1
            });
            expect(showToastMock).toHaveBeenCalledWith('modals.albumCreated', 'success');
            expect(defaultProps.onSuccess).toHaveBeenCalled();
            expect(defaultProps.onClose).toHaveBeenCalled();
        });
    });

    it('pre-selects artist if preSelectedArtistId is provided', () => {
        render(<CreateAlbumModal {...defaultProps} preSelectedArtistId={2} />);
        const select = screen.getByRole('combobox') as HTMLSelectElement;
        expect(select.value).toBe('2');
        expect(select).toBeDisabled();
    });

    it('validates numeric fields', async () => {
        render(<CreateAlbumModal {...defaultProps} />);

        // Fill valid text but invalid numbers
        fireEvent.change(screen.getByPlaceholderText('e.g. Abbey Road'), { target: { value: 'New Album' } });
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
        fireEvent.change(screen.getByPlaceholderText('1969'), { target: { value: '-2022' } });
        fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '10' } });
        fireEvent.change(screen.getByPlaceholderText('e.g. Rock'), { target: { value: 'Rock' } });

        const submitBtn = screen.getByText('common.create');
        const form = submitBtn.closest('form');
        if (form) fireEvent.submit(form);

        await waitFor(() => {
            expect(createAlbum).not.toHaveBeenCalled();
            expect(showToastMock).toHaveBeenCalledWith('modals.positiveValues', 'error');
        });
    });
});
