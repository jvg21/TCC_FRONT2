

import React, { useState, useMemo, useEffect } from 'react';

import styled from 'styled-components';

import { useTranslation } from 'react-i18next';

// Interfaces
interface Document {
  DocumentId: number;
  Title: string;
  Content: string;
  FolderId: number;
  UserId: number;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  isValid?: boolean | null;
}

// Interfaces ajustadas para os tipos reais
interface Folder {
  FolderId: number;
  Name: string;
  ParentFolderId: number | null;
  UserId: number;
  ValidatorId: number;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  Documents?: Document[];
}

// Styled Components
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
  
  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
  
  h3 {
    margin: 0;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const FilterToggle = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary || '#f8f9fa'};
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
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: 480px) {
    font-size: 16px; /* Prevent zoom on iOS */
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
  
  input {
    margin: 0;
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
  background: ${props => props.$isSelected ? props.theme.colors.primaryLight : 'transparent'};
  min-height: 40px;
  
  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary || '#f8f9fa'};
    transform: translateX(2px);
  }
  
  ${props => !props.$isFolder && `
    &:hover {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `}
  
  @media (max-width: 768px) {
    padding: 10px 12px;
    gap: 10px;
    min-height: 44px;
    
    &:hover {
      transform: none;
    }
  }
  
  @media (max-width: 480px) {
    padding: 12px 8px;
    gap: 8px;
    min-height: 48px;
    flex-wrap: wrap;
  }
`;

const NodeIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.textSecondary};
  flex-shrink: 0;
  
  @media (max-width: 480px) {
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const NodeTitle = styled.span<{ $isFolder: boolean }>`
  font-weight: ${props => props.$isFolder ? '500' : '400'};
  color: ${props => props.$isFolder ? props.theme.colors.text : props.theme.colors.textSecondary};
  font-size: 14px;
  flex: 1;
  word-break: break-word;
  line-height: 1.3;
  
  @media (max-width: 768px) {
    font-size: 15px;
    min-width: 0; /* Allow flex shrinking */
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    flex-basis: 100%;
    margin-top: 2px;
  }
`;

const NodeMeta = styled.div`
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  flex-shrink: 0;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 6px;
    font-size: 11px;
  }
  
  @media (max-width: 480px) {
    flex-basis: 100%;
    gap: 4px;
    margin-top: 4px;
    justify-content: flex-start;
  }
`;

const StatusBadge = styled.span<{ $status: 'active' | 'inactive' | 'valid' | 'invalid' | 'pending' }>`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  
  ${props => {
    switch (props.$status) {
      case 'active': return `background: #e7f5e7; color: #2e7a2e;`;
      case 'inactive': return `background: #f5e7e7; color: #7a2e2e;`;
      case 'valid': return `background: #e7f5e7; color: #2e7a2e;`;
      case 'invalid': return `background: #f5e7e7; color: #7a2e2e;`;
      case 'pending': return `background: #fff3cd; color: #856404;`;
      default: return `background: #f8f9fa; color: #6c757d;`;
    }
  }}
  
  @media (max-width: 768px) {
    padding: 3px 8px;
    font-size: 10px;
  }
  
  @media (max-width: 480px) {
    padding: 2px 6px;
    font-size: 9px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.colors.textSecondary};
  
  .icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  h3 {
    margin: 0 0 8px 0;
    color: ${props => props.theme.colors.text};
    font-size: 18px;
  }
  
  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.4;
  }
  
  @media (max-width: 768px) {
    padding: 30px 20px;
    
    .icon {
      font-size: 40px;
      margin-bottom: 12px;
    }
    
    h3 {
      font-size: 16px;
    }
    
    p {
      font-size: 13px;
    }
  }
  
  @media (max-width: 480px) {
    padding: 20px 10px;
    
    .icon {
      font-size: 36px;
      margin-bottom: 8px;
    }
    
    h3 {
      font-size: 15px;
    }
    
    p {
      font-size: 12px;
    }
  }
`;

const StatsBar = styled.div`
  padding: 8px 16px;
  margin-bottom: 12px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 13px;
  color: #6c757d;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 12px;
    flex-direction: column;
    gap: 4px;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 11px;
    margin-bottom: 8px;
    border-radius: 6px;
  }
