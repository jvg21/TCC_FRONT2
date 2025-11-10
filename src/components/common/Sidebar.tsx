import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import {
  FiHome, FiBriefcase, FiUsers, FiGrid, FiFolderPlus, FiCheckSquare, FiFile,
  FiSettings, FiMenu, FiX, FiChevronRight, FiLink2, FiClipboard, FiBarChart2,
} from 'react-icons/fi';
import { useAuthContext } from '../../context/AuthContext';
import { useTypedTranslation } from '../../context/LanguageContext';
import { useThemeContext } from '../../context/ThemeContext';
import type { Theme } from '../../styles/theme';


const parseHex = (hex: string) => {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
  return { r, g, b };
};
const alpha = (color: string, a: number) => {
  if (!color) return `rgba(0,0,0,${a})`;
  if (color.startsWith('#')) {
    const { r, g, b } = parseHex(color);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  if (color.startsWith('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${a})`);
  }
  return color;
};


const COLLAPSED_W = 78;
const EXPANDED_W = 264;

const Wrap = styled.aside<{ $isCollapsed: boolean,theme:Theme }>`
  position: fixed;
  inset: 0 auto 0 0;
  height: 100vh;
  width: ${({ $isCollapsed }) => ($isCollapsed ? `${COLLAPSED_W}px` : `${EXPANDED_W}px`)};
  ${({ theme }) => {
    const glass = theme.colors.background;
    const border = alpha(theme.colors.border, theme.isDark ? 0.35 : 0.45);
    const shadow = theme.isDark ? '0 12px 30px rgba(0,0,0,.35)' : '0 12px 30px rgba(0,0,0,.08)';
    return `
      background: ${glass};
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-right: 1px solid ${border};
      box-shadow: ${shadow};
    `;
  }}
  transition: width .28s cubic-bezier(.4,0,.2,1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    transform: ${({ $isCollapsed }) => ($isCollapsed ? 'translateX(-100%)' : 'translateX(0)')};
    width: ${EXPANDED_W}px;
  }
`;

const Header = styled.div<{ $isCollapsed: boolean }>`
  padding: 18px 16px;
  border-bottom: 1px solid ${({ theme }) => alpha(theme.colors.border, theme.isDark ? .25 : .35)};
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'space-between')};
  min-height: 68px;
`;

const Logo = styled.div<{ $isCollapsed: boolean }>`
  display: flex; align-items: center; gap: 12px;
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  transition: opacity .2s ease;
  h2 { font-size: 17px; font-weight: 800; letter-spacing: .2px; color: ${({ theme }) => theme.colors.text}; margin: 0; }
`;

const LogoIcon = styled.div`
  width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center;
  color: white; font-weight: 900; font-size: 18px; flex-shrink: 0;
  ${({ theme }) => `
    background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${alpha(theme.colors.primary, .85)} 100%);
    box-shadow: 0 8px 18px ${alpha(theme.colors.primary, .28)};
  `}
`;

const ToggleButton = styled.button`
  ${({ theme }) => `
    background: ${alpha(theme.colors.surface, theme.isDark ? .24 : .7)};
    border: 1px solid ${alpha(theme.colors.border, theme.isDark ? .35 : .5)};
    color: ${theme.colors.muted};
  `}
  cursor: pointer; padding: 8px; border-radius: 10px; display: grid; place-items: center;
  transition: all .2s ease;
  &:hover { ${({ theme }) => `background: ${alpha(theme.colors.primary, .12)}; color: ${theme.colors.primary}; border-color: ${alpha(theme.colors.primary, .35)};`} }
`;

const MobileToggle = styled.button`
  position: fixed; top: 18px; left: 18px; z-index: 1001;
  width: 44px; height: 44px; border-radius: 14px; display: grid; place-items: center;
  border: none; cursor: pointer;
  ${({ theme }) => `background: ${theme.colors.primary}; color:#fff; box-shadow: 0 10px 24px ${alpha(theme.colors.primary, .35)};`}
  @media (min-width: 769px) { display: none; }
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 14px 0 10px;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { ${({ theme }) => `background: ${alpha(theme.colors.border, theme.isDark ? .5 : .7)}; border-radius: 999px;`} }
`;

const SectionLabel = styled.div<{ $isCollapsed?: boolean }>`
  padding: ${({ $isCollapsed }) => ($isCollapsed ? '10px 0 6px' : '10px 18px 6px')};
  font-size: 11px; text-transform: uppercase; letter-spacing: .12em;
  ${({ theme }) => `color: ${alpha(theme.colors.muted, theme.isDark ? .9 : .6)};`}
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  transition: opacity .2s ease;
`;

const NavGroup = styled.div<{ $isCollapsed?: boolean }>`
  padding: ${({ $isCollapsed }) => ($isCollapsed ? '0 10px' : '0 12px')};
  &:not(:last-child) { margin-bottom: 10px; }
`;

const BaseItem = `
  position: relative; display: flex; align-items: center; gap: 12px;
  padding: 12px 14px; border-radius: 12px; text-decoration: none;
  font-size: 14px; transition: all .18s ease; margin: 4px 4px; overflow: hidden;
  &::after{ content:''; position:absolute; inset:0; background: currentColor; opacity:0; transition: opacity .25s ease; }
  &:hover::after{ opacity:.06; }
`;

const ActiveBar = styled.span`
  position: absolute; left: 6px; top: 8px; bottom: 8px; width: 3px; border-radius: 3px;
  ${({ theme }) => `background: ${theme.colors.primary};`}
`;

const NavItem = styled(Link)<{ $isActive: boolean; $isCollapsed: boolean }>`
  ${BaseItem};
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'flex-start')};
  ${({ theme, $isActive }) => `
    color: ${$isActive ? theme.colors.primary : theme.colors.muted};
    background: ${$isActive ? alpha(theme.colors.primary, .14) : 'transparent'};
    ${$isActive ? `box-shadow: inset 0 0 0 1px ${alpha(theme.colors.primary, .12)};` : ''}
  `}
  font-weight: ${({ $isActive }) => ($isActive ? 700 : 500)};
  svg { width: 20px; height: 20px; flex-shrink: 0; }
  span { ${({ $isCollapsed }) => ($isCollapsed ? 'display:none;' : 'display:inline;')} white-space: nowrap; }
  &:hover { ${({ theme }) => `color: ${theme.colors.primary}; background: ${alpha(theme.colors.primary, .1)};`} }
