import React, { useState } from "react";
import { FilterBar } from "../../components/lib/FilterBar";
import { DataTable } from "../../components/lib/DataTable";
import { Button } from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import { FiPlus, FiEye } from "react-icons/fi";
import type { ColumnDef } from "../../types";
import PageLayout from "../../components/common/PageLayout";
import { DocumentForm } from "./DocumentForm";
import { useDocument } from "./useDocument";
import type { Document } from "./types";
import { useTranslation } from "react-i18next";
import { SelectSelector } from "../../components/lib/StatusSelector";
import { useAuthContext } from "../../context/AuthContext";
import { ActiveLabel } from "../../components/lib/ActiveLabel";
import { ActionButtons } from "../../components/lib/ActionButtons";
import { DocumentViewer } from "./DocumentViewer";

const DocumentPage: React.FC = () => {
  const { activeDocument, deactiveDocument, create, update, softDelete } = useDocument();
  const [searchStatus, setSearchStatus] = useState<number>(1);
  const Documents = searchStatus === 1 ? activeDocument : searchStatus === 2 ? deactiveDocument : [...activeDocument, ...deactiveDocument];
  const modal = useModal();
  // ✅ NOVO MODAL PARA VISUALIZAÇÃO
  const viewModal = useModal();
  const [editing, setEditing] = useState<Document | null>(null);
  // ✅ NOVO STATE PARA DOCUMENTO SENDO VISUALIZADO
  const [viewing, setViewing] = useState<Document | null>(null);
  const [query, setQuery] = useState("");
  const { t } = useTranslation();
  const { userProfile } = useAuthContext();

  // ✅ NOVA FUNÇÃO PARA VISUALIZAR DOCUMENTO
  const handleView = (document: Document) => {
    setViewing(document);
    viewModal.open();
  };

  // ✅ FUNÇÃO PARA EDITAR A PARTIR DO VISUALIZADOR
  const handleEditFromViewer = () => {
    if (viewing) {
      viewModal.close();
      setEditing(viewing);
      modal.open();
    }
  };

  // ✅ MODIFICAÇÃO NAS COLUNAS PARA INCLUIR BOTÃO DE VISUALIZAÇÃO
  const Columns = (onEdit: (c: Document) => void, onToggleStatus: (id: number) => void, onView: (c: Document) => void): ColumnDef<Document>[] => {
    const baseCols: ColumnDef<Document>[] = [
      { key: "Title", header: t("documents.title_field"), render: (row) => row.Title || "-" },
      { key: "FolderId", header: t("documents.folder"), render: (row) => row.FolderId || "-" },
      { key: "UserId", header: t("documents.creator"), render: (row) => row.UserId || "-" },
      {
        key: "IsActive",
        header: t("documents.is_active"),
        render: (row) => <ActiveLabel IsActive={row.IsActive} />
      }
    ];
    
    if (userProfile) {
      baseCols.push({
        key: "actions",
        header: t("actions.actions"),
        render: (row) => (
          <div style={{ display: 'flex', gap: '4px' }}>
            {/* ✅ NOVO BOTÃO DE VISUALIZAR */}
            <Button 
              variant="ghost" 
              onClick={() => onView(row)}
              title="Visualizar documento"
            >
              <FiEye />
            </Button>
            <ActionButtons onEdit={onEdit} onToggleStatus={onToggleStatus} row={row} id={row.DocumentId} />
          </div>
        )
      });
    }
    return baseCols;
  };

  const filteredDocument = React.useMemo(() => {
    if (!query) return Documents;

    const searchQuery = query.toLowerCase();

    return Documents.filter(document => {
      const searchableText = [
        document.Title || "",
        document.Content || "",
      ].join(" ").toLowerCase();

      return searchableText.includes(searchQuery);
    });
  }, [Documents, query]);

  const handleAdd = () => {
    setEditing(null);
    modal.open();
  };

  const handleEdit = (c: Document) => {
    setEditing(c);
    modal.open();
  };

  const handleSave = async (payload: any) => {
    try {
      if (editing) {
        await update(editing.DocumentId, payload);
      } else {
        await create(payload);
      }
      modal.close();
    } catch (error) {
      console.error("Erro ao salvar documento:", error);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await softDelete(id);
    } catch (error) {
      console.error("Erro ao alterar status do documento:", error);
    }
  };

  // ✅ MODIFICAÇÃO PARA INCLUIR handleView
  const columns = Columns(handleEdit, handleToggleStatus, handleView);

  return (
    <PageLayout
      title={t("documents.title")}
      actions={
        <Button disabled={!userProfile} onClick={handleAdd}>
          <FiPlus />&nbsp;{t("documents.add_document")}
        </Button>
      }
    >
      <FilterBar
        columns={columns}
        value={query}
        onChange={setQuery}
        placeholder={t("documents.search_documents")}
      />
      {userProfile && (
        <SelectSelector changeFunction={setSearchStatus} searchStatus={searchStatus} />
      )}
      <DataTable columns={columns} data={filteredDocument} />
      
      {/* ✅ MODAL EXISTENTE PARA EDIÇÃO */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={editing ? t("documents.edit_document") : t("documents.add_document")}
      >
        <DocumentForm
          initial={editing ?? undefined}
          onCancel={modal.close}
          onSave={handleSave}
        />
      </Modal>

      {/* ✅ NOVO MODAL PARA VISUALIZAÇÃO */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={viewModal.close}
        title="Visualizar Documento"
      >
        {viewing && (
          <DocumentViewer
            title={viewing.Title || "Documento sem título"}
            content={viewing.Content || ""}
            onEdit={handleEditFromViewer}
            onClose={viewModal.close}
          />
        )}
      </Modal>
    </PageLayout>
  );
};

export default DocumentPage;