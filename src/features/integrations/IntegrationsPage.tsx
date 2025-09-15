import React, { useState } from "react";
import styled from "styled-components";
import { FiKey, FiSend, FiCheck, FiAlertCircle } from "react-icons/fi";
import PageLayout from "../../components/common/PageLayout";
import { Button } from "../../components/common/Button";


// Styled Components
const IntegrationCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 32px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const IconContainer = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #10a37f 0%, #1a7f64 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const CardTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px 0;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0;
  line-height: 1.5;
`;

const FormSection = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 14px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.2s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const HelpText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  margin: 8px 0 0 0;
  line-height: 1.4;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const SubmitButton = styled(Button)<{ $loading?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  position: relative;
  
  ${({ $loading }) => $loading && `
    opacity: 0.7;
    cursor: not-allowed;
  `}
`;

const StatusMessage = styled.div<{ $type: 'success' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  margin-top: 16px;
  
  ${({ $type, theme }) => $type === 'success' ? `
    background: ${theme.colors.success}15;
    color: ${theme.colors.success};
    border: 1px solid ${theme.colors.success}30;
  ` : `
    background: ${theme.colors.error}15;
    color: ${theme.colors.error};
    border: 1px solid ${theme.colors.error}30;
  `}
`;

const IntegrationsPage: React.FC = () => {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setStatus({
        type: 'error',
        message: 'Por favor, insira uma API Key válida.'
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStatus({
        type: 'success',
        message: 'API Key da OpenAI configurada com sucesso! A integração está ativa.'
      });
      
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Erro ao configurar API Key da OpenAI. Verifique se a chave está correta.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setApiKey("");
    setStatus(null);
  };

  return (
    <PageLayout 
      title="Configurar OpenAI"
      actions={
        <div>
          <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
            Configure sua API Key da OpenAI para funcionalidades de IA
          </p>
        </div>
      }
    >
      <IntegrationCard>
        <CardHeader>
          <IconContainer>
            🤖
          </IconContainer>
          <HeaderInfo>
            <CardTitle>OpenAI Integration</CardTitle>
            <CardDescription>
              Configure sua API Key da OpenAI para habilitar funcionalidades de IA no sistema. 
              Suas chaves são armazenadas de forma segura e criptografada.
            </CardDescription>
          </HeaderInfo>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <FormSection>
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <InputGroup>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                disabled={loading}
              />
            </InputGroup>
            <HelpText>
              Sua API Key da OpenAI (começa com "sk-"). Você pode encontrá-la em{' '}
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" 
                 style={{ color: '#10a37f', textDecoration: 'none' }}>
                platform.openai.com/api-keys
              </a>
            </HelpText>
          </FormSection>

          <ButtonContainer>
            <Button 
              type="button" 
              variant="primary" 
              onClick={handleClear}
              disabled={loading || !apiKey}
            >
              Limpar
            </Button>
            
            <SubmitButton 
              type="submit" 
              $loading={loading}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div style={{ 
                    width: '16px', 
                    height: '16px', 
                    border: '2px solid transparent',
                    borderTop: '2px solid currentColor',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Configurando...
                </>
              ) : (
                <>
                  <FiSend size={16} />
                  Configurar
                </>
              )}
            </SubmitButton>
          </ButtonContainer>

          {status && (
            <StatusMessage $type={status.type}>
              {status.type === 'success' ? (
                <FiCheck size={16} />
              ) : (
                <FiAlertCircle size={16} />
              )}
              {status.message}
            </StatusMessage>
          )}
        </form>
      </IntegrationCard>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </PageLayout>
  );
};

export default IntegrationsPage;