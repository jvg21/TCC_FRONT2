import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiHome,
  FiBriefcase,
  FiUsers,
  FiGrid,
  FiFolderPlus,
  FiCheckSquare,
  FiFile,
  FiSettings,
  FiMenu,
  FiX,
  FiChevronRight,
  FiLink2,
  FiClipboard,
  FiBarChart2,
} from 'react-icons/fi';
import { useAuthContext } from '../../context/AuthContext';
import { useTypedTranslation } from '../../context/LanguageContext';

const Wrap = styled.aside<{ $isCollapsed: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${({ $isCollapsed }) => ($isCollapsed ? '80px' : '260px')};
  background: ${({ theme }) => theme.colors.background};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  @media (max-width: 768px) {
    transform: ${({ $isCollapsed }) =>
    $isCollapsed ? 'translateX(-100%)' : 'translateX(0)'};
    width: 260px;
  }
`;

const Header = styled.div<{ $isCollapsed: boolean }>`
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) =>
    $isCollapsed ? 'center' : 'space-between'};
  min-height: 70px;
`;

const Logo = styled.div<{ $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  transition: opacity 0.3s ease;
  
  h2 {
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary}10;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const MobileToggle = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 2px;
  }
`;

const NavGroup = styled.div<{ $isCollapsed?: boolean }>`
  padding: ${({ $isCollapsed }) => ($isCollapsed ? '0 12px' : '0 16px')};
  
  &:not(:last-child) {
    margin-bottom: 24px;
  }
`;

const NavItem = styled(Link) <{
  $isActive: boolean;
  $isCollapsed: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) =>
    $isCollapsed ? "center" : "flex-start"};
  gap: ${({ $isCollapsed }) => ($isCollapsed ? "0" : "12px")};
  padding: 12px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.muted};
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary + "15" : "transparent"};
  font-weight: ${({ $isActive }) => ($isActive ? "600" : "500")};
  font-size: 14px;
  transition: all 0.2s ease;
  margin-bottom: 4px;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  span {
    ${({ $isCollapsed }) =>
    $isCollapsed
      ? `display: none;`
      : `display: inline; opacity: 1; white-space: nowrap;`}
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary}10;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const DropdownContainer = styled.div`
  margin-bottom: 4px;
`;

