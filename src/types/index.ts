export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

export interface ApiResponse {
  mensagem: string;
  objeto: any;
  erro: boolean;
}