import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePasswordRecovery } from './usePasswordRecovery';

const ValidateRecoveryToken: React.FC = () => {
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') || '';
    const { validateToken } = usePasswordRecovery();
    const navigate = useNavigate();

    useEffect(() => {
        if (!email) {
            navigate('/request-password-recovery');
        }
    }, [email, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!token.trim()) {
            return;
        }

        setLoading(true);
        try {
            await validateToken(email, token);
            navigate(`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
        } catch (error) {
            console.error('Token validation error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Validar Token
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Digite o código enviado para <strong>{email}</strong>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="token" className="sr-only">
                            Token
                        </label>
                        <input
                            id="token"
                            name="token"
                            type="text"
                            required
                            value={token}
                            onChange={(e) => setToken(e.target.value.toUpperCase())}
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 text-center text-xl font-bold letter-spacing-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                            placeholder="DIGITE O TOKEN"
                            maxLength={6}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? 'Validando...' : 'Validar Token'}
                        </button>
                    </div>

                    <div className="text-center space-y-2">
                        <button
                            type="button"
                            onClick={() => navigate('/request-password-recovery')}
                            className="text-indigo-600 hover:text-indigo-500"
                        >
                            Solicitar novo código
                        </button>
                        <br />
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-gray-600 hover:text-gray-500"
                        >
                            Voltar ao Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ValidateRecoveryToken;