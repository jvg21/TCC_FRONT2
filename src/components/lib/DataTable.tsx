import styled from "styled-components";
import type { ColumnDef } from "../../types";

const Table = styled.table`
  width:100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  width: 100%;
`;

const Th = styled.th`
  text-align:left; 
  padding: 12px; 
  font-size: 13px; 
  border-bottom: 1px solid rgba(0,0,0,0.06);
`;

const Td = styled.td`
  padding: 12px; 
  border-bottom: 1px solid rgba(0,0,0,0.04); 
  vertical-align: middle;
`;

const Tr = styled.tr`
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;


const EmptyTr = styled.tr`
  background-color: rgba(0, 0, 0, 0.01);
`;

type Props<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  pageSize?: number; 
};

export function DataTable<T extends Record<string, any>>({ columns, data, pageSize }: Props<T>) {
  
  const getEmptyRows = () => {
    if (!pageSize || data.length >= pageSize) return 0;
    return pageSize - data.length;
  };

  
  const emptyRowsCount = getEmptyRows();
  
  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            {columns.map((c) => <Th key={String(c.key)} style={{ width: c.width }}>{c.header}</Th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <Tr key={idx}>
              {columns.map((c) => (
                <Td key={String(c.key)}>
                  {c.render ? c.render(row) : (row as any)[c.key as string]}
                </Td>
              ))}
            </Tr>
          ))}

          {}
          {Array.from({ length: emptyRowsCount }).map((_, index) => (
            <EmptyTr key={`empty-${index}`}>
              {columns.map((c) => (
                <Td key={String(c.key)}>-</Td>
              ))}
            </EmptyTr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}