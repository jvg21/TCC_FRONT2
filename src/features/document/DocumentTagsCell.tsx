import { useEffect, useState } from "react";
import { useTag } from "../tag/useTag";

export const DocumentTagsCell: React.FC<{ documentId: number }> = ({ documentId }) => {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getTagsByDocument } = useTag();
  useEffect(() => {
    const loadTags = async () => {
      setLoading(true);
      try {
        const response = await getTagsByDocument(documentId);
        if (response && !response.erro) {
          setTags(response.objeto || []);
        }
      } catch (error) {
        console.error('Erro ao carregar tags:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTags();
  }, [documentId]);

  if (loading) {
    return <span style={{ color: '#999', fontSize: '12px' }}>...</span>;
  }

  return (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {tags.length > 0 ? (
        tags.map((tag) => (
          <span
            key={tag.tagId}
            style={{
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              backgroundColor: tag.color || '#007bff',
              color: '#fff'
            }}
          >
            {tag.name}
          </span>
        ))
      ) : (
        <span style={{ color: '#999', fontSize: '12px' }}>-</span>
      )}
    </div>
  );
};