const DropdownTrigger = styled.button<{
  $isActive: boolean;
  $isCollapsed: boolean;
  $isOpen: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) =>
    $isCollapsed ? "center" : "space-between"};
  gap: ${({ $isCollapsed }) => ($isCollapsed ? "0" : "12px")};
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary + "15" : "transparent"};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.muted};
  font-weight: ${({ $isActive }) => ($isActive ? "600" : "500")};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  position: relative;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  span {
    ${({ $isCollapsed }) =>
    $isCollapsed
      ? `display: none;`
      : `display: inline; opacity: 1; white-space: nowrap;`}
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary}10;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ChevronIcon = styled.div<{ $isCollapsed: boolean; $isOpen: boolean }>`
  margin-left: auto;
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(90deg)' : 'rotate(0deg)')};
  transition: all 0.3s ease;
  
  svg {
    width: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '14px')};
    height: 14px;
    overflow: hidden;
  }
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

const DropdownItem = styled(Link) <{ $isActive: boolean }>`
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
  const [foldersOpen, setFoldersOpen] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(false);

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

      if (mobile && !document.body.hasAttribute('data-sidebar-initialized')) {
        setIsCollapsed(true);
        document.body.setAttribute('data-sidebar-initialized', 'true');
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const isIntegrationsActive = location.pathname.startsWith('/integrations');
  const isOpenAIActive = location.pathname === '/integrations/openai';
  const isFoldersActive = location.pathname === '/folder' || location.pathname === '/CascadeView';
  const isTasksActive = location.pathname === '/task' || location.pathname === '/TaskBoardPage' || location.pathname === '/TaskDashboard';

  const navigationItems = [
    { path: "/", label: t("navigation.home"), icon: FiHome, show: true },
    { path: "/companies", label: t("navigation.companies"), icon: FiBriefcase, show: profile === 1 },
    { path: "/user", label: t("navigation.users"), icon: FiUsers, show: profile <= 2 },
    { path: "/group", label: t("navigation.groups"), icon: FiGrid, show: profile >= 2 },
    { path: "/document", label: t("navigation.documents"), icon: FiFile, show: profile >= 2 },
    { path: "/templates", label: t("navigation.templates"), icon: FiClipboard, show: profile === 1 },
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
      handleNavItemClick();
    } else {
      toggleIntegrationsDropdown();
    }
  };

  const toggleFoldersDropdown = () => {
    if (!isCollapsed) {
      setFoldersOpen(!foldersOpen);
    }
  };

  const handleFoldersClick = () => {
    if (isCollapsed) {
      handleNavItemClick();
    } else {
      toggleFoldersDropdown();
    }
  };

  const toggleTasksDropdown = () => {
    if (!isCollapsed) {
      setTasksOpen(!tasksOpen);
    }
  };

  const handleTasksClick = () => {
    if (isCollapsed) {
      handleNavItemClick();
    } else {
      toggleTasksDropdown();
    }
  };

  useEffect(() => {
    if (isIntegrationsActive && !isCollapsed) {
      setIntegrationsOpen(true);
    }
  }, [isIntegrationsActive, isCollapsed]);

  useEffect(() => {
    if (isFoldersActive && !isCollapsed) {
      setFoldersOpen(true);
    }
  }, [isFoldersActive, isCollapsed]);

  useEffect(() => {
    if (isTasksActive && !isCollapsed) {
      setTasksOpen(true);
    }
  }, [isTasksActive, isCollapsed]);

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
          <NavGroup $isCollapsed={isCollapsed}>
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

            {profile >= 2 && profile > 0 && (isCollapsed ? (
              <NavItem
                to="/folder"
                $isActive={isFoldersActive}
                $isCollapsed={isCollapsed}
                onClick={handleNavItemClick}
                data-tooltip={t("navigation.folders")}
              >
                <FiFolderPlus />
                <span>{t("navigation.folders")}</span>
              </NavItem>
            ) : (
              <DropdownContainer>
                <DropdownTrigger
                  $isActive={isFoldersActive}
                  $isCollapsed={isCollapsed}
                  $isOpen={foldersOpen}
                  onClick={handleFoldersClick}
                  data-tooltip={t("navigation.folders")}
                >
                  <FiFolderPlus />
                  <span>{t("navigation.folders")}</span>
                  <ChevronIcon $isCollapsed={isCollapsed} $isOpen={foldersOpen}>
                    <FiChevronRight />
                  </ChevronIcon>
                </DropdownTrigger>
                <DropdownContent $isOpen={foldersOpen} $isCollapsed={isCollapsed}>
                  <DropdownItem to="/folder" $isActive={location.pathname === '/folder'}>
                    {t("navigation.folders")}
                  </DropdownItem>
                  <DropdownItem to="/CascadeView" $isActive={location.pathname === '/CascadeView'}>
                    {t("navigation.cascadeview")}
                  </DropdownItem>
                </DropdownContent>
              </DropdownContainer>
            ))}

            {profile >= 2 && profile > 0 && (isCollapsed ? (
              <NavItem
                to="/task"
                $isActive={isTasksActive}
                $isCollapsed={isCollapsed}
                onClick={handleNavItemClick}
                data-tooltip={t("navigation.tasks")}
              >
                <FiCheckSquare />
                <span>{t("navigation.tasks")}</span>
              </NavItem>
            ) : (
              <DropdownContainer>
                <DropdownTrigger
                  $isActive={isTasksActive}
                  $isCollapsed={isCollapsed}
                  $isOpen={tasksOpen}
                  onClick={handleTasksClick}
                  data-tooltip={t("navigation.tasks")}
                >
                  <FiCheckSquare />
                  <span>{t("navigation.tasks")}</span>
                  <ChevronIcon $isCollapsed={isCollapsed} $isOpen={tasksOpen}>
                    <FiChevronRight />
                  </ChevronIcon>
                </DropdownTrigger>
                <DropdownContent $isOpen={tasksOpen} $isCollapsed={isCollapsed}>
                  <DropdownItem to="/task" $isActive={location.pathname === '/task'}>
                    {t("navigation.tasks")}
                  </DropdownItem>
                  <DropdownItem to="/TaskBoardPage" $isActive={location.pathname === '/TaskBoardPage'}>
                    {t("navigation.taskboard")}
                  </DropdownItem>
                  <DropdownItem to="/TaskDashboard" $isActive={location.pathname === '/TaskDashboard'}>
                    {t("navigation.taskdashboard")}
                  </DropdownItem>
                </DropdownContent>
              </DropdownContainer>
            ))}

            {profile === 2 && (
              isCollapsed ? (
                <NavItem
                  to="/integrations"
                  $isActive={isIntegrationsActive}
                  $isCollapsed={isCollapsed}
                  onClick={handleNavItemClick}
                  data-tooltip={t("navigation.integrations")}
                >
                  <FiLink2 />
                  <span>{t("navigation.integrations")}</span>
                </NavItem>
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
                    <ChevronIcon $isCollapsed={isCollapsed} $isOpen={integrationsOpen}>
                      <FiChevronRight />
                    </ChevronIcon>
                  </DropdownTrigger>
                  <DropdownContent $isOpen={integrationsOpen} $isCollapsed={isCollapsed}>
                    <DropdownItem to="/integrations/openai" $isActive={isOpenAIActive}>
                      OpenAI
                    </DropdownItem>
                  </DropdownContent>
                </DropdownContainer>
              )
            )}

            {profile === 2 && (
              <NavItem to="/ReportsPage"
                $isActive={location.pathname === '/ReportsPage'}
                $isCollapsed={isCollapsed}
                onClick={handleNavItemClick}
                data-tooltip={t("navigation.reports")}
              >
                <FiBarChart2 />
                <span>{t("navigation.reports")}</span>
              </NavItem>
            )}
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
