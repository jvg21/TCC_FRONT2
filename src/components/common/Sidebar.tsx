// src/components/common/Sidebar.tsx - VERSÃO CORRIGIDA

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useTypedTranslation } from "../../context/LanguageContext";
import { FiBriefcase } from "react-icons/fi";


import { 
  FiHome, 
  FiUsers, 
  FiGrid,
  FiFolderPlus, 
  FiCheckSquare, 
  FiFile, 
  FiMenu,
  FiX,
  FiSettings,
  FiLink2,
  FiChevronRight
} from "react-icons/fi";

interface WrapProps {
  $isCollapsed: boolean;
}

const Wrap = styled.aside<WrapProps>`
  position: fixed;
  top: 0;
  left: 0;
  background: ${({ theme }) => theme.colors.surface};
  height: 100vh;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ $isCollapsed }) => 
    $isCollapsed ? 'none' : '2px 0 10px rgba(0, 0, 0, 0.1)'};

  width: ${({ $isCollapsed }) => ($isCollapsed ? '80px' : '260px')};

  @media (max-width: 768px) {
    width: 280px;
    transform: translateX(${({ $isCollapsed }) => ($isCollapsed ? '-100%' : '0')});
    box-shadow: ${({ $isCollapsed }) => 
      $isCollapsed ? 'none' : '0 0 20px rgba(0, 0, 0, 0.3)'};
  }
`;

const Header = styled.div<{ $isCollapsed: boolean }>`
  padding: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) => 
    $isCollapsed ? 'center' : 'space-between'};
  min-height: 80px;
  flex-shrink: 0;
`;

const Logo = styled.div<{ $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  transform: ${({ $isCollapsed }) => 
    $isCollapsed ? 'scale(0.8)' : 'scale(1)'};
  transition: all 0.3s ease;

  h2 {
    color: ${({ theme }) => theme.colors.text};
    font-size: 20px;
    font-weight: 700;
    margin: 0;
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
`;

const ToggleButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.muted};
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}15;
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileToggle = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  width: 44px;
  height: 44px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
  }
`;

const NavGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 12px;
  
  /* Ajuste especial para modo colapsado */
  @media (min-width: 769px) {
    /* Desktop only - evita interferir com mobile */
    padding: ${props => {
      // Aqui você pode acessar props do contexto styled-components
      // mas vamos usar uma abordagem mais simples
      return '0 12px';
    }};
  }
`;

const NavItem = styled(Link)<{ $isActive: boolean; $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '12px')};
  padding: ${({ $isCollapsed }) => ($isCollapsed ? '12px' : '12px 16px')};
  margin: ${({ $isCollapsed }) => ($isCollapsed ? '0 6px' : '0')};
  border-radius: 12px;
  text-decoration: none;
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary : theme.colors.muted};
  background: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary + '15' : 'transparent'};
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '500')};
  font-size: 14px;
  transition: all 0.2s ease;
  position: relative;
  justify-content: ${({ $isCollapsed }) => 
    $isCollapsed ? 'center' : 'flex-start'};
  width: ${({ $isCollapsed }) => ($isCollapsed ? '56px' : 'auto')};
  height: ${({ $isCollapsed }) => ($isCollapsed ? '56px' : 'auto')};

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    display: block;
    ${({ $isCollapsed }) => $isCollapsed && `
      margin: 0;
      transform: translateZ(0); /* Force GPU acceleration */
    `}
  }

  span {
    opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
    visibility: ${({ $isCollapsed }) => ($isCollapsed ? 'hidden' : 'visible')};
    transform: ${({ $isCollapsed }) => 
      $isCollapsed ? 'translateX(-10px)' : 'translateX(0)'};
    transition: all 0.3s ease;
    white-space: nowrap;
    width: ${({ $isCollapsed }) => ($isCollapsed ? '0' : 'auto')};
    overflow: hidden;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary}15;
    color: ${({ theme }) => theme.colors.primary};
  }

  ${({ $isCollapsed }) => $isCollapsed && `
    &:hover {
      &::after {
        content: attr(data-tooltip);
        position: absolute;
        left: calc(100% + 8px);
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
    }
  `}
`;

// Estilos para dropdown de integrações
const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownTrigger = styled.div<{ 
  $isActive: boolean; 
  $isCollapsed: boolean;
  $isOpen: boolean; 
}>`
  display: flex;
  align-items: center;
  gap: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '12px')};
  padding: ${({ $isCollapsed }) => ($isCollapsed ? '12px' : '12px 16px')};
  margin: ${({ $isCollapsed }) => ($isCollapsed ? '0 6px' : '0')};
  border-radius: 12px;
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary : theme.colors.muted};
  background: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary + '15' : 'transparent'};
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '500')};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  justify-content: ${({ $isCollapsed }) => 
    $isCollapsed ? 'center' : 'space-between'};
  position: relative;
  width: ${({ $isCollapsed }) => ($isCollapsed ? '56px' : 'auto')};
  height: ${({ $isCollapsed }) => ($isCollapsed ? '56px' : 'auto')};

  svg:first-child {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    display: block;
    ${({ $isCollapsed }) => $isCollapsed && `
      margin: 0;
      transform: translateZ(0); /* Force GPU acceleration */
    `}
  }

  span {
    opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
    visibility: ${({ $isCollapsed }) => ($isCollapsed ? 'hidden' : 'visible')};
    transform: ${({ $isCollapsed }) => 
      $isCollapsed ? 'translateX(-10px)' : 'translateX(0)'};
    transition: all 0.3s ease;
    white-space: nowrap;
    flex: 1;
    width: ${({ $isCollapsed }) => ($isCollapsed ? '0' : 'auto')};
    overflow: hidden;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary}15;
    color: ${({ theme }) => theme.colors.primary};
  }

  ${({ $isCollapsed }) => $isCollapsed && `
    &:hover {
      &::after {
        content: attr(data-tooltip);
        position: absolute;
        left: calc(100% + 8px);
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
    }
  `}
`;

const ChevronIcon = styled.div<{ $isOpen: boolean; $isCollapsed: boolean }>`
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  visibility: ${({ $isCollapsed }) => ($isCollapsed ? 'hidden' : 'visible')};
  transform: ${({ $isOpen, $isCollapsed }) => 
    $isCollapsed ? 'translateX(10px)' : 
    $isOpen ? 'rotate(90deg)' : 'rotate(0deg)'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '14px')};
  height: 14px;
  overflow: hidden;
`;

const DropdownContent = styled.div<{ $isOpen: boolean; $isCollapsed: boolean }>`
  max-height: ${({ $isOpen, $isCollapsed }) => 
    $isOpen && !$isCollapsed ? '200px' : '0'};
  opacity: ${({ $isOpen, $isCollapsed }) => 
    $isOpen && !$isCollapsed ? 1 : 0};
  overflow: hidden;
  transition: all 0.3s ease;
  margin-left: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '32px')};
  margin-top: 4px;
`;

const DropdownItem = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary : theme.colors.muted};
  background: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary + '10' : 'transparent'};
  font-size: 13px;
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '500')};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}10;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

