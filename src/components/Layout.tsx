import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { LanguageSwitcher } from './ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { Disc3, LogOut, User, Menu, X } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Close menu when route changes
    React.useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-white font-sans">
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-500 hover:text-primary-400 transition-colors">
                        <Disc3 className="w-8 h-8" />
                        <span>{t('nav.appName')}</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
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

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
                        <nav className="flex flex-col p-4 space-y-4">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-3 pb-4 border-b border-white/10 text-gray-400">
                                        <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-white">{user?.name || 'User'}</span>
                                            <span className="text-xs">{user?.email}</span>
                                        </div>
                                    </div>

                                    <Link to="/catalog" className={`flex items-center py-2 text-base font-medium transition-colors ${location.pathname.startsWith('/catalog') ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                                        {t('nav.catalog')}
                                    </Link>
                                    <Link to="/orders" className={`flex items-center py-2 text-base font-medium transition-colors ${location.pathname.startsWith('/orders') ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                                        {t('nav.orders')}
                                    </Link>

                                    <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
                                        {/* Language Switcher in Mobile */}
                                        <div className="flex items-center justify-between text-sm text-gray-400">
                                            <span>Language</span>
                                            <LanguageSwitcher />
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={handleLogout} className="justify-start px-0 text-red-400 hover:text-red-300 hover:bg-transparent">
                                            <LogOut className="w-4 h-4 mr-2" /> {t('auth.logout')}
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between text-sm text-gray-400 pb-2">
                                        <span>Language</span>
                                        <LanguageSwitcher />
                                    </div>
                                    <Link to="/login" className="w-full">
                                        <Button variant="ghost" className="w-full justify-center">{t('auth.signIn')}</Button>
                                    </Link>
                                    <Link to="/register" className="w-full">
                                        <Button variant="primary" className="w-full justify-center">{t('auth.signUp')}</Button>
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>

            <footer className="border-t border-white/10 py-6 bg-slate-950">
                <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} {t('nav.appName')}. Best Music Store.
                </div>
            </footer>
        </div >
    );
};
