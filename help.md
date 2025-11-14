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

Add uma propriedade nova no back-end:

1 - Encontre o arquivo na pasta Domain/Models referente a entidade que deseja alterar, vamos supor que eu quero mudar o usuário então eu pego o arquivo "User.cs".

2 - Adicione  a propriedade na classe, por exemplo se eu quiser adicionar a data de nascimento do usuário eu coloco uma linha com o conteudo "public DateTime BirthDate { get; set; }" e se for uma propriedade não anulável, você deve colocar a tag "[Required]".

3 - Agora você precisa aplicar essa alteração no banco e para isso, na parte superior da tela você vai clicar em Ferramentas > NuGet Package Manager > Console
   3.1 - Digite "add-migration <Aqui vai o nome da migração que quiser>" por ex "add-migration adicionando_birthdate" e aperte enter.
   3.2 - Quando ele criar um arquivo parecido com migration1513121.cs você precisa confirmar essa mudanças no banco e para isso você vai digitar, ainda no console, "update-database", mas antes certifique-se que lá no arquivo Program.cs está apontando para o seu banco de dados local.

4 - Após isso as alterações no banco foram bem sucedidas, porém os métodos ainda não estão retornando e/ou tratando essa nova propriedade pois nosso projeto utiliza DTOs para receber ou enviar objetos. Então vamos buscar na pasta DTOs nosso objeto de resposta (no meu caso seria o User/UserResponseDTO.cs) e o de requisição (no meu caso seria o User/UserResponseDTO.cs). Basta adicionar a propriedade nos dois, bem como adicionamos antes na model e pronto, seria assim "public DateTime BirthDate { get; set; }" sem necessidade de tag Required.

5 - A única coisa que ainda não estaria funcionando seria o método PUT (update de usuário nesse caso). Para isso precisaríamos ir na pasta "Repository", encontrar nosso arquivo referente a nossa entidade (no meu caso seria o UserRepository.cs) e procurar o método de update, que provavelmente terá o prefixo "Update" no nome. Aí basta colocar uma linha para setar (no meu caso) o BirthDate da model do banco igual ao BirthDate do DTO e pronto, por ex "userDB.BirthDate = dto.BirthDate;" 

6 - É isso! O último passo agora é assumir que o Clube Athletico Paranaense é o maior clube do Brasil e seu trabalho estará pronto!