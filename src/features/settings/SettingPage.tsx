import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../context/ThemeContext";
import { useLanguage, LanguageSelector } from "../../context/LanguageContext";
import { useLogin } from "../login/useLogin";
import { useAuthContext } from "../../context/AuthContext";
import { Button } from "../../components/common/Button";
import PageLayout from "../../components/common/PageLayout";
import { useTranslation } from "react-i18next";
import { 
  FiSettings, 
  FiMoon, 
  FiSun, 
  FiLogOut, 
  FiUser,
} from "react-icons/fi";

const SettingsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
  
  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 8px;
  }
  
  @media (max-width: 480px) {
    padding: 0;
  }
`;

const SettingsCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  
  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 16px;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    margin-bottom: 12px;
    border-radius: 6px;
    margin-left: 0;
    margin-right: 0;
  }
`;

const SettingsSection = styled.div`
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  
  @media (max-width: 768px) {
    gap: 10px;
    margin-bottom: 16px;
    padding-bottom: 10px;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    margin-bottom: 12px;
    padding-bottom: 8px;
    flex-direction: row;
    align-items: flex-start;
  }
`;

const SectionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    border-radius: 6px;
  }
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const SectionDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    margin-top: 2px;
  }
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  &:first-child {
    padding-top: 0;
  }
  
  @media (max-width: 768px) {
    padding: 12px 0;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 0;
    gap: 10px;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
  
  @media (max-width: 768px) {
    flex: none;
    width: 100%;
  }
`;

const SettingLabel = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const SettingSubtext = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const SettingControl = styled.div`
  margin-left: 20px;
  
  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    justify-content: stretch;
  }
`;

const ThemeOptionGroup = styled.div`
  display: flex;
  gap: 8px;
  background: ${({ theme }) => theme.colors.background};
  padding: 4px;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
  }
  
  @media (max-width: 480px) {
    max-width: none;
    gap: 6px;
    padding: 3px;
    border-radius: 6px;
  }
`;

const ThemeOption = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: none;
  background: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.surface : 'transparent'};
  color: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.text : theme.colors.muted};
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: ${({ $isActive }) => 
    $isActive ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'};
  flex: 1;
  justify-content: center;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surface}80;
  }
  
  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 12px;
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 11px;
    gap: 4px;
    border-radius: 4px;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const LanguageContainer = styled.div`
  .language-selector-buttons {
    gap: 8px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    
    .lang-btn {
      min-width: 120px;
      justify-content: center;
      font-size: 14px;
      padding: 10px 16px;
      border-radius: 6px;
      border: 1px solid ${({ theme }) => theme.colors.border || 'rgba(0, 0, 0, 0.1)'};
      background: ${({ theme }) => theme.colors.surface};
      color: ${({ theme }) => theme.colors.text};
      cursor: pointer;
      transition: all 0.2s ease;
      
      &.active {
        background: ${({ theme }) => theme.colors.primary};
        border-color: ${({ theme }) => theme.colors.primary};
        color: white;
      }
      
      &:hover:not(.active) {
        background: ${({ theme }) => theme.colors.primary}15;
        border-color: ${({ theme }) => theme.colors.primary}50;
      }
    }
  }
  
  @media (max-width: 768px) {
    .language-selector-buttons {
      width: 100%;
      max-width: 350px;
      
      .lang-btn {
        min-width: 100px;
        padding: 12px 14px;
        font-size: 13px;
      }
    }
  }
  
  @media (max-width: 480px) {
    .language-selector-buttons {
      max-width: none;
      gap: 6px;
      
      .lang-btn {
        min-width: 80px;
        padding: 10px 12px;
        font-size: 12px;
        border-radius: 4px;
      }
    }
  }
`;

const UserInfoCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 768px) {
    padding: 16px;
    gap: 12px;
    border-radius: 8px;
    flex-direction: row;
    align-items: center;
  }
  
  @media (max-width: 480px) {
    padding: 14px;
    gap: 10px;
    border-radius: 6px;
    flex-direction: column;
    text-align: center;
  }
`;

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: 600;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }
`;

const UserInfo = styled.div`
  flex: 1;
  
  @media (max-width: 480px) {
    flex: none;
  }
`;

const UserName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
  
  @media (max-width: 768px) {
    font-size: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 2px;
  }
`;

