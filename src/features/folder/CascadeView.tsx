import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FiFolder, FiFile, FiChevronRight, FiChevronDown, FiPlus, FiFilter, FiChevronUp } from 'react-icons/fi';
import PageLayout from '../../components/common/PageLayout';
import { Button } from '../../components/common/Button';
import { useFolder } from './useFolder';
import { useDocument } from '../document/useDocument';


const CascadeContainer = styled.div`
  display: flex;
  height: calc(100vh - 120px);
  gap: 16px;
  padding: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    min-height: calc(100vh - 120px);
    padding: 8px;
    gap: 12px;
  }
`;

const FilterPanel = styled.div<{ $isCollapsed?: boolean }>`
  width: 280px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  height: fit-content;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    width: 100%;
    max-height: ${props => props.$isCollapsed ? '60px' : 'none'};
    overflow: hidden;
    padding: ${props => props.$isCollapsed ? '12px' : '16px'};
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    border-radius: 6px;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  
  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
  
  h3 {
    margin: 0;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${props => props.theme.colors.text};
  }
`;

const FilterToggle = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.hover || 'rgba(255, 255, 255, 0.05)'};
  }
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const FilterContent = styled.div<{ $isCollapsed?: boolean }>`
  @media (max-width: 768px) {
    display: ${props => props.$isCollapsed ? 'none' : 'block'};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  margin-bottom: 12px;
  font-size: 14px;
  box-sizing: border-box;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary || 'rgba(255, 255, 255, 0.5)'};
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.backgroundSecondary || props.theme.colors.background};
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
    padding: 10px 12px;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 16px;
  
  h4 {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: ${props => props.theme.colors.text};
  }
  
  @media (max-width: 768px) {
    margin-bottom: 12px;
    
    h4 {
      font-size: 13px;
    }
  }
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  cursor: pointer;
  font-size: 13px;
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;
  
  input {
    margin: 0;
    cursor: pointer;
    accent-color: ${props => props.theme.colors.primary};
  }
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: 768px) {
    padding: 6px 0;
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
    
    input {
      transform: scale(1.2);
    }
  }
`;

const TreeContainer = styled.div`
  flex: 1;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    width: 100%;
    min-height: 400px;
    padding: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 8px;
    border-radius: 6px;
    min-height: 350px;
  }
`;

const TreeNode = styled.div<{ $level: number; $isExpanded?: boolean }>`
  margin-left: ${props => Math.min(props.$level * 20, 100)}px;
  margin-bottom: 4px;
  
  @media (max-width: 768px) {
    margin-left: ${props => Math.min(props.$level * 15, 60)}px;
    margin-bottom: 2px;
  }
  
  @media (max-width: 480px) {
    margin-left: ${props => Math.min(props.$level * 12, 48)}px;
  }
`;

