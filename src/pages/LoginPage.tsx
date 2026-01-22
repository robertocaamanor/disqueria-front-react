import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';

export const LoginPage = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await loginApi(email, password);
            // Decode JWT to get user ID (sub)
            const base64Url = data.access_token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);
            const userWithId = {
                ...data.user,
                id: payload.sub,
                email: payload.username || email, // access_token usually has username
                name: data.user?.name || email.split('@')[0]
            };

            login(data.access_token, userWithId);
            navigate('/catalog');
        } catch (err: any) {
            setError(err.response?.data?.message || t('auth.invalidCredentials'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md p-8 bg-slate-900/50 border border-white/10 rounded-2xl shadow-xl backdrop-blur-sm">
                <h1 className="text-3xl font-bold text-center mb-8 text-white">{t('auth.loginTitle')}</h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-500">
                        <AlertCircle className="w-5 h-5" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label={t('auth.email')}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                    />
                    <Input
                        label={t('auth.password')}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? t('auth.signingIn') : t('auth.signIn')}
                    </Button>

                    <p className="text-center text-sm text-gray-400">
                        {t('auth.noAccount')}{' '}
                        <Link to="/register" className="text-primary-500 hover:text-primary-400 font-medium">
                            {t('auth.signUp')}
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
