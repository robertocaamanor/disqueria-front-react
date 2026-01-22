import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { LanguageSwitcher } from './ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { Disc3, LogOut, User } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-white font-sans">
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-500 hover:text-primary-400 transition-colors">
                        <Disc3 className="w-8 h-8" />
                        <span>{t('nav.appName')}</span>
                    </Link>

                    <nav className="flex items-center gap-6">
                        {isAuthenticated ? (
                            <>
                                <Link to="/catalog" className={`text-sm font-medium hover:text-white transition-colors ${location.pathname.startsWith('/catalog') ? 'text-white' : 'text-gray-400'}`}>
                                    {t('nav.catalog')}
                                </Link>
                                <Link to="/orders" className={`text-sm font-medium hover:text-white transition-colors ${location.pathname.startsWith('/orders') ? 'text-white' : 'text-gray-400'}`}>
                                    {t('nav.orders')}
                                </Link>
                                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
                                    <span className="text-sm text-gray-400 flex items-center gap-2">
                                        <User className="w-4 h-4" /> {user?.name || 'User'}
                                    </span>
                                    <LanguageSwitcher />
                                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                                        <LogOut className="w-4 h-4 mr-2" /> {t('auth.logout')}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <LanguageSwitcher />
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">{t('auth.signIn')}</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="primary" size="sm">{t('auth.signUp')}</Button>
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>

            <footer className="border-t border-white/10 py-6 bg-slate-950">
                <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} {t('nav.appName')}. Best Music Store.
                </div>
            </footer>
        </div>
    );
};
