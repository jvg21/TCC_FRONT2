import React, { useState } from "react";
import styled from "styled-components";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { useThemeContext } from "../../contexts/ThemeContext";
import { FiEye, FiEyeOff, FiUser, FiLock, FiSun, FiMoon } from "react-icons/fi";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}15, ${({ theme }) => theme.colors.background});
  padding: ${({ theme }) => theme.spacing.lg};
`;

const LoginCard = styled.div`
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
    padding-left: 40px;
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
  border-radius: 4px;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const RememberForgot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: -8px 0 8px 0;
`;

const CheckboxGroup = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

const ForgotLink = styled.a`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LoginButton = styled(Button)`
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px ${({ theme }) => theme.colors.primary}40;
  }
`;

const ThemeToggle = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const Divider = styled.div`
  margin: 24px 0;
  text-align: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(0, 0, 0, 0.08);
  }
  
  span {
    background: ${({ theme }) => theme.colors.surface};
    padding: 0 16px;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 14px;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
`;

const LoginPage: React.FC = () => {
  const { toggleTheme, themeName } = useThemeContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log("Login attempt:", { email, password, rememberMe });
      // Here you would handle the actual login logic
    }, 1500);
  };

  const canSubmit = email.trim().length > 0 && password.length > 0;

  return (
    <Container>
      <ThemeToggle onClick={toggleTheme} type="button">
        {themeName === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
      </ThemeToggle>
      
      <LoginCard>
        <Logo>
          <LogoText>Documentin</LogoText>
          <Subtitle>Faça login em sua conta</Subtitle>
        </Logo>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <StyledInput
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <StyledInput
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </PasswordToggle>
          </InputGroup>

          <RememberForgot>
            <CheckboxGroup>
              <Checkbox
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Lembrar de mim
            </CheckboxGroup>
            <ForgotLink>Esqueceu a senha?</ForgotLink>
          </RememberForgot>

          <LoginButton
            type="submit"
            disabled={!canSubmit || isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </LoginButton>
        </Form>
      </LoginCard>
    </Container>
  );
};

export default LoginPage;