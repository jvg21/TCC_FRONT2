import React, { useState } from 'react';
import styled from 'styled-components';

const TabsContainer = styled.div`
  width: 100%;
  margin-bottom: 24px;
`;

const TabsList = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.muted}30;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px 8px 0 0;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.muted};
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    flex-wrap: nowrap;
    gap: 0;
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 12px 20px;
  border: none;
  background: ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) => $active ? 'white' : theme.colors.muted};
  font-weight: ${({ $active }) => $active ? '600' : '400'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: fit-content;
  border-bottom: ${({ $active, theme }) => $active ? `2px solid ${theme.colors.primary}` : '2px solid transparent'};

  &:hover {
    background: ${({ $active, theme }) => $active ? theme.colors.primary : `${theme.colors.muted}20`};
    color: ${({ $active, theme }) => $active ? 'white' : theme.colors.text};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}40`};
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 13px;
    flex: 1;
    text-align: center;
  }
`;

const TabContent = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 0 0 8px 8px;
  min-height: 200px;
`;

const Badge = styled.span<{ $active: boolean }>`
  margin-left: 8px;
  background: ${({ $active, theme }) => $active ? 'rgba(255,255,255,0.3)' : theme.colors.danger};
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: bold;
  min-width: 16px;
  display: inline-block;
  text-align: center;
`;

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  badge?: number; 
  icon?: React.ReactNode; 
}

interface TabContainerProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  onTabChange?: (tabId: string) => void;
}

export const TabContainer: React.FC<TabContainerProps> = ({ 
  tabs, 
  defaultTab, 
  className,
  onTabChange 
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  if (!tabs || tabs.length === 0) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        color: '#6c757d',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        Nenhuma aba disponível
      </div>
    );
  }

  return (
    <TabsContainer className={className}>
      <TabsList>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            $active={activeTab === tab.id}
            onClick={() => handleTabChange(tab.id)}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
          >
            {tab.icon && <span style={{ marginRight: '8px' }}>{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <Badge $active={activeTab === tab.id}>
                {tab.badge > 99 ? '99+' : tab.badge}
              </Badge>
            )}
          </TabButton>
        ))}
      </TabsList>
      <TabContent 
        role="tabpanel" 
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTabContent}
      </TabContent>
    </TabsContainer>
  );
};