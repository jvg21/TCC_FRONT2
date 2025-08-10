import styled from "styled-components";
import React from "react";

const StyledButton = styled.button<{ variant?: "primary" | "ghost" | "danger" }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: none;
  cursor: pointer;
  font-weight: 600;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  ${({ variant, theme }) => variant === "primary" && `
    background: ${theme.colors.primary};
    color: white;
  `}
  ${({ variant, theme }) => variant === "danger" && `
    background: ${theme.colors.danger};
    color: white;
  `}
  ${({ variant, theme }) => variant === "ghost" && `
    background: transparent;
    color: ${theme.colors.text};
  `}
`;

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
};

export const Button: React.FC<Props> = ({ children, variant = "primary", ...rest }) => {
  return <StyledButton variant={variant} {...rest}>{children}</StyledButton>;
};
