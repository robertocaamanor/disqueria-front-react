import React, { useState, useEffect } from 'react';
import { updateAlbum } from '../../api/catalog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';

interface EditAlbumModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    album: any | null; // using any for simplicity, effectively defines the shape below
    artists: any[];
}

export const EditAlbumModal: React.FC<EditAlbumModalProps> = ({ isOpen, onClose, onSuccess, album, artists }) => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [genre, setGenre] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('0');
    const [artistId, setArtistId] = useState('');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && album) {
            setTitle(album.title);
            setYear(album.year.toString());
            setGenre(album.genre);
            setPrice(album.price.toString());
            setStock(album.stock ? album.stock.toString() : '0');
            setArtistId(album.artist?.id?.toString() || album.artistId?.toString() || '');
            setCoverImage(null); // Reset file input
        }
    }, [isOpen, album]);

    if (!isOpen || !album) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !genre.trim() || !artistId) {
            showToast(t('modals.fillAllFields'), 'error');
            return;
        }

        const yearNum = parseInt(year);
        const priceNum = parseFloat(price);
        const stockNum = parseInt(stock);

        if (yearNum <= 0 || priceNum < 0 || stockNum < 0) {
            showToast(t('modals.positiveValues'), 'error');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('year', yearNum.toString());
            formData.append('genre', genre.trim());
            formData.append('price', priceNum.toString());
            formData.append('stock', stockNum.toString());
            // Only append artistId if it changed or needs to be sent? Usually API expects it.
            formData.append('artistId', artistId);

            if (coverImage) {
                formData.append('coverImage', coverImage);
            }

            await updateAlbum(album.id, formData);

            showToast(t('modals.albumUpdated'), 'success'); // Key needs adding
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to update album', error);
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

                <h2 className="text-xl font-bold mb-4 text-white">{t('modals.editAlbumTitle')}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">{t('modals.artist')}</label>
                        <select
                            className="w-full h-10 rounded-md border border-gray-700 bg-gray-800 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={artistId}
                            onChange={(e) => setArtistId(e.target.value)}
                            required
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
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label={t('common.year')}
                            type="number"
                            min="1900"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            required
                        />
                        <Input
                            label={t('common.price')}
                            type="number"
                            step="0.01"
                            min="0.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>

                    <Input
                        label={t('common.genre')}
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        required
                    />

                    <Input
                        label={t('common.stock')}
                        type="number"
                        min="0"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">{t('common.coverImage')}</label>
                        {album && album.coverImage && (
                            <div className="mb-2">
                                <span className="text-xs text-gray-500 block mb-1">Current: {album.coverImage}</span>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCoverImage(e.target.files ? e.target.files[0] : null)}
                            className="block w-full text-sm text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-primary-600 file:text-white
                            hover:file:bg-primary-700
                            "
                        />
                        <span className="text-xs text-gray-500 mt-1 block">{t('modals.leaveEmptyToKeep')}</span>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="ghost" onClick={onClose}>{t('common.cancel')}</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? t('modals.saving') : t('common.save')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