// Para o modo colapsado, criar um item simples para integrações
const IntegrationsNavItem = styled(NavItem)`
  // Herda todos os estilos do NavItem com as correções de pixel perfect
`;

const Overlay = styled.div<{ $isVisible: boolean }>`
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
    visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
    transition: all 0.3s ease;
    z-index: 999;
  }
`;

const ContentShifter = styled.div<{ $isCollapsed: boolean }>`
  margin-left: ${({ $isCollapsed }) => ($isCollapsed ? '80px' : '260px')};
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

interface SidebarProps {
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [profile, setProfile] = useState<number>(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [integrationsOpen, setIntegrationsOpen] = useState(false);

  const { user } = useAuthContext();
  const { t } = useTypedTranslation();
  const location = useLocation();

  useEffect(() => {
    setProfile(user?.Profile || 0);
  }, [user]);

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Só colapsar automaticamente na primeira vez (mobile)
      if (mobile && !document.body.hasAttribute('data-sidebar-initialized')) {
        setIsCollapsed(true);
        document.body.setAttribute('data-sidebar-initialized', 'true');
      }
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Verificar se estamos numa rota de integrações
  const isIntegrationsActive = location.pathname.startsWith('/integrations');
  const isOpenAIActive = location.pathname === '/integrations/openai';

  // Items de navegação básicos com traduções
  const navigationItems = [
    { path: "/", label: t("navigation.home"), icon: FiHome, show: true },
    { path: "/companies", label: t("navigation.companies"), icon: FiBriefcase, show: profile === 1 },
    { path: "/user", label: t("navigation.users"), icon: FiUsers, show: profile <= 2 && profile > 0 },
    { path: "/group", label: t("navigation.groups"), icon: FiGrid, show: profile <= 2 && profile > 0 },
    { path: "/folder", label: t("navigation.folders"), icon: FiFolderPlus, show: profile <= 2 && profile > 0 },
    { path: "/task", label: t("navigation.tasks"), icon: FiCheckSquare, show: true },
    { path: "/document", label: t("navigation.documents"), icon: FiFile, show: true },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleOverlayClick = () => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  const handleNavItemClick = () => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  const toggleIntegrationsDropdown = () => {
    if (!isCollapsed) {
      setIntegrationsOpen(!integrationsOpen);
    }
  };

  const handleIntegrationsClick = () => {
    if (isCollapsed) {
      // Se está colapsado, vai para a primeira página de integração
      handleNavItemClick();
      // Você pode navegar programaticamente se necessário
      // navigate('/integrations/openai');
    } else {
      toggleIntegrationsDropdown();
    }
  };

  // Auto-abrir dropdown se estivermos numa rota de integração
  useEffect(() => {
    if (isIntegrationsActive && !isCollapsed) {
      setIntegrationsOpen(true);
    }
  }, [isIntegrationsActive, isCollapsed]);

  return (
    <>
      {isMobile && (
        <MobileToggle onClick={toggleSidebar}>
          {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
        </MobileToggle>
      )}
      
      <Overlay $isVisible={!isCollapsed && isMobile} onClick={handleOverlayClick} />
      
      <Wrap $isCollapsed={isCollapsed}>
        <Header $isCollapsed={isCollapsed}>
          {!isCollapsed && (
            <Logo $isCollapsed={isCollapsed}>
              <LogoIcon>D</LogoIcon>
              <h2>Documentin</h2>
            </Logo>
          )}
          {isCollapsed && <LogoIcon>D</LogoIcon>}
          
          <ToggleButton onClick={toggleSidebar}>
            {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
          </ToggleButton>
        </Header>

        <Navigation>
          <NavGroup>
            {/* Items de navegação básicos */}
            {navigationItems
              .filter(item => item.show)
              .map(({ path, label, icon: Icon }) => (
                <NavItem
                  key={path}
                  to={path}
                  $isActive={location.pathname === path}
                  $isCollapsed={isCollapsed}
                  onClick={handleNavItemClick}
                  data-tooltip={label}
                >
                  <Icon />
                  <span>{label}</span>
                </NavItem>
              ))}

            {/* Integrações - Dropdown quando expandido, item simples quando colapsado */}
            {isCollapsed ? (
              <IntegrationsNavItem
                to="/integrations/openai"
                $isActive={isIntegrationsActive}
                $isCollapsed={isCollapsed}
                onClick={handleNavItemClick}
                data-tooltip={t("navigation.integrations")}
              >
                <FiLink2 />
                <span>{t("navigation.integrations")}</span>
              </IntegrationsNavItem>
            ) : (
              <DropdownContainer>
                <DropdownTrigger
                  $isActive={isIntegrationsActive}
                  $isCollapsed={isCollapsed}
                  $isOpen={integrationsOpen}
                  onClick={handleIntegrationsClick}
                  data-tooltip={t("navigation.integrations")}
                >
                  <FiLink2 />
                  <span>{t("navigation.integrations")}</span>
                  <ChevronIcon $isOpen={integrationsOpen} $isCollapsed={isCollapsed}>
                    <FiChevronRight size={14} />
                  </ChevronIcon>
                </DropdownTrigger>
                
                <DropdownContent $isOpen={integrationsOpen} $isCollapsed={isCollapsed}>
                  <DropdownItem
                    to="/integrations/openai"
                    $isActive={isOpenAIActive}
                    onClick={handleNavItemClick}
                  >
                    {t("navigation.openai")}
                  </DropdownItem>
                </DropdownContent>
              </DropdownContainer>
            )}

            {/* Configurações */}
            <NavItem
              to="/settings"
              $isActive={location.pathname === '/settings'}
              $isCollapsed={isCollapsed}
              onClick={handleNavItemClick}
              data-tooltip={t("navigation.settings")}
            >
              <FiSettings />
              <span>{t("navigation.settings")}</span>
            </NavItem>
          </NavGroup>
        </Navigation>
      </Wrap>

      <ContentShifter $isCollapsed={isCollapsed}>
        {children}
      </ContentShifter>
    </>
  );
};

export default Sidebar;