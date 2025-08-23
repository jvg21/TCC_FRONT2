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
  FiGlobe, 
  FiMoon, 
  FiSun, 
  FiLogOut, 
  FiUser,
  FiMonitor,
  FiCheck
} from "react-icons/fi";

const SettingsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const SettingsCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const SettingsSection = styled.div`
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
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
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const SectionDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
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
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingLabel = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const SettingSubtext = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

const SettingControl = styled.div`
  margin-left: 20px;
`;

const ThemeOptionGroup = styled.div`
  display: flex;
  gap: 8px;
  background: ${({ theme }) => theme.colors.background};
  padding: 4px;
  border-radius: 8px;
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
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surface}80;
  }
`;

const LanguageContainer = styled.div`
  .language-selector-buttons {
    gap: 8px;
    
    .lang-btn {
      min-width: 120px;
      justify-content: center;
      font-size: 14px;
      padding: 10px 16px;
      
      &.active {
        background: ${({ theme }) => theme.colors.primary};
        border-color: ${({ theme }) => theme.colors.primary};
        color: white;
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
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const UserRole = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

const LogoutButton = styled(Button)`
  background: ${({ theme }) => theme.colors.danger};
  border: none;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.danger}dd;
    transform: translateY(-1px);
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
      case 1: return t('administrator') || 'Administrador';
      case 2: return t('manager') || 'Gerente';
      case 3: return t('employee') || 'Funcionário';
      default: return 'Usuário';
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
      title={t("settings.title") || "Configurações"}
      actions={
        <Button variant="ghost" onClick={() => navigate(-1)}>
          {t("actions.back") || "Voltar"}
        </Button>
      }
    >
      <SettingsContainer>
        {/* Informações do Usuário */}
        <SettingsCard>
          <SettingsSection>
            <SectionHeader>
              <SectionIcon>
                <FiUser size={20} />
              </SectionIcon>
              <div>
                <SectionTitle>{t("settings.account") || "Conta"}</SectionTitle>
                <SectionDescription>
                  {t("settings.account_description") || "Informações da sua conta"}
                </SectionDescription>
              </div>
            </SectionHeader>

            <UserInfoCard>
              <UserAvatar>
                {user?.Name ? getUserInitials(user.Name) : 'U'}
              </UserAvatar>
              <UserInfo>
                <UserName>{user?.Name || 'Usuário'}</UserName>
                <UserRole>{getProfileName(user?.Profile || 0)}</UserRole>
              </UserInfo>
            </UserInfoCard>
          </SettingsSection>
        </SettingsCard>

        {/* Configurações de Aparência */}
        <SettingsCard>
          <SettingsSection>
            <SectionHeader>
              <SectionIcon>
                <FiSettings size={20} />
              </SectionIcon>
              <div>
                <SectionTitle>{t("settings.appearance") || "Aparência"}</SectionTitle>
                <SectionDescription>
                  {t("settings.appearance_description") || "Personalize a aparência do sistema"}
                </SectionDescription>
              </div>
            </SectionHeader>

            {/* Configuração de Tema */}
            <SettingItem>
              <SettingInfo>
                <SettingLabel>{t("settings.theme") || "Tema"}</SettingLabel>
                <SettingSubtext>
                  {t("settings.theme_description") || "Escolha entre modo claro ou escuro"}
                </SettingSubtext>
              </SettingInfo>
              <SettingControl>
                <ThemeOptionGroup>
                  <ThemeOption 
                    $isActive={themeName === "light"}
                    onClick={() => themeName === "dark" && toggleTheme()}
                  >
                    <FiSun size={16} />
                    {t("theme.light") || "Claro"}
                  </ThemeOption>
                  <ThemeOption 
                    $isActive={themeName === "dark"}
                    onClick={() => themeName === "light" && toggleTheme()}
                  >
                    <FiMoon size={16} />
                    {t("theme.dark") || "Escuro"}
                  </ThemeOption>
                </ThemeOptionGroup>
              </SettingControl>
            </SettingItem>

            {/* Configuração de Idioma */}
            <SettingItem>
              <SettingInfo>
                <SettingLabel>{t("settings.language") || "Idioma"}</SettingLabel>
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

        {/* Seção de Logout */}
        <SettingsCard>
          <SettingsSection>
            <SectionHeader>
              <SectionIcon>
                <FiLogOut size={20} />
              </SectionIcon>
              <div>
                <SectionTitle>{t("settings.session") || "Sessão"}</SectionTitle>
                <SectionDescription>
                  {t("settings.session_description") || "Gerencie sua sessão no sistema"}
                </SectionDescription>
              </div>
            </SectionHeader>

            <SettingItem>
              <SettingInfo>
                <SettingLabel>{t("settings.logout") || "Sair do Sistema"}</SettingLabel>
                <SettingSubtext>
                  {t("settings.logout_description") || "Encerra sua sessão atual e retorna à tela de login"}
                </SettingSubtext>
              </SettingInfo>
              <SettingControl>
                <LogoutButton variant="danger" onClick={handleLogout}>
                  <FiLogOut size={16} />
                  &nbsp;{t("login.logout") || "Sair"}
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