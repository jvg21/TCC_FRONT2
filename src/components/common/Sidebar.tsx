import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { 
  FiHome, 
  FiUsers, 
  FiUsers as FiGroup, 
  FiFolderPlus, 
  FiCheckSquare, 
  FiFile, 
  FiMenu,
  FiX,
  FiSettings,
  FiLink2,
  FiChevronDown,
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

  width: ${({ $isCollapsed }) => ($isCollapsed ? '60px' : '260px')};

  @media (max-width: 768px) {
    width: ${({ $isCollapsed }) => ($isCollapsed ? '0px' : '280px')};
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
  transition: opacity 0.3s ease;
  
  h2 {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, 
      ${({ theme }) => theme.colors.primary}, 
      ${({ theme }) => theme.colors.primary}80
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    white-space: nowrap;
  }
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.primary}80
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: bold;
  flex-shrink: 0;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }

  @media (min-width: 769px) {
    display: flex;
  }
`;

const MobileToggle = styled(ToggleButton)`
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Navigation = styled.nav`
  padding: 20px 0;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.muted}30;
    border-radius: 4px;
  }

  @media (max-height: 600px) {
    padding: 10px 0;
  }

  @media (max-height: 500px) {
    padding: 5px 0;
  }
`;

const NavGroup = styled.div`
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }

  @media (max-height: 600px) {
    margin-bottom: 20px;
  }

  @media (max-height: 500px) {
    margin-bottom: 10px;
  }
`;

const NavItem = styled(Link)<{ $isActive: boolean; $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.primary : theme.colors.text};
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '500')};
  min-height: 44px;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary}08;
    color: ${({ theme }) => theme.colors.primary};
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: ${({ $isActive }) => ($isActive ? '20px' : '0px')};
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 0 2px 2px 0;
    transition: height 0.2s ease;
  }
  
  svg {
    flex-shrink: 0;
    font-size: 18px;
    width: 18px;
    height: 18px;
  }
  
  span {
    opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
    transform: translateX(${({ $isCollapsed }) => ($isCollapsed ? '-10px' : '0')});
    transition: all 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  @media (max-width: 768px) {
    span {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (max-height: 600px) {
    padding: 10px 20px;
    min-height: 40px;
  }

  @media (max-height: 500px) {
    padding: 8px 20px;
    min-height: 36px;
  }
`;

// Componentes específicos para dropdown
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
  gap: 12px;
  padding: 12px 20px;
  color: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.primary : theme.colors.text};
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '500')};
  min-height: 44px;
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary}08;
    color: ${({ theme }) => theme.colors.primary};
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: ${({ $isActive, $isOpen }) => ($isActive || $isOpen ? '20px' : '0px')};
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 0 2px 2px 0;
    transition: height 0.2s ease;
  }
  
  svg {
    flex-shrink: 0;
    font-size: 18px;
    width: 18px;
    height: 18px;
  }
  
  span {
    opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
    transform: translateX(${({ $isCollapsed }) => ($isCollapsed ? '-10px' : '0')});
    transition: all 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }
  
  @media (max-width: 768px) {
    span {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (max-height: 600px) {
    padding: 10px 20px;
    min-height: 40px;
  }

  @media (max-height: 500px) {
    padding: 8px 20px;
    min-height: 36px;
  }
`;

const ChevronIcon = styled.div<{ $isOpen: boolean; $isCollapsed: boolean }>`
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  transition: all 0.3s ease;
  transform: ${({ $isOpen }) => $isOpen ? 'rotate(90deg)' : 'rotate(0deg)'};
  
  @media (max-width: 768px) {
    opacity: 1;
  }
`;

const DropdownContent = styled.div<{ $isOpen: boolean; $isCollapsed: boolean }>`
  max-height: ${({ $isOpen, $isCollapsed }) => 
    $isOpen && !$isCollapsed ? '200px' : '0px'};
  overflow: hidden;
  transition: all 0.3s ease;
  background: ${({ theme }) => theme.colors.background};
  margin: 4px 0;
  border-radius: 8px;
`;

const DropdownItem = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px 10px 52px; // Extra indent para submenu
  color: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.primary : theme.colors.text};
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '400')};
  font-size: 14px;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary}05;
    color: ${({ theme }) => theme.colors.primary};
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 2px;
    height: ${({ $isActive }) => ($isActive ? '16px' : '0px')};
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 0 1px 1px 0;
    transition: height 0.2s ease;
  }
`;

const Overlay = styled.div<{ $isVisible: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
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
  margin-left: ${({ $isCollapsed }) => ($isCollapsed ? '60px' : '260px')};
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
  const [isMobile, setIsMobile] = useState(false);
  const [integrationsOpen, setIntegrationsOpen] = useState(false);

  const { user } = useAuthContext();
  const location = useLocation();

  useEffect(() => {
    setProfile(user?.Profile || 0);
  }, [user]);

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      if (mobile && !isCollapsed) {
        setIsCollapsed(true);
      }
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [isCollapsed]);

  // Verificar se estamos numa rota de integrações
  const isIntegrationsActive = location.pathname.startsWith('/integrations');
  const isOpenAIActive = location.pathname === '/integrations/openai';

  // Items de navegação básicos
  const navigationItems = [
    { path: "/", label: "Home", icon: FiHome, show: true },
    { path: "/companies", label: "Empresas", icon: FiUsers, show: profile === 1 },
    { path: "/user", label: "Usuários", icon: FiUsers, show: profile <= 2 && profile > 0 },
    { path: "/group", label: "Grupos", icon: FiGroup, show: profile <= 2 && profile > 0 },
    { path: "/folder", label: "Pastas", icon: FiFolderPlus, show: profile <= 2 && profile > 0 },
    { path: "/task", label: "Tarefas", icon: FiCheckSquare, show: true },
    { path: "/document", label: "Documentos", icon: FiFile, show: true },
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
          
          {!isMobile && (
            <ToggleButton onClick={toggleSidebar}>
              {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
            </ToggleButton>
          )}
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
                >
                  <Icon />
                  <span>{label}</span>
                </NavItem>
              ))}

            {/* Dropdown de Integrações */}
            <DropdownContainer>
              <DropdownTrigger
                $isActive={isIntegrationsActive}
                $isCollapsed={isCollapsed}
                $isOpen={integrationsOpen}
                onClick={toggleIntegrationsDropdown}
              >
                <FiLink2 />
                <span>Integrações</span>
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
                  OpenAI
                </DropdownItem>
              </DropdownContent>
            </DropdownContainer>

            {/* Configurações */}
            <NavItem
              to="/settings"
              $isActive={location.pathname === '/settings'}
              $isCollapsed={isCollapsed}
              onClick={handleNavItemClick}
            >
              <FiSettings />
              <span>Configurações</span>
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