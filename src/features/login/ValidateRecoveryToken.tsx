import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button } from "../../components/common/Button";
import { ThemeSelector } from "../../components/common/ThemeSelector";
import { usePasswordRecovery } from "./usePasswordRecovery";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}15, ${({ theme }) => theme.colors.background});
  padding: ${({ theme }) => theme.spacing.lg};
`;

const TokenCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 48px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const LogoText = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primary}80);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  margin: 8px 0 0 0;
  font-size: 14px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TokenInput = styled.input`
  height: 64px;
  border: 2px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 0 16px;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 4px;
  text-align: center;
  text-transform: uppercase;
  transition: all 0.2s ease;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
    outline: none;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
    font-weight: 400;
    letter-spacing: 2px;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ValidateButton = styled(Button)`
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ActionLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  margin-top: 16px;
`;

const ActionLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
  
  &.secondary {
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const ThemeToggle = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
`;

const ValidateRecoveryToken: React.FC = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const { validateToken } = usePasswordRecovery();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!email) {
      navigate("/request-password-recovery");
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim() || token.length !== 6) return;

    setLoading(true);
    try {
      await validateToken(email, token);
      navigate(`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length <= 6) {
      setToken(value);
    }
  };

  const requestNewCode = () => {
    navigate(`/request-password-recovery?email=${encodeURIComponent(email)}`);
  };

  
  const getRequestNewCodeText = () => {
    const currentLang = t("language") || 'pt';
    return t("token_reset.request_new_code") || 
           (currentLang === 'en' ? "Request new code" : 
            currentLang === 'es' ? "Solicitar nuevo código" : 
            "Solicitar novo código");
  };

  return (
    <Container>
      <ThemeToggle>
        <ThemeSelector />
      </ThemeToggle>

      <TokenCard>
        <Logo>
          <LogoText>{t("token_reset.title") || "Documentin"}</LogoText>
          <Subtitle>{t("token_reset.subtitle") || "Recupere o acesso à sua conta"}</Subtitle>
        </Logo>

        <Form onSubmit={handleSubmit}>
          <div>
            <TokenInput
              type="text"
              placeholder={t("token_reset.token_placeholder") || "Digite seu token"}
              value={token}
              onChange={handleTokenChange}
              maxLength={6}
              disabled={loading}
              required
            />
          </div>

          <ValidateButton
            type="submit"
            disabled={loading || token.length !== 6}
          >
            {loading 
              ? (t("token_reset.sending") || "Enviando...") 
              : (t("token_reset.send_button") || "Enviar token")
            }
          </ValidateButton>

          <ActionLinks>
            <ActionLink onClick={requestNewCode}>
              {getRequestNewCodeText()}
            </ActionLink>
            
            <ActionLink 
              className="secondary"
              onClick={() => navigate("/login")}
            >
              {t("token_reset.back_to_login") || "Fazer login"}
            </ActionLink>
          </ActionLinks>
        </Form>
      </TokenCard>
    </Container>
  );
};

export default ValidateRecoveryToken;