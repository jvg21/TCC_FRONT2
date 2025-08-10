import styled from "styled-components";
import React from "react";

const StyledInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid rgba(0,0,0,0.08);
  width: 100%;
  font-size: 14px;
`;

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string };

export const Input: React.FC<Props> = ({ label, ...rest }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 13 }}>{label}</label>}
    <StyledInput {...rest}/>
  </div>
);
