import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { ThemeSelector } from "../../components/common/ThemeSelector";
import { usePasswordRecovery } from "./usePasswordRecovery";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}15, ${({ theme }) => theme.colors.background});
  padding: ${({ theme }) => theme.spacing.lg};
`;

const RecoveryCard = styled.div`
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

const StyledInput = styled(Input)`
  input {
    height: 48px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    transition: all 0.2s ease;
    
    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
      outline: none;
    }
  }
`;

const RecoveryButton = styled(Button)`
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

const BackToLogin = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ThemeToggle = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
`;

const RequestPasswordRecovery: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { requestPasswordRecovery } = usePasswordRecovery();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await requestPasswordRecovery(email);
      navigate(`/validate-recovery-token?email=${encodeURIComponent(email)}`);
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <ThemeToggle>
        <ThemeSelector />
      </ThemeToggle>

      <RecoveryCard>
        <Logo>
          <LogoText>{t("password_recovery.title") || "Documentin"}</LogoText>
          <Subtitle>{t("password_recovery.subtitle") || "Recupere o acesso à sua conta"}</Subtitle>
        </Logo>

        <Form onSubmit={handleSubmit}>
          <StyledInput
            type="email"
            placeholder={t("password_recovery.email_placeholder") || "Digite seu e-mail"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />

          <RecoveryButton
            type="submit"
            disabled={loading || !email.trim()}
          >
            {loading 
              ? (t("password_recovery.sending") || "Enviando...") 
              : (t("password_recovery.send_button") || "Enviar link de recuperação")
            }
          </RecoveryButton>

          <div style={{ textAlign: "center" }}>
            <BackToLogin onClick={() => navigate("/login")}>
              {t("password_recovery.back_to_login") || "Fazer login"}
            </BackToLogin>
          </div>
        </Form>
      </RecoveryCard>
    </Container>
  );
};

export default RequestPasswordRecovery;
