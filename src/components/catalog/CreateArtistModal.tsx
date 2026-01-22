import React, { useState } from 'react';
import { createArtist } from '../../api/catalog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../context/ToastContext';

interface CreateArtistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateArtistModal: React.FC<CreateArtistModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createArtist({ name, country });
            showToast(t('modals.artistCreated'), 'success');
            onSuccess();
            onClose();
            setName('');
            setCountry('');
        } catch (error) {
            console.error('Failed to create artist', error);
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

                <h2 className="text-xl font-bold mb-4 text-white">{t('modals.addArtistTitle')}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label={t('modals.artistName')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="e.g. The Beatles"
                    />
                    <Input
                        label={t('common.country')}
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="e.g. UK"
                    />

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="ghost" onClick={onClose}>{t('common.cancel')}</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? t('modals.creating') : t('modals.createArtist')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
