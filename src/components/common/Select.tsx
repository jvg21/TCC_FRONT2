import styled from "styled-components";
import React from "react";

const StyledSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid rgba(0, 0, 0, 0.08);
  width: 100%;
  font-size: 14px;
  background-color: white;
  appearance: none; /* remove estilo padrão do sistema */
`;

type Option = {
  value: string | number;
  label: string;
};

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: Option[];
};

export const Select: React.FC<Props> = ({ label, options, ...rest }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 13 }}>{label}</label>}
    <StyledSelect {...rest}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </StyledSelect>
  </div>
);
