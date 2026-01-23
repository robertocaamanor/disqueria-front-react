import { useEffect, useState } from 'react';
import { getArtists, getAlbums, deleteArtist, deleteAlbum } from '../api/catalog';
import { createOrder } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { CreateArtistModal } from '../components/catalog/CreateArtistModal';
import { CreateAlbumModal } from '../components/catalog/CreateAlbumModal';
import { EditArtistModal } from '../components/catalog/EditArtistModal';
import { EditAlbumModal } from '../components/catalog/EditAlbumModal';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { useTranslation } from 'react-i18next';
import { Plus, Music, Disc, Loader2, ShoppingCart, Search, X, Pencil, Trash2 } from 'lucide-react';

export const CatalogPage = () => {
    const { t } = useTranslation();
    const [artists, setArtists] = useState<any[]>([]);
    const [albums, setAlbums] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const [editingArtist, setEditingArtist] = useState<any | null>(null);
    const [editingAlbum, setEditingAlbum] = useState<any | null>(null);
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
            // Ordenar por ID ascendente
            setArtists(artistsData.sort((a: any, b: any) => a.id - b.id));
            setAlbums(albumsData.sort((a: any, b: any) => a.id - b.id));
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
    const [isDeleteArtistModalOpen, setIsDeleteArtistModalOpen] = useState(false);
    const [artistToDelete, setArtistToDelete] = useState<any>(null);
    const [isDeleteAlbumModalOpen, setIsDeleteAlbumModalOpen] = useState(false);
    const [albumToDelete, setAlbumToDelete] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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
            fetchData();
        } catch (error) {
            console.error(error);
            showToast(t('modals.orderFailed'), 'error');
        } finally {
            setIsBuying(false);
        }
    };

    const handleDeleteArtist = (artist: any) => {
        // Contar cuántos álbumes tiene el artista
        const artistAlbums = albums.filter(a => a.artist?.id === artist.id);
        setArtistToDelete({ ...artist, albumCount: artistAlbums.length });
        setIsDeleteArtistModalOpen(true);
    };

    const confirmDeleteArtist = async () => {
        if (!artistToDelete) return;

        setIsDeleting(true);
        try {
            await deleteArtist(artistToDelete.id);
            showToast(t('modals.artistDeleted'), 'success');
            setIsDeleteArtistModalOpen(false);
            setArtistToDelete(null);
            fetchData();
        } catch (error) {
            console.error(error);
            showToast(t('common.error'), 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteAlbum = (album: any) => {
        setAlbumToDelete(album);
        setIsDeleteAlbumModalOpen(true);
    };

    const confirmDeleteAlbum = async () => {
        if (!albumToDelete) return;

        setIsDeleting(true);
        try {
            await deleteAlbum(albumToDelete.id);
            showToast(t('modals.albumDeleted'), 'success');
            setIsDeleteAlbumModalOpen(false);
            setAlbumToDelete(null);
            fetchData();
        } catch (error) {
            console.error(error);
            showToast(t('common.error'), 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const getStockBadge = (stock: number) => {
        if (stock === 0) {
            return <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">{t('catalog.outOfStock')}</span>;
        } else if (stock < 10) {
            return <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">{stock} {t('catalog.inStock')}</span>;
        } else {
            return <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">{stock} {t('catalog.inStock')}</span>;
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
                        const artistAlbums = albums
                            .filter(a => a.artist?.id === artist.id)
                            .sort((a, b) => a.id - b.id);
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
                                                        className={`flex items-start gap-3 p-3 rounded-lg transition-all ${isHighlighted
                                                            ? 'bg-primary-500/10 border border-primary-500/30 hover:bg-primary-500/20'
                                                            : 'bg-black/20 hover:bg-black/40'
                                                            }`}
                                                    >
                                                        <div className="flex-shrink-0">
                                                            {album.coverImage ? (
                                                                <img 
                                                                    src={`http://localhost:3005/${album.coverImage}`} 
                                                                    alt={album.title}
                                                                    className="w-16 h-16 rounded object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-16 h-16 rounded bg-slate-800 flex items-center justify-center text-gray-500">
                                                                    <Disc className="w-10 h-10" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`font-medium truncate ${isHighlighted ? 'text-primary-300' : 'text-white'
                                                                }`}>{album.title}</p>
                                                            <p className="text-xs text-gray-400">{album.year} • {album.genre}</p>
                                                            <div className="mt-1">
                                                                {getStockBadge(album.stock)}
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                                            <span className="font-bold text-primary-400">${album.price}</span>
                                                            <div className="flex items-center gap-1">
                                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-blue-400" onClick={() => setEditingAlbum(album)} title={t('common.edit')}>
                                                                    <Pencil className="w-5 h-5" />
                                                                </Button>
                                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-red-400" onClick={() => handleDeleteAlbum(album)} title={t('common.delete')}>
                                                                    <Trash2 className="w-5 h-5" />
                                                                </Button>
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="ghost" 
                                                                    className="h-8 w-8 p-0 text-gray-400 hover:text-green-400" 
                                                                    onClick={() => handleBuyAlbum(album)} 
                                                                    title={t('catalog.buyNow')}
                                                                    disabled={album.stock === 0}
                                                                >
                                                                    <ShoppingCart className="w-5 h-5" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    
                                    {/* Botones de editar y eliminar artista */}
                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-xs text-gray-400 hover:text-blue-400"
                                            onClick={() => setEditingArtist(artist)}
                                        >
                                            <Pencil className="w-3 h-3 mr-1" />
                                            {t('common.edit')}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-xs text-gray-400 hover:text-red-400"
                                            onClick={() => handleDeleteArtist(artist)}
                                        >
                                            <Trash2 className="w-3 h-3 mr-1" />
                                            {t('common.delete')}
                                        </Button>
                                    </div>
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

            <EditArtistModal
                isOpen={!!editingArtist}
                onClose={() => setEditingArtist(null)}
                onSuccess={fetchData}
                artist={editingArtist}
            />

            <EditAlbumModal
                isOpen={!!editingAlbum}
                onClose={() => setEditingAlbum(null)}
                onSuccess={fetchData}
                album={editingAlbum}
                artists={artists}
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

            <ConfirmationModal
                isOpen={isDeleteArtistModalOpen}
                onClose={() => setIsDeleteArtistModalOpen(false)}
                onConfirm={confirmDeleteArtist}
                title={t('modals.confirmDeleteArtistTitle')}
                message={artistToDelete ? t('modals.confirmDeleteArtistMessage', { name: artistToDelete.name }) : ''}
                confirmText={t('common.delete')}
                cancelText={t('common.cancel')}
                isLoading={isDeleting}
                variant="danger"
                warningMessage={artistToDelete?.albumCount > 0 ? t('modals.cascadeDeleteWarning', { count: artistToDelete.albumCount }) : undefined}
            />

            <ConfirmationModal
                isOpen={isDeleteAlbumModalOpen}
                onClose={() => setIsDeleteAlbumModalOpen(false)}
                onConfirm={confirmDeleteAlbum}
                title={t('modals.confirmDeleteAlbumTitle')}
                message={albumToDelete ? t('modals.confirmDeleteAlbumMessage', { title: albumToDelete.title }) : ''}
                confirmText={t('common.delete')}
                cancelText={t('common.cancel')}
                isLoading={isDeleting}
                variant="danger"
            />
        </div>
    );
};