`;

const DropdownContainer = styled.div` margin-bottom: 4px; `;

const DropdownTrigger = styled.button<{
  $isActive: boolean; $isCollapsed: boolean; $isOpen: boolean;
}>`
  ${BaseItem};
  width: 100%; border: none; cursor: pointer;
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'space-between')};
  ${({ theme, $isActive }) => `
    background: ${$isActive ? alpha(theme.colors.primary, .14) : 'transparent'};
    color: ${$isActive ? theme.colors.primary : theme.colors.muted};
  `}
  font-weight: ${({ $isActive }) => ($isActive ? 700 : 500)};
  span { ${({ $isCollapsed }) => ($isCollapsed ? 'display:none;' : 'display:inline;')} white-space: nowrap; }
  &:hover { ${({ theme }) => `background: ${alpha(theme.colors.primary, .1)}; color: ${theme.colors.primary};`} }
`;

const ChevronIcon = styled.div<{ $isCollapsed: boolean; $isOpen: boolean }>`
  margin-left: auto;
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(90deg)' : 'rotate(0deg)')};
  transition: transform .2s ease, opacity .2s ease;
  svg { width: 14px; height: 14px; }
`;

const DropdownContent = styled.div<{ $isOpen: boolean; $isCollapsed: boolean }>`
  max-height: ${({ $isOpen, $isCollapsed }) => ($isOpen && !$isCollapsed ? '280px' : '0')};
  opacity: ${({ $isOpen, $isCollapsed }) => ($isOpen && !$isCollapsed ? 1 : 0)};
  overflow: hidden; transition: all .25s ease;
  margin-left: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '36px')}; margin-top: 2px;