`;

// Componente de busca rápida para mobile
const QuickSearch = styled.div`
  position: sticky;
  top: 0;
  background: ${props => props.theme.colors.background};
  padding: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin: -16px -16px 16px -16px;
  z-index: 10;
  
  @media (min-width: 769px) {
    display: none;
  }
  
  @media (max-width: 768px) {
    margin: -12px -12px 12px -12px;
  }
  
  @media (max-width: 480px) {
    margin: -8px -8px 8px -8px;
    padding: 8px;
  }
`;

// Imports dos hooks reais
import { useFolder } from '../folder/useFolder';
import { useDocument } from '../document/useDocument';
import { FiFolder, FiFile, FiChevronRight, FiChevronDown, FiPlus, FiSearch, FiFilter, FiChevronUp } from 'react-icons/fi';
import PageLayout from '../../components/common/PageLayout';
import { Button } from '../../components/common/Button';

// Componente principal
export const CascadeView: React.FC = () => {
  const { t } = useTranslation();
  
  // Usar hooks reais
  const { activeFolder, deactiveFolder } = useFolder();
  const { activeDocument, deactiveDocument } = useDocument();
  
  // Estados
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

  // Hook para detectar tamanho da tela
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      // Auto-colapsar filtros em mobile
      if (window.innerWidth <= 768) {
        setFiltersCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Carregar dados ao montar o componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Os hooks já fazem o carregamento automático
        await new Promise(resolve => setTimeout(resolve, 100)); // Simular loading
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Função para expandir todas as pastas (útil em mobile)
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

  // Função para colapsar todas as pastas
  const collapseAllFolders = () => {
    setExpandedFolders(new Set());
  };

  // Função para alternar expansão de pasta
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

  // Função para construir árvore hierárquica
  const buildTree = useMemo(() => {
    const tree: any[] = [];
    const folderMap = new Map();
    
    // Combinar pastas ativas e inativas baseado no filtro
    const allFolders = filters.showInactive ? [...activeFolder, ...deactiveFolder] : activeFolder;
    const allDocuments = filters.showInactive ? [...activeDocument, ...deactiveDocument] : activeDocument;
    
    // Filtrar pastas baseado na busca
    const filteredFolders = allFolders.filter(folder => 
      folder.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Filtrar documentos
    const filteredDocuments = allDocuments.filter(doc => 
      doc.Title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      ((filters.showValidated && doc.isValid === true) ||
       (filters.showPending && doc.isValid === null) ||
       (filters.showInvalid && doc.isValid === false))
    );
    
    // Criar mapa de pastas
    filteredFolders.forEach(folder => {
      folderMap.set(folder.FolderId, { ...folder, children: [], documents: [] });
    });
    
    // Adicionar documentos às pastas
    filteredDocuments.forEach(doc => {
      const folder = folderMap.get(doc.FolderId);
      if (folder) {
        folder.documents.push(doc);
      }
    });
    
    // Construir hierarquia
    folderMap.forEach(folder => {
      if (folder.ParentFolderId === null) {
        tree.push(folder);
      } else {
        const parent = folderMap.get(folder.ParentFolderId);
        if (parent) {
          parent.children.push(folder);
        }
      }
    });
    
    return tree;
  }, [activeFolder, deactiveFolder, activeDocument, deactiveDocument, searchTerm, filters]);

  // Renderizar nó da árvore
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
                  {node.IsActive ? 'Ativa' : 'Inativa'}
                </StatusBadge>
                <span>{(node.children?.length || 0) + (node.documents?.length || 0)} itens</span>
              </NodeMeta>
            </NodeHeader>
          </TreeNode>
          
          {isExpanded && (
            <>
              {/* Renderizar subpastas primeiro */}
              {node.children && node.children.map((child: any) => renderTreeNode(child, level + 1))}
              
              {/* Renderizar documentos da pasta */}
              {node.documents && node.documents.map((doc: Document) => renderTreeNode(doc, level + 1))}
            </>
          )}
        </React.Fragment>
      );
    } else {
      // Renderizar documento
      const isSelected = selectedNode?.type === 'document' && selectedNode?.id === node.DocumentId;
      
      return (
        <TreeNode key={`doc-${node.DocumentId}`} $level={level}>
          <NodeHeader 
            $isFolder={false}
            $isSelected={isSelected}
            onClick={() => setSelectedNode({ type: 'document', id: node.DocumentId })}
            onDoubleClick={() => {
              // Navegar para detalhes do documento
              window.location.href = `/document/${node.DocumentId}`;
            }}
          >
            <NodeIcon style={{ width: '16px' }} />
            <NodeIcon>
              <FiFile size={16} color="#17a2b8" />
            </NodeIcon>
            <NodeTitle $isFolder={false}>{node.Title}</NodeTitle>
            <NodeMeta>
              <StatusBadge $status={node.IsActive ? 'active' : 'inactive'}>
                {node.IsActive ? 'Ativo' : 'Inativo'}
              </StatusBadge>
              {node.isValid !== undefined && (
                <StatusBadge $status={
                  node.isValid === true ? 'valid' : 
                  node.isValid === false ? 'invalid' : 'pending'
                }>
                  {node.isValid === true ? 'Válido' : 
                   node.isValid === false ? 'Inválido' : 'Pendente'}
                </StatusBadge>
              )}
              <span title={`Criado em ${new Date(node.CreatedAt).toLocaleDateString()}`}>
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
      title="Visualização em Cascata"
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
            {!isMobile && <span style={{ marginLeft: '4px' }}>Nova Pasta</span>}
          </Button>
          <Button 
            style={{ 
              minWidth: 'auto',
              padding: isMobile ? '8px' : '8px 16px'
            }}
          >
            <FiPlus />
            {!isMobile && <span style={{ marginLeft: '4px' }}>Novo Documento</span>}
          </Button>
        </div>
      }
    >
      <CascadeContainer>
        {/* Painel de Filtros */}
        <FilterPanel $isCollapsed={filtersCollapsed}>
          <FilterHeader onClick={() => setFiltersCollapsed(!filtersCollapsed)}>
            <h3>
              <FiFilter size={16} />
              Filtros
            </h3>
            <FilterToggle>
              {filtersCollapsed ? <FiChevronDown size={16} /> : <FiChevronUp size={16} />}
            </FilterToggle>
          </FilterHeader>
          
          <FilterContent $isCollapsed={filtersCollapsed}>
            <SearchInput
              type="text"
              placeholder="Buscar pastas e documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <FilterSection>
              <h4>Status</h4>
              <FilterOption>
                <input 
                  type="checkbox" 
                  checked={filters.showInactive}
                  onChange={(e) => setFilters(prev => ({ ...prev, showInactive: e.target.checked }))}
                />
                Mostrar inativos
              </FilterOption>
            </FilterSection>
            
            <FilterSection>
              <h4>Validação de Documentos</h4>
              <FilterOption>
                <input 
                  type="checkbox" 
                  checked={filters.showValidated}
                  onChange={(e) => setFilters(prev => ({ ...prev, showValidated: e.target.checked }))}
                />
                Documentos válidos
              </FilterOption>
              <FilterOption>
                <input 
                  type="checkbox" 
                  checked={filters.showPending}
                  onChange={(e) => setFilters(prev => ({ ...prev, showPending: e.target.checked }))}
                />
                Pendentes de validação
              </FilterOption>
              <FilterOption>
                <input 
                  type="checkbox" 
                  checked={filters.showInvalid}
                  onChange={(e) => setFilters(prev => ({ ...prev, showInvalid: e.target.checked }))}
                />
                Documentos inválidos
              </FilterOption>
            </FilterSection>
          </FilterContent>
        </FilterPanel>

        {/* Árvore de Pastas e Documentos */}
        <TreeContainer>
          {/* Busca rápida mobile */}
          {isMobile && (
            <QuickSearch>
              <SearchInput
                type="text"
                placeholder="Busca rápida..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </QuickSearch>
          )}
          
          {/* Controles de expansão para mobile */}
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
                Expandir Tudo
              </Button>
              <Button 
                variant="primary" 
                onClick={collapseAllFolders}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                Colapsar Tudo
              </Button>
            </div>
          )}
          
          
            <div>
              <StatsBar>
                <span>📁 Pastas: {buildTree.length}</span>
                <span>📄 Documentos: {buildTree.reduce((acc, folder) => acc + (folder.documents?.length || 0), 0)}</span>
              </StatsBar>
              {buildTree.map(node => renderTreeNode(node))}
            </div>
        </TreeContainer>
      </CascadeContainer>
    </PageLayout>
  );
};

export default CascadeView;