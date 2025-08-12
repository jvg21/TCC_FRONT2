import { Input } from "../common/Input";
import styled from "styled-components";
import type { ColumnDef } from "../../types";

const Wrap = styled.div`
  display: flex; 
  gap: 12px; 
  align-items: center; 
  margin-bottom: 12px;
`;

type Props<T> = {
  columns: ColumnDef<T>[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function FilterBar<T extends Record<string, any>>({ 
  columns, 
  value, 
  onChange, 
  placeholder = "Buscar..."
}: Props<T>) {
  return (
    <Wrap>
      <Input 
        placeholder={placeholder} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </Wrap>
  );
}