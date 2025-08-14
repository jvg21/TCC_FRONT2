import styled from "styled-components";
import React, { useState, useEffect } from "react";

const StyledInput = styled.input<{ hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid
    ${({ hasError, theme }) =>
      hasError ? theme.colors.danger : "rgba(0,0,0,0.08)"};
  width: 100%;
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ hasError, theme }) =>
      hasError ? theme.colors.danger : theme.colors.primary};
  }
`;

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 12px;
  margin-top: 2px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  regex?: RegExp;
  errorMessage?: string;
  onValidationChange?: (isValid: boolean) => void;
  maskFormat?: string; // Ex: "99.999.999/9999-99"
};

export const Input: React.FC<Props> = ({
  label,
  regex,
  errorMessage = "Formato inválido",
  onValidationChange,
  value,
  onChange,
  maskFormat,
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [showError, setShowError] = useState(false);

  // Aplica máscara baseada no formato informado
  const applyMask = (val: string) => {
    if (!maskFormat) return val;

    let onlyNumbers = val.replace(/\D/g, "");
    let masked = "";
    let numberIndex = 0;

    for (let i = 0; i < maskFormat.length; i++) {
      if (maskFormat[i] === "9") {
        if (onlyNumbers[numberIndex]) {
          masked += onlyNumbers[numberIndex++];
        }
      } else {
        masked += maskFormat[i];
      }
    }

    return masked;
  };

  useEffect(() => {
    if (regex && value && typeof value === "string") {
      const isValid = regex.test(value);
      setHasError(!isValid);
      setShowError(!isValid && value.length > 0);
      onValidationChange?.(isValid);
    } else {
      setHasError(false);
      setShowError(false);
      onValidationChange?.(true);
    }
  }, [value, regex, onValidationChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Aplica a máscara antes de enviar o valor
    if (maskFormat) {
      newValue = applyMask(newValue);
      e.target.value = newValue;
    }

    onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (regex && e.target.value) {
      setShowError(!regex.test(e.target.value));
    }
    rest.onBlur?.(e);
  };

  return (
    <Container>
      {label && <label style={{ fontSize: 13 }}>{label}</label>}
      <StyledInput
        hasError={hasError && showError}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        {...rest}
      />
      {showError && hasError && (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      )}
    </Container>
  );
};
