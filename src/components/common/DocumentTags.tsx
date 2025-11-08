import React, { useState, useEffect } from 'react';
import { FiTag, FiX } from 'react-icons/fi';
import {
  TagsSection,
  TagsTitle,
  TagsList,
  TagItem,
  TagRemoveButton,
  TagForm,
  EmptyTags
} from '../../components/common/Components';
import { useTag } from '../../features/tag/useTag';
import { notificationActions } from '../../features/notifications/useNotification';
import { t } from 'i18next';

interface DocumentTagsProps {
  documentId: number;
}

export const DocumentTags: React.FC<DocumentTagsProps> = ({ documentId }) => {
  const {
    activeTag,
    getTagsByDocument,
    addDocumentToTag,
    removeDocumentFromTag,
    create: createTag,
  } = useTag();

  const [documentTags, setDocumentTags] = useState<any[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  
  useEffect(() => {
    loadDocumentTags();
  }, [documentId]);

  const loadDocumentTags = async () => {
    if (!documentId) return;

    setLoadingTags(true);
    try {
      const response = await getTagsByDocument(documentId);
      if (response && !response.erro) {
        setDocumentTags(response.objeto || []);
      }
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
    } finally {
      setLoadingTags(false);
    }
  };

  
  const handleAddExistingTag = async (tagId: number) => {
    try {
      await addDocumentToTag(documentId, tagId);
      await loadDocumentTags();
      setTagInput('');
      setShowSuggestions(false);
      notificationActions.showNotification(t('tags.addSuccess'), 'success');
    } catch (error) {
      console.error('Erro ao adicionar tag:', error);
    }
  };

  
  const handleCreateTag = async () => {
    if (!tagInput.trim()) return;

    try {
    
      const response = await createTag({ Name: tagInput.trim() });
      
      if (response && !response.erro && response.objeto) {
        
        const newTagId = response.objeto.tagId; 
        
        if (newTagId) {
          
          try {
            await addDocumentToTag(documentId, newTagId);
            await loadDocumentTags();
            notificationActions.showNotification(t('tags.createAddSuccess'), 'success');
          } catch (tagError) {
            console.error('Erro ao adicionar documento à tag:', tagError);
            notificationActions.showError('Erro ao vincular documento à tag');
          }
        } else {
          console.error('ID da tag não encontrado na resposta:', response.objeto);
          notificationActions.showError('Erro ao vincular documento à tag: ID da tag não encontrado');
        }
        
        
        setTagInput('');
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      notificationActions.showError('Erro ao criar tag');
    }
  };

  const handleRemoveTag = async (tagId: number) => {
    try {
      await removeDocumentFromTag(documentId, tagId);
      await loadDocumentTags();
      notificationActions.showNotification(t('tags.removeSuccess'), 'success');
    } catch (error) {
      console.error('Erro ao remover tag:', error);
    }
  };

  
  const availableTags = activeTag.filter(
    tag => !documentTags.some(dt => dt.tagId === tag.TagId)
  );

  const filteredTags = availableTags.filter(tag =>
    tag.Name.toLowerCase().includes(tagInput.toLowerCase())
  );

  const exactMatch = filteredTags.find(
    tag => tag.Name.toLowerCase() === tagInput.toLowerCase()
  );

  return (
    <TagsSection>
      <TagsTitle>
        <FiTag />
        {t('tags.title')}
      </TagsTitle>

      <TagsList>
        {loadingTags ? (
          <div style={{ width: '100%', textAlign: 'center', padding: '20px', color: '#666' }}>
            {t('tags.loading')}
          </div>
        ) : documentTags.length === 0 ? (
          <EmptyTags>
            {t('tags.noTags')}
          </EmptyTags>
        ) : (
          documentTags.map((tag) => (
            <TagItem key={tag.tagId}>
              {tag.name}
              <TagRemoveButton
                onClick={() => handleRemoveTag(tag.tagId)}
                title="Remover tag"
              >
                <FiX />
              </TagRemoveButton>
            </TagItem>
          ))
        )}
      </TagsList>

      <TagForm style={{ position: 'relative' }}>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => {
            setTagInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={t('tags.inputPlaceholder')}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />

        {showSuggestions && tagInput && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginTop: '4px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {filteredTags.length > 0 ? (
              filteredTags.map((tag) => (
                <div
                  key={tag.TagId}
                  onClick={() => handleAddExistingTag(tag.TagId)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  {tag.Name}
                </div>
              ))
            ) : null}

            {!exactMatch && tagInput.trim() && (
              <div
                onClick={handleCreateTag}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  color: '#007bff',
                  fontWeight: 500,
                  borderTop: filteredTags.length > 0 ? '2px solid #e0e0e0' : 'none'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f0f8ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                "{t('tags.createNew') +' '+ tagInput}"
              </div>
            )}
          </div>
        )}
      </TagForm>
    </TagsSection>
  );
};