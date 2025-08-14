// src/contexts/I18nProviderWrapper.tsx
import React, { useState, useEffect, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { ensureI18nReady } from '../translations';

interface I18nProviderWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const I18nProviderWrapper: React.FC<I18nProviderWrapperProps> = ({ 
  children, 
  fallback = <div>Carregando traduções...</div> 
}) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeI18n = async () => {
      try {
        await ensureI18nReady();
        setIsReady(true);
      } catch (err) {
        console.error('Erro ao inicializar i18n:', err);
        setError('Erro ao carregar traduções');
        // Mesmo com erro, permite que a aplicação continue
        setIsReady(true);
      }
    };

    initializeI18n();
  }, []);

  if (!isReady) {
    return <>{fallback}</>;
  }

  if (error) {
    console.warn('I18n inicializado com erros:', error);
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
};