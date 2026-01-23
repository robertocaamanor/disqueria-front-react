import { useEffect, useState } from 'react';
import { getArtists, getAlbums } from '../api/catalog';
import { createOrder } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { CreateArtistModal } from '../components/catalog/CreateArtistModal';
import { CreateAlbumModal } from '../components/catalog/CreateAlbumModal';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { useTranslation } from 'react-i18next';
import { Plus, Music, Disc, Loader2, ShoppingCart, Search, X } from 'lucide-react';

export const CatalogPage = () => {
    const { t } = useTranslation();
    const [artists, setArtists] = useState<any[]>([]);
    const [albums, setAlbums] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);
    const { user } = useAuth();
    const { showToast } = useToast();

    const openAddAlbumModal = (artistId?: number) => {
        setSelectedArtistId(artistId || null);
        setIsAlbumModalOpen(true);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [artistsData, albumsData] = await Promise.all([
                getArtists(),
                getAlbums()
            ]);
            setArtists(artistsData);
            setAlbums(albumsData);
        } catch (error) {
            console.error('Error fetching catalog:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filtrar artistas y álbumes según el término de búsqueda
    const filteredArtists = artists.filter(artist => {
        const matchesArtist = artist.name.toLowerCase().includes(searchTerm.toLowerCase());
        const artistAlbums = albums.filter(a => a.artist?.id === artist.id);
        const hasMatchingAlbum = artistAlbums.some(album => 
            album.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return matchesArtist || hasMatchingAlbum;
    });

    // ... rest of component
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [selectedAlbumToBuy, setSelectedAlbumToBuy] = useState<any>(null);
    const [isBuying, setIsBuying] = useState(false);

    const handleBuyAlbum = (album: any) => {
        setSelectedAlbumToBuy(album);
        setIsBuyModalOpen(true);
    };

    const confirmPurchase = async () => {
        if (!selectedAlbumToBuy) return;

        const userId = user?.id || user?.sub;

        if (!userId) {
            showToast(t('modals.userIdNotFound'), 'error');
            setIsBuyModalOpen(false);
            return;
        }

        setIsBuying(true);
        try {
            await createOrder({
                userId,
                items: [{ albumId: selectedAlbumToBuy.id, quantity: 1, price: selectedAlbumToBuy.price }]
            });
            showToast(t('modals.orderPlaced'), 'success');
            setIsBuyModalOpen(false);
            setSelectedAlbumToBuy(null);
        } catch (error) {
            console.error(error);
            showToast(t('modals.orderFailed'), 'error');
        } finally {
            setIsBuying(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{t('catalog.title')}</h1>
                    <p className="text-gray-400">{t('catalog.subtitle')}</p>
                </div>

                <div className="flex gap-3">
                    <Button onClick={() => setIsArtistModalOpen(true)} size="sm">
                        <Plus className="w-4 h-4 mr-2" /> {t('catalog.addArtist')}
                    </Button>
                    <Button onClick={() => openAddAlbumModal()} size="sm">
                        <Plus className="w-4 h-4 mr-2" /> {t('catalog.addAlbum')}
                    </Button>
                </div>
            </div>

            {/* Buscador */}
            <div className="relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('catalog.searchPlaceholder')}
                        className="w-full pl-10 pr-10 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                {searchTerm && (
                    <p className="mt-2 text-sm text-gray-400">
                        {t('catalog.searchResults', { count: filteredArtists.length })}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArtists.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">{t('catalog.noResults')}</p>
                    </div>
                ) : (
                    filteredArtists.map((artist) => {
                        const artistAlbums = albums.filter(a => a.artist?.id === artist.id);
                        const matchesSearchTerm = (text: string) => text.toLowerCase().includes(searchTerm.toLowerCase());

                    return (
                        <div key={artist.id} className="bg-slate-900/50 border border-white/5 rounded-xl overflow-hidden hover:border-primary-500/30 transition-all hover:bg-slate-900/80 group">
                            <div className="p-4 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Music className="w-4 h-4 text-primary-500" />
                                        {artist.name}
                                    </h3>
                                    {artist.country && (
                                        <span className="text-[10px] font-medium text-gray-500 bg-white/5 px-1.5 py-0.5 rounded-full">{artist.country}</span>
                                    )}
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => openAddAlbumModal(artist.id)}
                                >
                                    <Plus className="w-3 h-3 mr-1" /> {t('catalog.addAlbum')}
                                </Button>
                            </div>

                            <div className="p-6 space-y-4">
                                {artistAlbums.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">{t('catalog.noAlbums')}</p>
                                ) : (
                                    <div className="space-y-3">
                                        {artistAlbums.map((album) => {
                                            const isHighlighted = searchTerm && matchesSearchTerm(album.title);
                                            return (
                                                <div 
                                                    key={album.id} 
                                                    className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                                                        isHighlighted 
                                                            ? 'bg-primary-500/10 border border-primary-500/30 hover:bg-primary-500/20' 
                                                            : 'bg-black/20 hover:bg-black/40'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-gray-500">
                                                            <Disc className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className={`font-medium ${
                                                                isHighlighted ? 'text-primary-300' : 'text-white'
                                                            }`}>{album.title}</p>
                                                            <p className="text-xs text-gray-400">{album.year} • {album.genre}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-primary-400">${album.price}</span>
                                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white" onClick={() => handleBuyAlbum(album)} title={t('catalog.buyNow')}>
                                                            <ShoppingCart className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                    })
                )}
            </div>

            <CreateArtistModal
                isOpen={isArtistModalOpen}
                onClose={() => setIsArtistModalOpen(false)}
                onSuccess={fetchData}
            />

            <CreateAlbumModal
                isOpen={isAlbumModalOpen}
                onClose={() => setIsAlbumModalOpen(false)}
                onSuccess={fetchData}
                artists={artists}
                preSelectedArtistId={selectedArtistId}
            />

            <ConfirmationModal
                isOpen={isBuyModalOpen}
                onClose={() => setIsBuyModalOpen(false)}
                onConfirm={confirmPurchase}
                title={t('modals.confirmPurchaseTitle')}
                message={selectedAlbumToBuy ? t('modals.confirmPurchaseMessage', { title: selectedAlbumToBuy.title, price: selectedAlbumToBuy.price }) : ''}
                confirmText={t('modals.confirmButton')}
                cancelText={t('common.cancel')}
                isLoading={isBuying}
            />
        </div>
    );
};