`;

const DropdownItem = styled(Link)<{ $isActive: boolean }>`
  display: flex; align-items: center; padding: 9px 12px; border-radius: 10px; text-decoration: none;
  font-size: 13px; transition: all .18s ease; margin: 2px 0;
  ${({ theme, $isActive }) => `
    color: ${$isActive ? theme.colors.primary : theme.colors.muted};
    background: ${$isActive ? alpha(theme.colors.primary, .12) : 'transparent'};
    font-weight: ${$isActive ? 700 : 500};
  `}
  &:hover { ${({ theme }) => `background: ${alpha(theme.colors.primary, .1)}; color: ${theme.colors.primary};`} }
`;

const Overlay = styled.div<{ $isVisible: boolean }>`
  @media (max-width: 768px) {
    position: fixed; inset: 0; z-index: 999;
    background: rgba(0,0,0,.5);
    opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
    visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
    transition: all .25s ease;
  }
`;

const ContentShifter = styled.div<{ $isCollapsed: boolean }>`
  margin-left: ${({ $isCollapsed }) => ($isCollapsed ? `${COLLAPSED_W}px` : `${EXPANDED_W}px`)};
  transition: margin-left .28s cubic-bezier(.4,0,.2,1);
  min-height: 100vh;
  @media (max-width: 768px) { margin-left: 0; }
`;


const Flyout = styled.div<{ top: number }>`
  position: fixed;
  left: ${COLLAPSED_W + 8}px;
  top: ${({ top }) => `${top}px`};
  min-width: 220px;
  border-radius: 12px;
  padding: 6px;
  z-index: 1002;
  ${({ theme }) => `
    background: ${alpha(theme.colors.surface, theme.isDark ? .98 : .98)};
    border: 1px solid ${alpha(theme.colors.border, theme.isDark ? .35 : .45)};
    box-shadow: ${theme.isDark ? '0 14px 32px rgba(0,0,0,.45)' : '0 14px 32px rgba(0,0,0,.12)'};
  `}
