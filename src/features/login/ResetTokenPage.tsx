import React, { useState } from "react";
import styled from "styled-components";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { useThemeContext } from "../../contexts/ThemeContext";
import { FiMail, FiSun, FiMoon } from "react-icons/fi";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}15,
    ${({ theme }) => theme.colors.background}
  );
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Card = styled.div`
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
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.primary}80
  );
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




const SendButton = styled(Button)`
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

const Footer = styled.div`
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

  export const ResetTokenPage: React.FC = () => {
  const { toggleTheme, themeName } = useThemeContext();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log("Recuperar senha para:", email);
      // Aqui iria a lógica real de envio do e-mail
    }, 1500);
  };

  return (
    <Container>
      <ThemeToggle onClick={toggleTheme} type="button">
        {themeName === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
      </ThemeToggle>

      <Card>
        <Logo>
          <LogoText>Documentin</LogoText>
          <Subtitle>Recupere o acesso à sua conta</Subtitle>
        </Logo>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <StyledInput
              type="email"
              placeholder="Digite seu token"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <SendButton type="submit" disabled={!email.trim() || isLoading}>
            {isLoading ? "Enviando..." : "Enviar token"}
          </SendButton>
        </Form>

        <Footer>
          Lembrou sua senha? <a href="/login">Fazer login</a>
        </Footer>
      </Card>
    </Container>
  );
};

export default ResetTokenPage;
