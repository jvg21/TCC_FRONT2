import React, { useState } from "react";
import styled from "styled-components";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ThemeSelector } from "../../components/common/ThemeSelector";
import { useLogin } from "./useLogin";
import { useNavigate } from "react-router-dom";

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

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/");
      window.location.reload(); // ← ADICIONAR ESTA LINHA

    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const canSubmit = email.trim().length > 0 && password.length > 0;

  return (
    <Container>
      <ThemeSelector />

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
            <ForgotLink href="/resetpassword" >Esqueceu a senha?</ForgotLink>
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