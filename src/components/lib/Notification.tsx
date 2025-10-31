import styled from 'styled-components';
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotificationStore } from '../../features/notifications/useNotification';

const NotificationContainer = styled.div`
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NotificationCard = styled.div<{ type: 'success' | 'error' | 'warning' | 'info' }>`
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  border: 1px solid;
  animation: slideIn 0.3s ease-out;
  
  ${({ type }) => {
    switch (type) {
      case 'success':
        return `
          background: #f0f9ff;
          border-color: #22c55e;
          color: #166534;
        `;
      case 'error':
        return `
          background: #fef2f2;
          border-color: #ef4444;
          color: #dc2626;
        `;
      case 'warning':
        return `
          background: #fffbeb;
          border-color: #f59e0b;
          color: #d97706;
        `;
      case 'info':
      default:
        return `
          background: #eff6ff;
          border-color: #3b82f6;
          color: #1d4ed8;
        `;
    }
  }}
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
  margin-right: 12px;
`;

const Content = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 12px;
  color: inherit;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

export const Notification = () => {
  const { t } = useTranslation();
  const { notifications, hideNotification } = useNotificationStore();

  if (notifications.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  return (
    <NotificationContainer>
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} type={notification.type}>
          <IconWrapper>
            {getIcon(notification.type)}
          </IconWrapper>
          <Content>
            {notification.message}
          </Content>
          <CloseButton
            onClick={() => hideNotification(notification.id)}
            aria-label={t('actions.close') || 'Fechar'}
          >
            <X size={16} />
          </CloseButton>
        </NotificationCard>
      ))}
    </NotificationContainer>
  );
};