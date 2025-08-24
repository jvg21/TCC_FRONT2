import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePasswordRecovery } from './usePasswordRecovery';

const RequestPasswordRecovery: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { requestPasswordRecovery } = usePasswordRecovery();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email.trim()) {
            return;
        }

        setLoading(true);
        try {
            await requestPasswordRecovery(email);
            navigate(`/validate-recovery-token?email=${encodeURIComponent(email)}`);
        } catch (error) {
            console.error('Request recovery error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Recuperação de Senha
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Digite seu e-mail para receber as instruções de recuperação
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="sr-only">
                            E-mail
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Digite seu e-mail"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? 'Enviando...' : 'Enviar E-mail de Recuperação'}
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-indigo-600 hover:text-indigo-500"
                        >
                            Voltar ao Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestPasswordRecovery;