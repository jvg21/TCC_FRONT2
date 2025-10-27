import { create } from 'zustand';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationState {
  notifications: Notification[];
  showNotification: (message: string, type: NotificationType) => void;
  hideNotification: (id: number) => void;
  showError: (message: string) => void;
}

let counter = 0;

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  
  showNotification: (message, type) => {
    // Verificar se já existe uma notificação com a mesma mensagem e tipo
    const existingNotification = get().notifications.find(
      notification => notification.message === message && notification.type === type
    );
    
    // Se existir uma notificação idêntica, não adicionar outra
    if (existingNotification) {
      return;
    }
    
    const id = counter++;
    set(state => ({
      notifications: [...state.notifications, { id, message, type }]
    }));
    
    setTimeout(() => {
      get().hideNotification(id);
    }, 5000);
  },
  
  hideNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(notification => notification.id !== id)
    }));
  },
  
  showError: (message) => {
    get().showNotification(message, 'error');
  }
}));

export const notificationActions = {
  showNotification: (message: string, type: NotificationType) => {
    useNotificationStore.getState().showNotification(message, type);
  },
  showError: (message: string) => {
    useNotificationStore.getState().showError(message);
  },
  hideNotification: (id: number) => {
    useNotificationStore.getState().hideNotification(id);
  }
};