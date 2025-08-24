import type { ApiResponse } from "../../types";
import { notificationActions } from "../notifications/useNotification";

export const usePasswordRecovery = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    async function requestPasswordRecovery(email: string) {
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
            return data;

        } catch (error) {
            console.error('Password recovery request error:', error);
            if (error instanceof Error) {
                notificationActions.showError(error.message);
            }
            throw error;
        }
    }

    async function validateToken(email: string, token: string) {
        try {
            const response = await fetch(`${apiUrl}/User/ValidateTokenPasswordRecovery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, token })
            });

            const data: ApiResponse = await response.json();

            if (data.erro) {
                notificationActions.showError(data.mensagem || 'Token inválido ou expirado');
                throw new Error(data.mensagem || 'Token inválido ou expirado');
            }

            notificationActions.showNotification(data.mensagem || 'Token validado com sucesso!', 'success');
            return data;

        } catch (error) {
            console.error('Token validation error:', error);
            if (error instanceof Error) {
                notificationActions.showError(error.message);
            }
            throw error;
        }
    }

    async function updatePassword(email: string, token: string, newPassword: string) {
        try {
            const response = await fetch(`${apiUrl}/User/UpdatePasswordRecovery`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, token, newPassword })
            });

            const data: ApiResponse = await response.json();

            if (data.erro) {
                notificationActions.showError(data.mensagem || 'Erro ao atualizar senha');
                throw new Error(data.mensagem || 'Erro ao atualizar senha');
            }

            notificationActions.showNotification(data.mensagem || 'Senha atualizada com sucesso!', 'success');
            return data;

        } catch (error) {
            console.error('Password update error:', error);
            if (error instanceof Error) {
                notificationActions.showError(error.message);
            }
            throw error;
        }
    }

    return {
        requestPasswordRecovery,
        validateToken,
        updatePassword
    };
};