import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { FiEye, FiEyeOff } from "react-icons/fi";
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

const ResetCard = styled.div`
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

const InputGroup = styled.div`
  position: relative;
`;

const StyledInput = styled(Input)`
  input {
    height: 48px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    transition: all 0.2s ease;
    padding-right: 48px;
    
    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
      outline: none;
    }
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const PasswordStrengthIndicator = styled.div<{ strength: number }>`
  height: 4px;
  width: 100%;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ strength }) => strength}%;
    background: ${({ strength, theme }) => 
      strength < 33 ? '#ef4444' : 
      strength < 66 ? '#f59e0b' : 
      theme.colors.success || '#10b981'
    };
    transition: all 0.3s ease;
  }
`;

const PasswordHint = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  margin: 4px 0 0 0;
`;

const ResetButton = styled(Button)`
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

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const { updatePassword } = usePasswordRecovery();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!email || !token) {
      navigate("/request-password-recovery");
    }
  }, [email, token, navigate]);

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const isFormValid = passwordStrength === 100 && passwordsMatch;

  
  const getPasswordStrengthText = () => {
    const strengthTexts = {
      pt: {
        veryWeak: "Senha muito fraca",
        weak: "Senha fraca", 
        moderate: "Senha moderada",
        strong: "Senha forte",
        veryStrong: "Senha muito forte"
      },
      en: {
        veryWeak: "Very weak password",
        weak: "Weak password",
        moderate: "Moderate password", 
        strong: "Strong password",
        veryStrong: "Very strong password"
      },
      es: {
        veryWeak: "Contraseña muy débil",
        weak: "Contraseña débil",
        moderate: "Contraseña moderada",
        strong: "Contraseña fuerte", 
        veryStrong: "Contraseña muy fuerte"
      }
    };

    const currentLang = t("language") || 'pt';
    const texts = strengthTexts[currentLang as keyof typeof strengthTexts] || strengthTexts.pt;

    if (passwordStrength < 25) return texts.veryWeak;
    if (passwordStrength >= 25 && passwordStrength < 50) return texts.weak;
    if (passwordStrength >= 50 && passwordStrength < 75) return texts.moderate;
    if (passwordStrength >= 75 && passwordStrength < 100) return texts.strong;
    return texts.veryStrong;
  };

  
  const getPasswordMatchText = () => {
    const matchTexts = {
      pt: { match: "Senhas conferem", noMatch: "Senhas não conferem" },
      en: { match: "Passwords match", noMatch: "Passwords don't match" },
      es: { match: "Las contraseñas coinciden", noMatch: "Las contraseñas no coinciden" }
    };

    const currentLang = t("language") || 'pt';
    const texts = matchTexts[currentLang as keyof typeof matchTexts] || matchTexts.pt;
    
    return passwordsMatch ? texts.match : texts.noMatch;
  };

  // Função para obter placeholders traduzidos
  const getPlaceholders = () => {
    const placeholders = {
      pt: { newPassword: "Nova senha", confirmPassword: "Confirmar nova senha" },
      en: { newPassword: "New password", confirmPassword: "Confirm new password" },
      es: { newPassword: "Nueva contraseña", confirmPassword: "Confirmar nueva contraseña" }
    };

    const currentLang = t("language") || 'pt';
    return placeholders[currentLang as keyof typeof placeholders] || placeholders.pt;
  };

  // Função para obter textos de botões traduzidos
  const getButtonTexts = () => {
    const buttonTexts = {
      pt: { updating: "Atualizando...", update: "Atualizar Senha", backToLogin: "Voltar ao Login" },
      en: { updating: "Updating...", update: "Update Password", backToLogin: "Back to Login" },
      es: { updating: "Actualizando...", update: "Actualizar Contraseña", backToLogin: "Volver al Login" }
    };

    const currentLang = t("language") || 'pt';
    return buttonTexts[currentLang as keyof typeof buttonTexts] || buttonTexts.pt;
  };

  // Função para obter subtítulo traduzido
  const getSubtitle = () => {
    const subtitles = {
      pt: "Redefina sua senha",
      en: "Reset your password", 
      es: "Restablece tu contraseña"
    };

    const currentLang = t("language") || 'pt';
    return subtitles[currentLang as keyof typeof subtitles] || subtitles.pt;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      await updatePassword(email, token, newPassword);
      navigate("/login");
    } catch (error) {
      // Erro já tratado pelo hook
    } finally {
      setLoading(false);
    }
  };

  const placeholders = getPlaceholders();
  const buttonTexts = getButtonTexts();

  return (
    <Container>
      <ThemeToggle>
        <ThemeSelector />
      </ThemeToggle>

      <ResetCard>
        <Logo>
          <LogoText>{t("login.title") || "Documentin"}</LogoText>
          <Subtitle>{getSubtitle()}</Subtitle>
        </Logo>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <StyledInput
              type={showPassword ? "text" : "password"}
              placeholder={placeholders.newPassword}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </PasswordToggle>
            <PasswordStrengthIndicator strength={passwordStrength} />
            <PasswordHint>
              {getPasswordStrengthText()}
            </PasswordHint>
          </InputGroup>

          <InputGroup>
            <StyledInput
              type={showConfirmPassword ? "text" : "password"}
              placeholder={placeholders.confirmPassword}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </PasswordToggle>
            {confirmPassword.length > 0 && (
              <PasswordHint style={{ color: passwordsMatch ? '#10b981' : '#ef4444' }}>
                {getPasswordMatchText()}
              </PasswordHint>
            )}
          </InputGroup>

          <ResetButton
            type="submit"
            disabled={loading || !isFormValid}
          >
            {loading ? buttonTexts.updating : buttonTexts.update}
          </ResetButton>

          <div style={{ textAlign: "center" }}>
            <BackToLogin onClick={() => navigate("/login")}>
              {buttonTexts.backToLogin}
            </BackToLogin>
          </div>
        </Form>
      </ResetCard>
    </Container>
  );
};

export default ResetPassword;