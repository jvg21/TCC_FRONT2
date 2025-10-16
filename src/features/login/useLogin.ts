import type { ApiResponse } from "../../types";
import { notificationActions } from "../notifications/useNotification";
import { eraseCookie,  setCookie } from "../../utils/Cookies";
import { useAuthContext } from "../../context/AuthContext";

export const useLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { setIsAuthenticated, setUser} = useAuthContext();

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

            setCookie('authToken', data.objeto.token);
            notificationActions.showNotification(data.mensagem || 'Login realizado com sucesso!', 'success');
            setIsAuthenticated(true);
            setUser(data.objeto.user);
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
        setUser(null);
    }

    return {
        login,
        logout,
    }
}