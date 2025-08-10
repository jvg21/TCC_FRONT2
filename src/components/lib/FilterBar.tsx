import React from "react";
import { Input } from "../common/Input";
import styled from "styled-components";

const Wrap = styled.div`
  display:flex; gap: 12px; align-items:center; margin-bottom: 12px;
`;

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export const FilterBar: React.FC<Props> = ({ value, onChange }) => {
  return (
    <Wrap>
      <Input placeholder="Buscar..." value={value} onChange={(e) => onChange(e.target.value)} />
    </Wrap>
  );
};