const NodeHeader = styled.div<{ $isFolder: boolean; $isSelected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: ${props => props.$isSelected ? `2px solid ${props.theme.colors.primary}` : '1px solid transparent'};
  background: ${props => props.$isSelected ? `${props.theme.colors.primary}15` : 'transparent'};
  color: ${props => props.theme.colors.text};
  
  &:hover {
    background: ${props => props.theme.colors.hover || props.theme.colors.backgroundSecondary || 'rgba(255, 255, 255, 0.05)'};
  }
  
  @media (max-width: 768px) {
    padding: 10px;
    gap: 6px;
  }
`;

const NodeIcon = styled.span`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const NodeTitle = styled.span<{ $isFolder: boolean }>`
  flex: 1;
  font-weight: ${props => props.$isFolder ? '500' : '400'};
  font-size: ${props => props.$isFolder ? '14px' : '13px'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => props.theme.colors.text};
  
  @media (max-width: 768px) {
    font-size: ${props => props.$isFolder ? '15px' : '14px'};
  }
`;

const NodeMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary || props.theme.colors.text};
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    gap: 6px;
    font-size: 11px;
  }
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const StatusBadge = styled.span<{ $status: 'active' | 'inactive' | 'valid' | 'invalid' | 'pending' }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  
  ${props => {
    const isDark = props.theme.mode === 'dark';

    switch (props.$status) {
      case 'active':
        return isDark ? `
          background: rgba(40, 167, 69, 0.2);
          color: #4ade80;
          border: 1px solid rgba(40, 167, 69, 0.3);
        ` : `
          background: #d4edda;
          color: #155724;
        `;
      case 'inactive':
        return isDark ? `
          background: rgba(220, 53, 69, 0.2);
          color: #f87171;
          border: 1px solid rgba(220, 53, 69, 0.3);
        ` : `
          background: #f8d7da;
          color: #721c24;
        `;
      case 'valid':
        return isDark ? `
          background: rgba(23, 162, 184, 0.2);
          color: #22d3ee;
          border: 1px solid rgba(23, 162, 184, 0.3);
        ` : `
          background: #d1ecf1;
          color: #0c5460;
        `;
      case 'invalid':
        return isDark ? `
          background: rgba(220, 53, 69, 0.2);
          color: #f87171;
          border: 1px solid rgba(220, 53, 69, 0.3);
        ` : `
          background: #f8d7da;
          color: #721c24;
        `;
      case 'pending':
        return isDark ? `
          background: rgba(255, 193, 7, 0.2);
          color: #fbbf24;
          border: 1px solid rgba(255, 193, 7, 0.3);
        ` : `
          background: #fff3cd;
          color: #856404;
        `;
      default:
        return '';
    }
  }}
  
  @media (max-width: 768px) {
    padding: 3px 6px;
    font-size: 10px;
  }
`;

const StatsBar = styled.div`
  display: flex;
  gap: 16px;
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary || 'rgba(255, 255, 255, 0.03)'};
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  
  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    font-size: 13px;
    padding: 10px;
  }
`;

const QuickSearch = styled.div`
  margin-bottom: 12px;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

