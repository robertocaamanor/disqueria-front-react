import React, { useState, useEffect } from 'react';
import { createAlbum } from '../../api/catalog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';

interface CreateAlbumModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    artists: any[];
    preSelectedArtistId?: number | null;
}

export const CreateAlbumModal: React.FC<CreateAlbumModalProps> = ({ isOpen, onClose, onSuccess, artists, preSelectedArtistId }) => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [genre, setGenre] = useState('');
    const [price, setPrice] = useState('');
    const [artistId, setArtistId] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (preSelectedArtistId) {
            setArtistId(preSelectedArtistId.toString());
        } else {
            setArtistId('');
        }
    }, [preSelectedArtistId, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !genre.trim() || !artistId) {
            showToast(t('modals.fillAllFields'), 'error');
            return;
        }

        const yearNum = parseInt(year);
        const priceNum = parseFloat(price);

        if (yearNum <= 0 || priceNum < 0) {
            showToast(t('modals.positiveValues'), 'error');
            return;
        }

        setLoading(true);
        try {
            await createAlbum({
                title: title.trim(),
                year: yearNum,
                genre: genre.trim(),
                price: priceNum,
                artistId: parseInt(artistId)
            });
            showToast(t('modals.albumCreated'), 'success');
            onSuccess();
            onClose();
            // Reset form
            setTitle('');
            setYear('');
            setGenre('');
            setPrice('');
            setArtistId('');
        } catch (error) {
            console.error('Failed to create album', error);
            showToast(t('common.error'), 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-xl p-6 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-4 text-white">{t('modals.addAlbumTitle')}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">{t('modals.artist')}</label>
                        <select
                            className="w-full h-10 rounded-md border border-gray-700 bg-gray-800 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            value={artistId}
                            onChange={(e) => setArtistId(e.target.value)}
                            required
                            disabled={!!preSelectedArtistId}
                        >
                            <option value="">{t('modals.selectArtist')}</option>
                            {artists.map((artist) => (
                                <option key={artist.id} value={artist.id}>{artist.name}</option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label={t('modals.albumTitle')}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="e.g. Abbey Road"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label={t('common.year')}
                            type="number"
                            min="1900"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            required
                            placeholder="1969"
                        />
                        <Input
                            label={t('common.price')}
                            type="number"
                            step="0.01"
                            min="0.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            placeholder="0.00"
                        />
                    </div>

                    <Input
                        label={t('common.genre')}
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        required
                        placeholder="e.g. Rock"
                    />

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="ghost" onClick={onClose}>{t('common.cancel')}</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? t('modals.creating') : t('common.create')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
