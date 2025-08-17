import { t } from "i18next";
import type { ApiResponse } from "../../types";
import { getNotificationStore } from "../notifications/useNotification";
import { eraseCookie, getCookie, setCookie } from "../../utils/Cookies";
import { useAuthContext } from "../../context/AuthContext";

export const useLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { setIsAuthenticated } = useAuthContext();

    async function login(email: string, password: string) {
        try {
            const response = await fetch(`${apiUrl}/Auth/Authenticate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "login": email, password })
            });

            const data: ApiResponse = await response.json();

            if (data.erro || !data.objeto?.token || !data.objeto) {
                getNotificationStore().showError(t(data.mensagem) || t('login.error'));
                throw new Error(t(data.mensagem) || t('login.error'));
            }
            // Adicionar após setCookie('authToken', data.objeto.token);

            console.log('Token salvo no cookie');
            console.log('Verificando cookie imediatamente:', getCookie('authToken') ? 'OK' : 'FALHOU');


            setCookie('authToken', data.objeto.token);
            getNotificationStore().showNotification(t(data.mensagem) || 'Login realizado com sucesso', 'success');
            setIsAuthenticated(true);
            return data.objeto;

        } catch (error) {
            console.error('Login error:', error);
            if (error instanceof Error) {
                getNotificationStore().showError(t(error.message));
            }

            throw error;
        }
    }

    function logout() {
        eraseCookie('authToken');
        getNotificationStore().showNotification(t('logout_message'), "info");
        setIsAuthenticated(false);
    }

    async function resetPassword(email: string) {
        try {
            const response = await fetch(`${apiUrl}/User/RequestPasswordRecovery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data: ApiResponse = await response.json();

            if (data.erro) {
                getNotificationStore().showError(t(data.mensagem) || t('login.resetError'));
                throw new Error(t(data.mensagem) || t('login.resetError'));
            }

            getNotificationStore().showNotification(t(data.mensagem) || 'Login realizado com sucesso', 'success');
            return data.objeto;


        } catch (error) {
            console.error('Login error:', error);
            if (error instanceof Error) {
                getNotificationStore().showError(t(error.message));
            }

            throw error;
        }

    }

    return {
        login,
        logout,
        resetPassword
    }
}