export const CascadeView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { activeFolder, deactiveFolder } = useFolder();
  const { activeDocument, deactiveDocument } = useDocument();

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set([1, 2]));
  const [selectedNode, setSelectedNode] = useState<{ type: 'folder' | 'document'; id: number } | null>(null);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    showInactive: false,
    showValidated: true,
    showPending: true,
    showInvalid: true,
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);

      if (window.innerWidth <= 768) {
        setFiltersCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (err) {
        setError(err instanceof Error ? err.message : t('loading.error'));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [t]);

  const expandAllFolders = () => {
    const allFolderIds = new Set<number>();
    const addFolderIds = (folders: any[]) => {
      folders.forEach(folder => {
        allFolderIds.add(folder.FolderId);
        if (folder.children) {
          addFolderIds(folder.children);
        }
      });
    };
    addFolderIds(buildTree);
    setExpandedFolders(allFolderIds);
  };

  const collapseAllFolders = () => {
    setExpandedFolders(new Set());
  };

  const toggleFolder = (folderId: number) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  // ✅ CORREÇÃO APLICADA: Filtro de documentos corrigido
  const buildTree = useMemo(() => {
    const tree: any[] = [];
    const folderMap = new Map();

    const allFolders = filters.showInactive ? [...activeFolder, ...deactiveFolder] : activeFolder;
    const allDocuments = filters.showInactive ? [...activeDocument, ...deactiveDocument] : activeDocument;

    const filteredFolders = allFolders.filter(folder =>
      folder.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ✅ CORREÇÃO: Tratamento de documentos sem validação definida
    const filteredDocuments = allDocuments.filter(doc => {
      // Primeiro verifica se o título corresponde à busca
      if (!doc.Title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Se o documento não tem validação definida (undefined), considera como pendente
      const validationStatus = doc.isValid === undefined ? null : doc.isValid;

      // Aplica os filtros de validação
      return (
        (filters.showValidated && validationStatus === true) ||
        (filters.showPending && validationStatus === null) ||
        (filters.showInvalid && validationStatus === false)
      );
    });

    filteredFolders.forEach(folder => {
      folderMap.set(folder.FolderId, { ...folder, children: [], documents: [] });
    });

    filteredDocuments.forEach(doc => {
      const folder = folderMap.get(doc.FolderId);
      if (folder) {
        folder.documents.push(doc);
      }
    });

    folderMap.forEach(folder => {
      if (folder.ParentFolderId === null) {
        tree.push(folder);
      } else {
        const parent = folderMap.get(folder.ParentFolderId);
        if (parent) {
          parent.children.push(folder);
        } else {
          // Se o pai não existe no folderMap (usuário sem acesso ao pai), trata como raiz
          tree.push(folder);
        }
      }
    });

    return tree;
  }, [activeFolder, deactiveFolder, activeDocument, deactiveDocument, searchTerm, filters]);

  // ✅ NOVO: Auto-expandir todas as pastas ao carregar
  useEffect(() => {
    const collectFolderIds = (nodes: any[]): number[] => {
      const ids: number[] = [];

      nodes.forEach(node => {
        if (node.FolderId) {
          ids.push(node.FolderId);
        }
        if (node.children && node.children.length > 0) {
          ids.push(...collectFolderIds(node.children));
        }
      });

      return ids;
    };

    // Expande todas as pastas quando a árvore for construída
    if (buildTree.length > 0) {
      const allFolderIds = collectFolderIds(buildTree);
      setExpandedFolders(new Set(allFolderIds));
    }
  }, [buildTree]);

  const renderTreeNode = (node: any, level: number = 0): React.ReactNode => {
    const isFolder = 'FolderId' in node && 'Name' in node;

    if (isFolder) {
      const isExpanded = expandedFolders.has(node.FolderId);
      const isSelected = selectedNode?.type === 'folder' && selectedNode?.id === node.FolderId;

      return (
        <React.Fragment key={`folder-${node.FolderId}`}>
          <TreeNode $level={level}>
            <NodeHeader
              $isFolder={true}
              $isSelected={isSelected}
              onClick={() => {
                toggleFolder(node.FolderId);
                setSelectedNode({ type: 'folder', id: node.FolderId });
              }}
            >
              <NodeIcon onClick={(e) => { e.stopPropagation(); toggleFolder(node.FolderId); }}>
                {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
              </NodeIcon>
              <NodeIcon>
                <FiFolder size={16} color="#ffc107" />
              </NodeIcon>
              <NodeTitle $isFolder={true}>{node.Name}</NodeTitle>
              <NodeMeta>
                <StatusBadge $status={node.IsActive ? 'active' : 'inactive'}>
                  {node.IsActive ? t("cascadeview.active") : t("cascadeview.inactive")}
                </StatusBadge>
                <span>{(node.children?.length || 0) + (node.documents?.length || 0)} {t("cascadeview.items")}</span>
              </NodeMeta>
            </NodeHeader>
          </TreeNode>

          {isExpanded && (
            <>
              {node.children && node.children.map((child: any) => renderTreeNode(child, level + 1))}
              {node.documents && node.documents.map((doc: Document) => renderTreeNode(doc, level + 1))}
            </>
          )}
        </React.Fragment>
      );
    } else {
      const isSelected = selectedNode?.type === 'document' && selectedNode?.id === node.DocumentId;

      return (
        <TreeNode key={`doc-${node.DocumentId}`} $level={level}>
          <NodeHeader
            $isFolder={false}
            $isSelected={isSelected}
            onClick={() => {
              setSelectedNode({ type: 'document', id: node.DocumentId });
              // ✅ NAVEGAÇÃO ADICIONADA: Redireciona para a página do documento
              navigate(`/document/${node.DocumentId}`);
            }}
            style={{ cursor: 'pointer' }}
            title="Clique para abrir o documento"
          >
            <NodeIcon style={{ width: '16px' }} />
            <NodeIcon>
              <FiFile size={16} color="#17a2b8" />
            </NodeIcon>
            <NodeTitle $isFolder={false}>{node.Title}</NodeTitle>
            <NodeMeta>
              <StatusBadge $status={node.IsActive ? 'active' : 'inactive'}>
                {node.IsActive ? t("cascadeview.active") : t("cascadeview.inactive")}
              </StatusBadge>
              {node.isValid !== undefined && (
                <StatusBadge $status={
                  node.isValid === true ? 'valid' :
                    node.isValid === false ? 'invalid' : 'pending'
                }>
                  {node.isValid === true ? t("cascadeview.valid") :
                    node.isValid === false ? t("cascadeview.invalid") : t("cascadeview.pending")}
                </StatusBadge>
              )}
              <span title={`${t("cascadeview.created_on")} ${new Date(node.CreatedAt).toLocaleDateString()}`}>
                {new Date(node.CreatedAt).toLocaleDateString()}
              </span>
            </NodeMeta>
          </NodeHeader>
        </TreeNode>
      );
    }
  };

  return (
    <PageLayout
      title={t("cascadeview.title")}
      actions={
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            style={{
              minWidth: 'auto',
              padding: isMobile ? '8px' : '8px 16px'
            }}
          >
            <FiPlus />
            {!isMobile && <span style={{ marginLeft: '4px' }}>{t("cascadeview.new_folder")}</span>}
          </Button>
          <Button
            style={{
              minWidth: 'auto',
              padding: isMobile ? '8px' : '8px 16px'
            }}
          >
            <FiPlus />
            {!isMobile && <span style={{ marginLeft: '4px' }}>{t("cascadeview.new_document")}</span>}
          </Button>
        </div>
      }
    >
      <CascadeContainer>
        <FilterPanel $isCollapsed={filtersCollapsed}>
          <FilterHeader onClick={() => setFiltersCollapsed(!filtersCollapsed)}>
            <h3>
              <FiFilter size={16} />
              {t("cascadeview.filters")}
            </h3>
            <FilterToggle>
              {filtersCollapsed ? <FiChevronDown size={16} /> : <FiChevronUp size={16} />}
            </FilterToggle>
          </FilterHeader>

          <FilterContent $isCollapsed={filtersCollapsed}>
            <SearchInput
              type="text"
              placeholder={t("cascadeview.search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <FilterSection>
              <h4>{t("cascadeview.status")}</h4>
              <FilterOption>
                <input
                  type="checkbox"
                  checked={filters.showInactive}
                  onChange={(e) => setFilters(prev => ({ ...prev, showInactive: e.target.checked }))}
                />
                {t("cascadeview.show_inactive")}
              </FilterOption>
            </FilterSection>

            <FilterSection>
              <h4>{t("cascadeview.document_validation")}</h4>
              <FilterOption>
                <input
                  type="checkbox"
                  checked={filters.showValidated}
                  onChange={(e) => setFilters(prev => ({ ...prev, showValidated: e.target.checked }))}
                />
                {t("cascadeview.valid_documents")}
              </FilterOption>
              <FilterOption>
                <input
                  type="checkbox"
                  checked={filters.showPending}
                  onChange={(e) => setFilters(prev => ({ ...prev, showPending: e.target.checked }))}
                />
                {t("cascadeview.pending_validation")}
              </FilterOption>
              <FilterOption>
                <input
                  type="checkbox"
                  checked={filters.showInvalid}
                  onChange={(e) => setFilters(prev => ({ ...prev, showInvalid: e.target.checked }))}
                />
                {t("cascadeview.invalid_documents")}
              </FilterOption>
            </FilterSection>
          </FilterContent>
        </FilterPanel>

        <TreeContainer>
          {isMobile && (
            <QuickSearch>
              <SearchInput
                type="text"
                placeholder={t("cascadeview.quick_search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </QuickSearch>
          )}

          {isMobile && buildTree.length > 0 && (
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '12px',
              justifyContent: 'center'
            }}>
              <Button
                variant="primary"
                onClick={expandAllFolders}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {t("cascadeview.expand_all")}
              </Button>
              <Button
                variant="primary"
                onClick={collapseAllFolders}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {t("cascadeview.collapse_all")}
              </Button>
            </div>
          )}

          <div>
            <StatsBar>
              <span>📁 {t("cascadeview.folders")}: {buildTree.length}</span>
              <span>📄 {t("cascadeview.documents")}: {buildTree.reduce((acc, folder) => acc + (folder.documents?.length || 0), 0)}</span>
            </StatsBar>
            {buildTree.map(node => renderTreeNode(node))}
          </div>
        </TreeContainer>
      </CascadeContainer>
    </PageLayout>
  );
};

export default CascadeView;