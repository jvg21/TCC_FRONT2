import type { ApiResponse } from "../../types";
import { notificationActions } from "../notifications/useNotification";
import { eraseCookie,  setCookie } from "../../utils/Cookies";
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
                notificationActions.showError(data.mensagem || 'Erro no login');
                throw new Error(data.mensagem || 'Erro no login');
            }

            // console.log('Token salvo no cookie');
            // console.log('Verificando cookie imediatamente:', getCookie('authToken') ? 'OK' : 'FALHOU');
            setCookie('authToken', data.objeto.token);
            notificationActions.showNotification(data.mensagem || 'Login realizado com sucesso!', 'success');
            setIsAuthenticated(true);
            return data.objeto;

        } catch (error) {
            console.error('Login error:', error);
            if (error instanceof Error) {
                notificationActions.showError(error.message);
            }
            throw error;
        }
    }

    function logout() {
        eraseCookie('authToken');
        notificationActions.showNotification('Logout realizado com sucesso', "info");
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
                notificationActions.showError(data.mensagem || 'Erro ao solicitar recuperação');
                throw new Error(data.mensagem || 'Erro ao solicitar recuperação');
            }

            notificationActions.showNotification(data.mensagem || 'E-mail de recuperação enviado!', 'success');
            return data.objeto;

        } catch (error) {
            console.error('Reset password error:', error);
            if (error instanceof Error) {
                notificationActions.showError(error.message);
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