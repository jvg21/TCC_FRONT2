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
import { MarkdownEditorPage } from "../markdown-editor/MarkdownEditorPage";
import { useUser } from "../user/useUser";
import { useFolder } from "../folder/useFolder";
import { useNavigate } from "react-router-dom";

const DocumentPage: React.FC = () => {
  const { activeDocument, deactiveDocument, create, update, softDelete } = useDocument();
  const [searchStatus, setSearchStatus] = useState<number>(1);
  const Documents = searchStatus === 1 ? activeDocument : searchStatus === 2 ? deactiveDocument : [...activeDocument, ...deactiveDocument];
  const modal = useModal();
  const viewModal = useModal();
  const editorModal = useModal();
  const [editing, setEditing] = useState<Document | null>(null);
  const [viewing, setViewing] = useState<Document | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [contentSaveCallback, setContentSaveCallback] = useState<((content: string) => void) | null>(null);
  const [query, setQuery] = useState("");
  const { t } = useTranslation();
  const { userProfile } = useAuthContext();
  const { activeUser } = useUser()
  const { activeFolder } = useFolder()


  const navigate = useNavigate()
  const handleView = (document: Document) => {
    navigate(`/document/details/${document.DocumentId}`);
  };


  const handleEditContent = (document: Document) => {
    setEditingContent(document.Content || "");
    setContentSaveCallback(() => (newContent: string) => {
      update(document.DocumentId, { ...document, Content: newContent });
      editorModal.close();
    });
    editorModal.open();
  };

  const handleEditContentFromForm = (currentContent: string, onContentSaved: (newContent: string) => void) => {
    setEditingContent(currentContent);
    setContentSaveCallback(() => onContentSaved);
    editorModal.open();
  };

  const handleEditFromViewer = () => {
    if (viewing) {
      viewModal.close();
      setEditing(viewing);
      modal.open();
    }
  };

  const Columns = (onEdit: (c: Document) => void, onToggleStatus: (id: number) => void, onView: (c: Document) => void, onEditContent: (c: Document) => void): ColumnDef<Document>[] => {
    const baseCols: ColumnDef<Document>[] = [
      { key: "Title", header: t("documents.title_field"), render: (row) => row.Title || "-" },


      {
        key: "FolderId", header: t("documents.folder"), render: (row) => {
          const folder = activeFolder.filter((a) => a.FolderId === row.FolderId)[0]
          return folder ? folder.Name : "-";
        }
      },

      {
        key: "UserId", header: t("documents.creator"), render: (row) => {
          const creator = activeUser.filter((a) => a.UserId === row.UserId)[0]
          return creator ? creator.Name : "-";
        }
      },
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

  const handleSaveContent = (newContent: string) => {
    if (contentSaveCallback) {
      contentSaveCallback(newContent);
    }
    editorModal.close();
  };

  const columns = Columns(handleEdit, handleToggleStatus, handleView, handleEditContent);

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

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={editing ? t("documents.edit_document") : t("documents.add_document")}
      >
        <DocumentForm
          initial={editing ?? undefined}
          onCancel={modal.close}
          onSave={handleSave}
          onEditContent={handleEditContentFromForm}
        />
      </Modal>

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

      <Modal
        isOpen={editorModal.isOpen}
        onClose={editorModal.close}
        title="Editor de Markdown"
      >
        <MarkdownEditorPage
          initialContent={editingContent}
          onSave={handleSaveContent}
          onCancel={editorModal.close}
        />
      </Modal>
    </PageLayout>
  );
};

export default DocumentPage;