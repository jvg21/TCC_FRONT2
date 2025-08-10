import styled from "styled-components";
import type { ColumnDef } from "../../types";

const Table = styled.table`
  width:100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
`;

const Th = styled.th`
  text-align:left; padding: 12px; font-size: 13px; border-bottom: 1px solid rgba(0,0,0,0.06);
`;

const Td = styled.td` padding: 12px; border-bottom: 1px solid rgba(0,0,0,0.04); vertical-align: middle;`;

type Props<T> = {
  columns: ColumnDef<T>[];
  data: T[];
};

export function DataTable<T extends Record<string, any>>({ columns, data }: Props<T>) {
  return (
    <Table>
      <thead>
        <tr>
          {columns.map((c) => <Th key={String(c.key)} style={{ width: c.width }}>{c.header}</Th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map((c) => (
              <Td key={String(c.key)}>
                {c.render ? c.render(row) : (row as any)[c.key as string]}
              </Td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