`;

const FlyoutItem = styled(Link)`
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 10px; text-decoration: none; font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  &:hover { ${({ theme }) => `background: ${alpha(theme.colors.primary, .1)}; color: ${theme.colors.primary};`}}
`;


interface SidebarProps { children?: React.ReactNode; }

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [profile, setProfile] = useState<number>(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [integrationsOpen, setIntegrationsOpen] = useState(false);
  const [foldersOpen, setFoldersOpen] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(false);

  const [foldersFly, setFoldersFly] = useState<{ open: boolean; top: number }>({ open: false, top: 0 });
  const [tasksFly, setTasksFly] = useState<{ open: boolean; top: number }>({ open: false, top: 0 });
  const [integrationsFly, setIntegrationsFly] = useState<{ open: boolean; top: number }>({ open: false, top: 0 });

  const foldersBtnRef = useRef<HTMLButtonElement | null>(null);
  const tasksBtnRef = useRef<HTMLButtonElement | null>(null);
  const integrationsBtnRef = useRef<HTMLButtonElement | null>(null);

  const foldersFlyRef = useRef<HTMLDivElement | null>(null);
  const tasksFlyRef = useRef<HTMLDivElement | null>(null);
  const integrationsFlyRef = useRef<HTMLDivElement | null>(null);

  const {theme} = useThemeContext();

  const { user } = useAuthContext();
  const { t } = useTypedTranslation();
  const location = useLocation();

  useEffect(() => { setProfile(user?.Profile || 0); }, [user]);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile && !document.body.hasAttribute('data-sidebar-initialized')) {
        setIsCollapsed(true);
        document.body.setAttribute('data-sidebar-initialized', 'true');
      }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  
  useEffect(() => {
    setFoldersFly({ open: false, top: 0 });
    setTasksFly({ open: false, top: 0 });
    setIntegrationsFly({ open: false, top: 0 });
  }, [location.pathname]);

  
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAllFlyouts(); };

    const onDocDown = (e: MouseEvent) => {
      const path = (e.composedPath && e.composedPath()) as Node[] | undefined;
      const inTriggers = [foldersBtnRef.current, tasksBtnRef.current, integrationsBtnRef.current]
        .some(el => el && path?.includes(el));
      const inFlyouts = [foldersFlyRef.current, tasksFlyRef.current, integrationsFlyRef.current]
        .some(el => el && path?.includes(el));
      if (!inTriggers && !inFlyouts) {
        closeAllFlyouts();
      }
    };

    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDocDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDocDown);
    };
  }, []);

  const closeAllFlyouts = () => {
    setFoldersFly(f => ({ ...f, open: false }));
    setTasksFly(f => ({ ...f, open: false }));
    setIntegrationsFly(f => ({ ...f, open: false }));
  };

  const isIntegrationsActive = location.pathname.startsWith('/integrations');
  const isOpenAIActive = location.pathname === '/integrations/openai';
  const isFoldersActive = location.pathname === '/folder' || location.pathname === '/CascadeView';
  const isTasksActive = location.pathname === '/task' || location.pathname === '/TaskBoardPage' || location.pathname === '/TaskDashboard';

  const navigationItems = [
    { path: '/', label: t('navigation.home'), icon: FiHome, show: true },
    { path: '/companies', label: t('navigation.companies'), icon: FiBriefcase, show: profile === 1 },
    { path: '/user', label: t('navigation.users'), icon: FiUsers, show: profile <= 2 },
    { path: '/group', label: t('navigation.groups'), icon: FiGrid, show: profile >= 2 },
    { path: '/document', label: t('navigation.documents'), icon: FiFile, show: profile >= 2 },
    { path: '/templates', label: t('navigation.templates'), icon: FiClipboard, show: profile === 1 },
  ];

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const handleOverlayClick = () => { if (isMobile) setIsCollapsed(true); };
  const handleNavItemClick = () => { if (isMobile) setIsCollapsed(true); };

  
  const toggleIntegrationsDropdown = () => { if (!isCollapsed) setIntegrationsOpen(!integrationsOpen); };
  const handleIntegrationsClick = () => (isCollapsed ? openFlyout('integrations') : toggleIntegrationsDropdown());

  const toggleFoldersDropdown = () => { if (!isCollapsed) setFoldersOpen(!foldersOpen); };
  const handleFoldersClick = () => (isCollapsed ? openFlyout('folders') : toggleFoldersDropdown());

  const toggleTasksDropdown = () => { if (!isCollapsed) setTasksOpen(!tasksOpen); };
  const handleTasksClick = () => (isCollapsed ? openFlyout('tasks') : toggleTasksDropdown());

  const openFlyout = (type: 'folders' | 'tasks' | 'integrations') => {
    const btnRef =
      type === 'folders' ? foldersBtnRef.current :
      type === 'tasks' ? tasksBtnRef.current :
      integrationsBtnRef.current;

    if (!btnRef) return;
    const rect = btnRef.getBoundingClientRect();
    let top = Math.round(rect.top);

    
    const setOpen = () => {
      if (type === 'folders') setFoldersFly({ open: true, top });
      if (type === 'tasks') setTasksFly({ open: true, top });
      if (type === 'integrations') setIntegrationsFly({ open: true, top });
      requestAnimationFrame(() => {
        const fly = type === 'folders' ? foldersFlyRef.current : type === 'tasks' ? tasksFlyRef.current : integrationsFlyRef.current;
        if (fly) {
          const h = fly.getBoundingClientRect().height;
          const maxTop = window.innerHeight - h - 8;
          if (top > maxTop) {
            const newTop = Math.max(8, maxTop);
            if (type === 'folders') setFoldersFly({ open: true, top: newTop });
            if (type === 'tasks') setTasksFly({ open: true, top: newTop });
            if (type === 'integrations') setIntegrationsFly({ open: true, top: newTop });
          }
        }
      });
    };
    setOpen();
  };

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
              {/* <LogoIcon>D</LogoIcon> */}
              <h2>Documentin</h2>
            </Logo>
          )}
          {/* {isCollapsed && <LogoIcon>D</LogoIcon>} */}
          <ToggleButton onClick={toggleSidebar}>
            {isCollapsed ? <FiMenu size={18} /> : <FiX size={18} />}
          </ToggleButton>
        </Header>

        <Navigation>
          {}
          <SectionLabel $isCollapsed={isCollapsed}>{t('navigation.main') || 'Principal'}</SectionLabel>
          <NavGroup $isCollapsed={isCollapsed}>
            {navigationItems.filter(i => i.show).map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <NavItem
                  key={path}
                  to={path}
                  $isActive={active}
                  $isCollapsed={isCollapsed}
                  onClick={handleNavItemClick}
                >
                  {active && <ActiveBar />}
                  <Icon />
                  <span>{label}</span>
                </NavItem>
              );
            })}
          </NavGroup>

          {}
          {profile >= 2 && profile > 0 && (
            <>
              {!isCollapsed && <SectionLabel>{t('navigation.folders') || 'Pastas'}</SectionLabel>}
              <NavGroup $isCollapsed={isCollapsed}>
                {isCollapsed ? (
                  <DropdownTrigger
                    ref={foldersBtnRef}
                    as="button"
                    $isActive={isFoldersActive}
                    $isCollapsed={isCollapsed}
                    $isOpen={foldersFly.open}
                    onClick={() => openFlyout('folders')}
                    aria-haspopup="menu"
                    aria-expanded={foldersFly.open}
                    title={t('navigation.folders')}
                  >
                    <FiFolderPlus />
                  </DropdownTrigger>
                ) : (
                  <DropdownContainer>
                    <DropdownTrigger
                      $isActive={isFoldersActive}
                      $isCollapsed={isCollapsed}
                      $isOpen={foldersOpen}
                      onClick={handleFoldersClick}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <FiFolderPlus /><span>{t('navigation.folders')}</span>
                      </div>
                      <ChevronIcon $isCollapsed={isCollapsed} $isOpen={foldersOpen}>
                        <FiChevronRight />
                      </ChevronIcon>
                    </DropdownTrigger>
                    <DropdownContent $isOpen={foldersOpen} $isCollapsed={isCollapsed}>
                      <DropdownItem to="/folder" $isActive={location.pathname === '/folder'}>
                        {t('navigation.folders')}
                      </DropdownItem>
                      <DropdownItem to="/CascadeView" $isActive={location.pathname === '/CascadeView'}>
                        {t('navigation.cascadeview')}
                      </DropdownItem>
                    </DropdownContent>
                  </DropdownContainer>
                )}
              </NavGroup>
            </>
          )}

          {}
          {profile >= 2 && profile > 0 && (
            <>
              {!isCollapsed && <SectionLabel>{t('navigation.tasks') || 'Tarefas'}</SectionLabel>}
              <NavGroup $isCollapsed={isCollapsed}>
                {isCollapsed ? (
                  <DropdownTrigger
                    ref={tasksBtnRef}
                    as="button"
                    $isActive={isTasksActive}
                    $isCollapsed={isCollapsed}
                    $isOpen={tasksFly.open}
                    onClick={() => openFlyout('tasks')}
                    aria-haspopup="menu"
                    aria-expanded={tasksFly.open}
                    title={t('navigation.tasks')}
                  >
                    <FiCheckSquare />
                  </DropdownTrigger>
                ) : (
                  <DropdownContainer>
                    <DropdownTrigger
                      $isActive={isTasksActive}
                      $isCollapsed={isCollapsed}
                      $isOpen={tasksOpen}
                      onClick={handleTasksClick}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <FiCheckSquare /><span>{t('navigation.tasks')}</span>
                      </div>
                      <ChevronIcon $isCollapsed={isCollapsed} $isOpen={tasksOpen}>
                        <FiChevronRight />
                      </ChevronIcon>
                    </DropdownTrigger>
                    <DropdownContent $isOpen={tasksOpen} $isCollapsed={isCollapsed}>
                      <DropdownItem to="/task" $isActive={location.pathname === '/task'}>
                        {t('navigation.tasks')}
                      </DropdownItem>
                      <DropdownItem to="/TaskBoardPage" $isActive={location.pathname === '/TaskBoardPage'}>
                        {t('navigation.taskboard')}
                      </DropdownItem>
                      <DropdownItem to="/TaskDashboard" $isActive={location.pathname === '/TaskDashboard'}>
                        {t('navigation.taskdashboard')}
                      </DropdownItem>
                    </DropdownContent>
                  </DropdownContainer>
                )}
              </NavGroup>
            </>
          )}

          {}
          {profile === 2 && (
            <>
              {!isCollapsed && <SectionLabel>{t('navigation.integrations') || 'Integrações'}</SectionLabel>}
              <NavGroup $isCollapsed={isCollapsed}>
                {isCollapsed ? (
                  <DropdownTrigger
                    ref={integrationsBtnRef}
                    as="button"
                    $isActive={isIntegrationsActive}
                    $isCollapsed={isCollapsed}
                    $isOpen={integrationsFly.open}
                    onClick={() => openFlyout('integrations')}
                    aria-haspopup="menu"
                    aria-expanded={integrationsFly.open}
                    title={t('navigation.integrations')}
                  >
                    <FiLink2 />
                  </DropdownTrigger>
                ) : (
                  <DropdownContainer>
                    <DropdownTrigger
                      $isActive={isIntegrationsActive}
                      $isCollapsed={isCollapsed}
                      $isOpen={integrationsOpen}
                      onClick={handleIntegrationsClick}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <FiLink2 /><span>{t('navigation.integrations')}</span>
                      </div>
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
                )}
              </NavGroup>
            </>
          )}

          {}
          <SectionLabel $isCollapsed={isCollapsed}>{t('navigation.more') || 'Mais'}</SectionLabel>
          <NavGroup $isCollapsed={isCollapsed}>
            {profile === 2 && (
              <NavItem
                to="/ReportsPage"
                $isActive={location.pathname === '/ReportsPage'}
                $isCollapsed={isCollapsed}
                onClick={handleNavItemClick}
              >
                {location.pathname === '/ReportsPage' && <ActiveBar />}
                <FiBarChart2 />
                <span>{t('navigation.reports')}</span>
              </NavItem>
            )}

            <NavItem
              to="/settings"
              $isActive={location.pathname === '/settings'}
              $isCollapsed={isCollapsed}
              onClick={handleNavItemClick}
            >
              {location.pathname === '/settings' && <ActiveBar />}
              <FiSettings />
              <span>{t('navigation.settings')}</span>
            </NavItem>
          </NavGroup>
        </Navigation>
      </Wrap>

      {}
      {isCollapsed && foldersFly.open && (
        <Flyout ref={foldersFlyRef} top={foldersFly.top} role="menu" aria-label={t('navigation.folders')}>
          <FlyoutItem to="/folder" onClick={() => setTimeout(() => setFoldersFly({ open: false, top: 0 }), 0)}>
            {t('navigation.folders')}
          </FlyoutItem>
          <FlyoutItem to="/CascadeView" onClick={() => setTimeout(() => setFoldersFly({ open: false, top: 0 }), 0)}>
            {t('navigation.cascadeview')}
          </FlyoutItem>
        </Flyout>
      )}
      {isCollapsed && tasksFly.open && (
        <Flyout ref={tasksFlyRef} top={tasksFly.top} role="menu" aria-label={t('navigation.tasks')}>
          <FlyoutItem to="/task" onClick={() => setTimeout(() => setTasksFly({ open: false, top: 0 }), 0)}>
            {t('navigation.tasks')}
          </FlyoutItem>
          <FlyoutItem to="/TaskBoardPage" onClick={() => setTimeout(() => setTasksFly({ open: false, top: 0 }), 0)}>
            {t('navigation.taskboard')}
          </FlyoutItem>
          <FlyoutItem to="/TaskDashboard" onClick={() => setTimeout(() => setTasksFly({ open: false, top: 0 }), 0)}>
            {t('navigation.taskdashboard')}
          </FlyoutItem>
        </Flyout>
      )}
      {isCollapsed && profile === 2 && integrationsFly.open && (
        <Flyout ref={integrationsFlyRef} top={integrationsFly.top} role="menu" aria-label={t('navigation.integrations')}>
          <FlyoutItem to="/integrations/openai" onClick={() => setTimeout(() => setIntegrationsFly({ open: false, top: 0 }), 0)}>
            OpenAI
          </FlyoutItem>
        </Flyout>
      )}

      <ContentShifter $isCollapsed={isCollapsed}>{children}</ContentShifter>
    </>
  );
};

export default Sidebar;

