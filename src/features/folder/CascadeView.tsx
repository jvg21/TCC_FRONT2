import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FiFolder, FiFile, FiChevronRight, FiChevronDown, FiPlus, FiFilter, FiChevronUp } from 'react-icons/fi';
import PageLayout from '../../components/common/PageLayout';
import { Button } from '../../components/common/Button';
import { useFolder } from './useFolder';
import { useDocument } from '../document/useDocument';
import { useModal } from '../../hooks/useModal';
import { Modal } from '../../components/common/Modal';
import { FolderForm } from './FolderForm';
import { DocumentForm } from '../document/DocumentForm';
import { MarkdownEditorPage } from '../markdown-editor/MarkdownEditorPage';

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
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  
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

const FilterGroup = styled.div`
  margin-bottom: 20px;
  
  h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 14px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

const TreeContainer = styled.div`
  flex: 1;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  overflow-y: auto;
  max-height: calc(100vh - 160px);
`;

const TreeNode = styled.div<{ $level: number }>`
  margin-left: ${props => props.$level * 20}px;
`;

const NodeHeader = styled.div<{ $isFolder: boolean; $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  background: ${props => props.$isSelected ? props.theme.colors.primaryLight || 'rgba(59, 130, 246, 0.1)' : 'transparent'};
  
  &:hover {
    background: ${props => props.theme.colors.hover || 'rgba(255, 255, 255, 0.05)'};
  }
`;

const NodeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const NodeTitle = styled.span<{ $isFolder: boolean }>`
  flex: 1;
  font-size: 14px;
  font-weight: ${props => props.$isFolder ? '500' : '400'};
  color: ${props => props.theme.colors.text};
`;

const NodeMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const StatusBadge = styled.span<{ $status: 'active' | 'inactive' | 'valid' | 'invalid' | 'pending' }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  
  ${props => {
    switch (props.$status) {
      case 'active':
        return 'background: #d4edda; color: #155724;';
      case 'inactive':
        return 'background: #e2e3e5; color: #383d41;';
      case 'valid':
        return 'background: #d1ecf1; color: #0c5460;';
      case 'invalid':
        return 'background: #f8d7da; color: #721c24;';
      case 'pending':
        return 'background: #fff3cd; color: #856404;';
      default:
        return '';
    }
  }}
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
`;

export const CascadeView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { activeFolder, deactiveFolder, create: createFolder } = useFolder();
  const { activeDocument, deactiveDocument, create: createDocument } = useDocument();

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());
  const [selectedNode, setSelectedNode] = useState<{ type: 'folder' | 'document'; id: number } | null>(null);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [filters, setFilters] = useState({
    showInactive: false,
    showValidated: true,
    showPending: true,
    showInvalid: true,
  });

  const [isMobile, setIsMobile] = useState(false);

  // Modais
  const folderModal = useModal();
  const documentModal = useModal();
  const editorModal = useModal();

  // Estados de edição
  const [editingFolder, setEditingFolder] = useState<any>(null);
  const [editingDocument, setEditingDocument] = useState<any>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [contentSaveCallback, setContentSaveCallback] = useState<((content: string) => void) | null>(null);

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

  const buildTree = useMemo(() => {
    const tree: any[] = [];
    const folderMap = new Map();

    const allFolders = filters.showInactive ? [...activeFolder, ...deactiveFolder] : activeFolder;
    const allDocuments = filters.showInactive ? [...activeDocument, ...deactiveDocument] : activeDocument;

    const filteredFolders = allFolders.filter(folder =>
      folder.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredDocuments = allDocuments.filter(doc => {
      if (!doc.Title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      const validationStatus = doc.isValid === undefined ? null : doc.isValid;

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
          tree.push(folder);
        }
      }
    });

    return tree;
  }, [activeFolder, deactiveFolder, activeDocument, deactiveDocument, searchTerm, filters]);

  useEffect(() => {
    if (buildTree.length > 0) {
      const collectFolderIds = (nodes: any[]): number[] => {
        const ids: number[] = [];
        nodes.forEach(node => {
          if (node.FolderId) {
            ids.push(node.FolderId);
            if (node.children?.length > 0) {
              ids.push(...collectFolderIds(node.children));
            }
          }
        });
        return ids;
      };
      setExpandedFolders(new Set(collectFolderIds(buildTree)));
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
              {node.children?.map((child: any) => renderTreeNode(child, level + 1))}
              {node.documents?.map((doc: any) => renderTreeNode(doc, level + 1))}
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
              navigate(`/document/${node.DocumentId}`);
            }}
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
            </NodeMeta>
          </NodeHeader>
        </TreeNode>
      );
    }
  };

  // Handlers para pasta
  const handleAddFolder = () => {
    setEditingFolder(null);
    folderModal.open();
  };

  const handleSaveFolder = async (payload: any) => {
    try {
      await createFolder(payload);
      folderModal.close();
    } catch (error) {
      console.error("Erro ao criar pasta:", error);
    }
  };

  // Handlers para documento
  const handleAddDocument = () => {
    setEditingDocument(null);
    setEditingContent("");
    documentModal.open();
  };

  const handleEditContentFromForm = (currentContent: string, onContentSaved: (newContent: string) => void) => {
    setEditingContent(currentContent);
    setContentSaveCallback(() => onContentSaved);
    editorModal.open();
  };

  const handleSaveContent = (newContent: string) => {
    if (contentSaveCallback) {
      contentSaveCallback(newContent);
    }
    editorModal.close();
  };

  const handleSaveDocument = async (payload: any) => {
    try {
      await createDocument(payload);
      documentModal.close();
    } catch (error) {
      console.error("Erro ao criar documento:", error);
    }
  };

  return (
    <PageLayout
      title={t("cascadeview.title")}
      actions={
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            onClick={handleAddFolder}
            style={{
              minWidth: 'auto',
              padding: isMobile ? '8px' : '8px 16px'
            }}
          >
            <FiPlus />
            {!isMobile && <span style={{ marginLeft: '4px' }}>{t("cascadeview.new_folder")}</span>}
          </Button>
          <Button
            onClick={handleAddDocument}
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
              {filtersCollapsed ? <FiChevronDown size={18} /> : <FiChevronUp size={18} />}
            </FilterToggle>
          </FilterHeader>

          <FilterContent $isCollapsed={filtersCollapsed}>
            <FilterGroup>
              <SearchInput
                type="text"
                placeholder={t("cascadeview.search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </FilterGroup>

            <FilterGroup>
              <h4>{t("cascadeview.status")}</h4>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={filters.showInactive}
                  onChange={(e) => setFilters({ ...filters, showInactive: e.target.checked })}
                />
                {t("cascadeview.show_inactive")}
              </CheckboxLabel>
            </FilterGroup>

            <FilterGroup>
              <h4>{t("cascadeview.document_validation")}</h4>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={filters.showValidated}
                  onChange={(e) => setFilters({ ...filters, showValidated: e.target.checked })}
                />
                {t("cascadeview.valid_documents")}
              </CheckboxLabel>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={filters.showPending}
                  onChange={(e) => setFilters({ ...filters, showPending: e.target.checked })}
                />
                {t("cascadeview.pending_validation")}
              </CheckboxLabel>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={filters.showInvalid}
                  onChange={(e) => setFilters({ ...filters, showInvalid: e.target.checked })}
                />
                {t("cascadeview.invalid_documents")}
              </CheckboxLabel>
            </FilterGroup>
          </FilterContent>
        </FilterPanel>

        <TreeContainer>
          <StatsBar>
            <span>
              <FiFolder size={16} />
              {activeFolder.length} {t("cascadeview.folders")}
            </span>
            <span>
              <FiFile size={16} />
              {activeDocument.length} {t("cascadeview.documents")}
            </span>
          </StatsBar>

          {buildTree.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
              {t("cascadeview.no_folders")}
            </div>
          ) : (
            buildTree.map(node => renderTreeNode(node, 0))
          )}
        </TreeContainer>
      </CascadeContainer>

      <Modal 
        isOpen={folderModal.isOpen} 
        onClose={folderModal.close} 
        title={t("folders.add_folder")}
      >
        <FolderForm 
          initial={editingFolder ?? undefined} 
          onCancel={folderModal.close} 
          onSave={handleSaveFolder} 
        />
      </Modal>

      <Modal 
        isOpen={documentModal.isOpen} 
        onClose={documentModal.close} 
        title={t("documents.add_document")}
      >
        <DocumentForm 
          initial={editingDocument ?? undefined} 
          onCancel={documentModal.close} 
          onSave={handleSaveDocument}
          onEditContent={handleEditContentFromForm}
        />
      </Modal>

      <Modal
        isOpen={editorModal.isOpen}
        onClose={editorModal.close}
        title={t("documents.markdown_editor")}
      >
        <MarkdownEditorPage
          initialContent={editingContent}
          onSave={handleSaveContent}
          onCancel={editorModal.close}
        />
      </Modal>
    </PageLayout>
  );
};

export default CascadeView;