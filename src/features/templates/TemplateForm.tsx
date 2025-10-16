import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { MarkdownEditor } from "../../components/markdownEditor/MarkdownEditor";
import { useTypedTranslation } from "../../context/LanguageContext";
import type { Template } from "./types";

const FormContainer = styled.div`
  padding: 24px;
  width: 600px;
  max-width: 90vw;
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 16px;
  }
`;

const FormTitle = styled.h2`
  margin: 0 0 24px 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 8px;
  }
`;

interface TemplateFormProps {
  template?: Template | null;
  onSubmit: (data: Omit<Template, "TemplateId" | "CreatedAt" | "UpdatedAt" | "IsActive">) => void;
  onCancel: () => void;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({
  template,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    Name: "",
    Content: "",
  });
  const [loading, setLoading] = useState(false);
  const { t } = useTypedTranslation();

  useEffect(() => {
    if (template) {
      setFormData({
        Name: template.Name,
        Content: template.Content,
      });
    } else {
      setFormData({
        Name: "",
        Content: "",
      });
    }
  }, [template]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.Name.trim() || !formData.Content.trim()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>
        {template 
          ? (t("templates.edit_template") || "Editar Template")
          : (t("templates.add_template") || "Novo Template")
        }
      </FormTitle>

      <form onSubmit={handleSubmit}>
        <FormGrid>
          <Input
            label={t("templates.name") || "Nome"}
            value={formData.Name}
            onChange={(e) => handleInputChange('Name', e.target.value)}
            required
            placeholder="Digite o nome do template"
          />

          <MarkdownEditor
            label={t("templates.content") || "Conteúdo"}
            value={formData.Content}
            onChange={(value) => handleInputChange('Content', value)}
            required
            placeholder="Digite o conteúdo do template em markdown..."
          />
        </FormGrid>

        <ButtonGroup>
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onCancel}
            disabled={loading}
          >
            {t("actions.cancel") || "Cancelar"}
          </Button>
          <Button 
            type="submit" 
            disabled={loading || !formData.Name.trim() || !formData.Content.trim()}
          >
            {loading ? "..." : (t("actions.save") || "Salvar")}
          </Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};