const UserRole = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const LogoutButton = styled(Button)`
  background: ${({ theme }) => theme.colors.danger};
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.danger}dd;
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 12px 16px;
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 13px;
    border-radius: 6px;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { themeName, toggleTheme } = useThemeContext();
  const { currentLanguage } = useLanguage();
  const { logout } = useLogin();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const getProfileName = (profile: number) => {
    switch (profile) {
      case 1: return t('profiles.administrator') || 'Administrador';
      case 2: return t('profiles.manager') || 'Gerente';
      case 3: return t('profiles.employee') || 'Funcionário';
      default: return t('profiles.employee') || 'Usuário';
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getCurrentLanguageLabel = () => {
    switch (currentLanguage) {
      case 'pt': return 'Português (Brasil)';
      case 'en': return 'English (US)';
      case 'es': return 'Español';
      default: return 'Português (Brasil)';
    }
  };

  return (
    <PageLayout
      title={t("settings.title")}
    >
      <SettingsContainer>
        {}
        <SettingsCard>
          <SettingsSection>
            <SectionHeader>
              <SectionIcon>
                <FiUser size={20} />
              </SectionIcon>
              <div>
                <SectionTitle>{t("settings.account")}</SectionTitle>
                <SectionDescription>
                  {t("settings.account_description")}
                </SectionDescription>
              </div>
            </SectionHeader>

            <UserInfoCard>
              <UserAvatar>
                {user?.Name ? getUserInitials(user.Name) : 'U'}
              </UserAvatar>
              <UserInfo>
                <UserName>{user?.Name || t("profiles.employee")}</UserName>
                <UserRole>{getProfileName(user?.Profile || 0)}</UserRole>
              </UserInfo>
            </UserInfoCard>
          </SettingsSection>
        </SettingsCard>

        {}
        <SettingsCard>
          <SettingsSection>
            <SectionHeader>
              <SectionIcon>
                <FiSettings size={20} />
              </SectionIcon>
              <div>
                <SectionTitle>{t("settings.appearance")}</SectionTitle>
                <SectionDescription>
                  {t("settings.appearance_description")}
                </SectionDescription>
              </div>
            </SectionHeader>

            {}
            <SettingItem>
              <SettingInfo>
                <SettingLabel>{t("settings.theme")}</SettingLabel>
                <SettingSubtext>
                  {t("settings.theme_description")}
                </SettingSubtext>
              </SettingInfo>
              <SettingControl>
                <ThemeOptionGroup>
                  <ThemeOption 
                    $isActive={themeName === "light"}
                    onClick={() => themeName === "dark" && toggleTheme()}
                  >
                    <FiSun size={16} />
                    {t("theme.light")}
                  </ThemeOption>
                  <ThemeOption 
                    $isActive={themeName === "dark"}
                    onClick={() => themeName === "light" && toggleTheme()}
                  >
                    <FiMoon size={16} />
                    {t("theme.dark")}
                  </ThemeOption>
                </ThemeOptionGroup>
              </SettingControl>
            </SettingItem>

            {}
            <SettingItem>
              <SettingInfo>
                <SettingLabel>{t("settings.language")}</SettingLabel>
                <SettingSubtext>
                  {getCurrentLanguageLabel()}
                </SettingSubtext>
              </SettingInfo>
              <SettingControl>
                <LanguageContainer>
                  <LanguageSelector 
                    variant="buttons" 
                    showFlag={true} 
                    showLabel={true}
                  />
                </LanguageContainer>
              </SettingControl>
            </SettingItem>
          </SettingsSection>
        </SettingsCard>

        {}
        <SettingsCard>
          <SettingsSection>
            <SectionHeader>
              <SectionIcon>
                <FiLogOut size={20} />
              </SectionIcon>
              <div>
                <SectionTitle>{t("settings.session")}</SectionTitle>
                <SectionDescription>
                  {t("settings.session_description")}
                </SectionDescription>
              </div>
            </SectionHeader>

            <SettingItem>
              <SettingInfo>
                <SettingLabel>{t("settings.logout")}</SettingLabel>
                <SettingSubtext>
                  {t("settings.logout_description")}
                </SettingSubtext>
              </SettingInfo>
              <SettingControl>
                <LogoutButton variant="danger" onClick={handleLogout}>
                  <FiLogOut size={16} />
                  {t("login.logout")}
                </LogoutButton>
              </SettingControl>
            </SettingItem>
          </SettingsSection>
        </SettingsCard>
      </SettingsContainer>
    </PageLayout>
  );
};

export default SettingsPage;