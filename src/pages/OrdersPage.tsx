import { useEffect, useState } from 'react';
import { getUserOrders } from '../api/orders';
import { getAlbums } from '../api/catalog';
import { useAuth } from '../context/AuthContext';
import { Loader2, Package, Calendar, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';

export const OrdersPage = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState<any[]>([]);
    const [albums, setAlbums] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            // If user is not logged in / missing ID, we should stop loading. 
            // ProtectedRoute handles redirect, but we might be in a transient state.
            if (!user?.id && !user?.sub) {
                setLoading(false);
                return;
            }
            const userId = user.id || user.sub;

            try {
                const [ordersData, albumsData] = await Promise.all([
                    getUserOrders(userId),
                    getAlbums()
                ]);
                setOrders(ordersData);
                setAlbums(albumsData);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const getAlbumDetails = (albumId: number) => {
        return albums.find(a => a.id === albumId);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white mb-6">{t('orders.title')}</h1>

            {orders.length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-white/5 bg-slate-900/50 flex flex-col items-center">
                    <Package className="w-12 h-12 text-gray-600 mb-4" />
                    <p className="text-gray-400 mb-6">{t('orders.noOrders')}</p>
                    <Link to="/catalog">
                        <Button variant="primary">
                            {t('orders.browseCatalog')}
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-slate-900/50 border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors">
                            <div className="flex flex-col md:flex-row justify-between mb-4 border-b border-white/5 pb-4">
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <span className="flex items-center gap-2">
                                        <Package className="w-4 h-4" /> {t('orders.orderNumber')}{order.id}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="mt-2 md:mt-0 font-bold text-xl text-primary-400 flex items-center gap-1">
                                    <DollarSign className="w-5 h-5" /> {order.totalAmount || order.total || '0.00'}
                                </div>
                            </div>

                            <div className="space-y-2">
                                {order.items?.map((item: any, idx: number) => {
                                    const album = getAlbumDetails(item.albumId);
                                    return (
                                        <div key={idx} className="flex justify-between items-center text-sm py-2 px-3 rounded bg-black/20">
                                            <span className="text-white font-medium">
                                                {album ? album.title : `Album #${item.albumId}`}
                                                <span className="text-gray-500 ml-2">x{item.quantity}</span>
                                            </span>
                                            <span className="text-gray-400">${item.price}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
