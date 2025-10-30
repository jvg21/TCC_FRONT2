import styled from "styled-components";


export const ActionsBar = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    & > * {
      width: 100%;
    }
    button, a {
      width: 100%;
      justify-content: center;
    }
  }
`;

export const DropdownContainer = styled.div`
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 110%;
  right: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  z-index: 10;
  min-width: 180px;
  padding: 4px 0;

  @media (max-width: 768px) {
    position: static;
    width: 100%;
    min-width: unset;
    box-shadow: none;
  }
`;

export const DropdownItemButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #f5f5f5;
  }
`;

export const VersionSidebar = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: ${props => props.isOpen ? '0' : '-400px'};
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 8px rgba(0,0,0,0.1);
  transition: right 0.3s ease;
  z-index: 1000;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    right: ${props => props.isOpen ? '0' : '-100%'};
  }
`;

export const SidebarOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 999;
`;

export const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SidebarTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: #f0f0f0;
    color: #333;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const SidebarContent = styled.div`
  padding: 16px;
`;

export const VersionSection = styled.div`
  margin-bottom: 24px;
`;

export const SectionLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
  font-weight: 500;
`;

export const VersionItem = styled.div`
  padding: 16px;
  border: 2px solid #1a73e8;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 12px;

  &:hover {
    background: #f0f7ff;
    border-color: #0d47a1;
    transform: translateX(-4px);
    box-shadow: 0 2px 8px rgba(26, 115, 232, 0.2);
  }

  &:active {
    transform: translateX(-2px);
  }
`;

export const VersionDate = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
`;

export const VersionBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: #e8f0fe;
  color: #1a73e8;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 8px;
`;

export const VersionAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #5f6368;
  font-size: 13px;
  margin-top: 8px;
`;

export const AuthorIndicator = styled.div`
  width: 8px;
  height: 8px;
  background: #34a853;
  border-radius: 50%;
`;

export const CommentsScrollArea = styled.div`
  max-height: clamp(240px, 40vh, 520px);
  overflow-y: auto;
  padding-right: 4px;

  scrollbar-width: thin;
  scrollbar-color: #c2c2c2 transparent;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #c2c2c2;
    border-radius: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;