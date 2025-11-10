## 📝 Como Adicionar um Novo Campo em Document

### 1️⃣ Atualizar a Interface TypeScript
**Arquivo:** `src/features/document/types.ts`

```typescript
export interface Document {
  DocumentId: number;
  Title: string;
  Content: string;
  FolderId: number | null;
  UserId: number;
  CreatedAt: string;
  UpdatedAt: string;
  IsActive: boolean;
  
  // Adicionar novo campo aqui
  NovoCAMPO?: string|null;  // Exemplo: Author?: string;
}
```

### 2️⃣ Atualizar Transformações da API
**Arquivo:** `src/features/document/useDocument.ts`

**A) Função `transformApiDataToPascalCase`:**

```typescript
const transformApiDataToPascalCase = (apiData: any[]): Document[] => {
  return apiData.map(item => ({
    DocumentId: item.documentId,
    Title: item.title,
    Content: item.content,
    FolderId: item.folderId,
    UserId: item.userId,
    CreatedAt: item.createdAt,
    UpdatedAt: item.updatedAt,
    IsActive: item.isActive,
    // Adicionar aqui
    NovoCAMPO: item.novoCAMPO,
  }));
};
```

**B) Função `transformPayloadToCamelCase`:**
```typescript
const transformPayloadToCamelCase = (payload: any) => {
  return {
    title: payload.Title,
    content: payload.Content,
    folderId: payload.FolderId || null,
    userId: user?.UserId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    // Adicionar aqui
    novoCAMPO: payload.NovoCAMPO,
  };
};
```

### 3️⃣ Atualizar Formulário de Criação/Edição
**Arquivo:** `src/features/document/DocumentForm.tsx` (ou similar)

```typescript
// Adicionar state para o novo campo
const [novoCAMPO, setNovoCAMPO] = useState("");

// Adicionar input no formulário
<input
  type="text"
  value={novoCAMPO}
  onChange={(e) => setNovoCAMPO(e.target.value)}
  placeholder="Novo Campo"
/>

// Incluir o novo campo ao salvar
handleSubmit -> {
  onSave({ 
    Title, 
    Content, 
    FolderId: parseInt(FolderId),
    NovoCAMPO: novoCAMPO 
  });
}
```

### 4️⃣ Atualizar Colunas da Tabela
**Arquivo:** Onde estão as colunas da tabela (possivelmente `DocumentPage.tsx`)

```typescript
{
  key: "NovoCAMPO",  // Exemplo: Author
  header: "Novo Campo", // Exemplo: "Author"
  render: (row) => (
    <span>{row.NovoCAMPO || "N/A"}</span> // Exemplo: {row.Author || "N/A"}
  )
}
```