import { FilterBar } from "../../components/lib/FilterBar";
import { DataTable } from "../../components/lib/DataTable";
import { Button } from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import type { ColumnDef } from "../../types";
import PageLayout from "../../components/common/PageLayout";
import type { Folder } from "./types";
import { FolderForm } from "./FolderForm";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFolder } from "./useFolder";
import { useUser } from "../user/useUser";
import { useAuthContext } from "../../context/AuthContext";
import { SelectSelector } from "../../components/lib/StatusSelector";
import { ActiveLabel } from "../../components/lib/ActiveLabel";
import { ActionButtons } from "../../components/lib/ActionButtons";


const FolderPage: React.FC = () => {
  const { activeFolder, deactiveFolder, create, update, softDelete } = useFolder();
  const [searchStatus, setSearchStatus] = useState<number>(1)
  const Folder = searchStatus === 1 ? activeFolder : searchStatus === 2 ? deactiveFolder : [...activeFolder, ...deactiveFolder]
  const [editing, setEditing] = useState<Folder | null>(null);
  const [query, setQuery] = useState("");
  const modal = useModal();
  const { t } = useTranslation();
  const { userProfile } = useAuthContext()

  const { activeUser } = useUser();


  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const resetToFirstPage = () => setCurrentPage(1);

  useEffect(() => {
    resetToFirstPage();
  }, [query, searchStatus]);

  const paginate = (rows: Folder[]) => {
    const start = (currentPage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  };

  const useIsNarrow = (breakpoint = 480) => {
    const [isNarrow, setIsNarrow] = useState(false);
    useEffect(() => {
      const onResize = () => setIsNarrow(window.innerWidth < breakpoint);
      onResize();
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }, [breakpoint]);
    return isNarrow;
  };

  const PaginationBar: React.FC<{ total: number }> = ({ total }) => {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const isNarrow = useIsNarrow();

    const canPrev = currentPage > 1;
    const canNext = currentPage < totalPages;

    
    const tt = (key: string, fallback: string) => {
      const v = t(key) as unknown as string;
      return v && v !== key ? v : fallback;
    };

    useEffect(() => {
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
    }, [totalPages]);

    const containerStyle: React.CSSProperties = isNarrow
      ? {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: 'auto auto',
        gap: 8,
        alignItems: 'center',
        paddingTop: 12,
      }
      : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        paddingTop: 12,
      };

    return (
      <div style={containerStyle}>
        <div style={{ fontSize: 14, color: '#666', textAlign: isNarrow ? 'center' : 'left', gridColumn: isNarrow ? '1 / -1' : undefined }}>
          {total > 0 ? (
            `${tt('pagination.showing', 'Mostrando')} ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, total)} ${tt('pagination.of', 'de')} ${total}`
          ) : (
            `${tt('pagination.showing', 'Mostrando')} 0 ${tt('pagination.of', 'de')} 0`
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 14, color: '#666' }}>{tt('pagination.rows_per_page', 'Itens/pág.')}</label>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); resetToFirstPage(); }}
            style={{ padding: '6px 8px', border: '1px solid #ced4da', borderRadius: 6 }}
          >
            {[5, 10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifySelf: isNarrow ? 'end' : 'flex-end' }}>
          <Button
            variant="ghost"
            aria-label={tt('pagination.prev', 'Anterior')}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={!canPrev}
          >
            <FiChevronLeft /> {!isNarrow && tt('pagination.prev', 'Anterior')}
          </Button>
          <div style={{ minWidth: 64, textAlign: 'center' }}>{currentPage} / {totalPages || 1}</div>
          <Button
            variant="ghost"
            aria-label={tt('pagination.next', 'Próxima')}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={!canNext}
          >
            {!isNarrow && tt('pagination.next', 'Próxima')} <FiChevronRight />
          </Button>
        </div>
      </div>
    );
  };




  const Columns = (onEdit: (c: Folder) => void, onToggleStatus: (id: number) => void): ColumnDef<Folder>[] => {
    const baseCols: ColumnDef<Folder>[] = [
      { key: "Name", header: t("folders.name"), render: (row) => row.Name || "-" },
      {
        key: "ParentFolderId",
        header: t("folders.parent_folder"),
        render: (row) => {
          if (!row.ParentFolderId) return t("folders.no_parent_folder");
          const parentFolder = Folder.find(f => f.FolderId === row.ParentFolderId);
          return parentFolder ? parentFolder.Name : '-';
        }
      },
      {
        key: "UserId", header: t("folders.user"), render: (row) => {
          const userObj = activeUser.find(f => f.UserId === row.UserId);
          return userObj ? userObj.Name : "-";
        }
      },
      {
        key: "ValidatorId", header: t("folders.validator"), render: (row) => {
          const userObj = activeUser.find(f => f.UserId === row.ValidatorId);
          return userObj ? userObj.Name : "-";
        }
      },
      {
        key: "IsActive",
        header: t("folders.is_active"),
        render: (row) => <ActiveLabel IsActive={row.IsActive} />
      },
    ]
    if (userProfile) {
      baseCols.push({
        key: "actions",
        header: t("actions.actions"),
        render: (row) => (
          <ActionButtons onEdit={onEdit} onToggleStatus={onToggleStatus} row={row} id={row.FolderId} />
        )
      });
    }
    return baseCols
  }

  const filteredFolder = React.useMemo(() => {
    if (!query) return Folder;

    const searchQuery = query.toLowerCase();
    return Folder.filter(folder => {
      const parentFolderName = folder.ParentFolderId
        ? Folder.find(f => f.FolderId === folder.ParentFolderId)?.Name || ""
        : "";

      const searchableText = [
        folder.Name || "",
        parentFolderName,
        folder.ValidatorId?.toString() || "",
        folder.UserId?.toString() || ""
      ].join(" ").toLowerCase();

      return searchableText.includes(searchQuery);
    });
  }, [Folder, query]);

  const handleAdd = () => {
    setEditing(null);
    modal.open();
  };

  const handleEdit = (c: Folder) => {
    setEditing(c);
    modal.open();
  };

  const handleSave = (payload: any) => {
    if (editing) {
      update(editing.FolderId, payload);
    } else {
      create(payload);
    }
    modal.close();
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await softDelete(id);
    } catch (error) {
      console.error("Erro ao alterar status da folder:", error);
    }
  };

  const columns = Columns(handleEdit, handleToggleStatus);

  return (
    <PageLayout title={t("folders.title")} actions={<Button disabled={!userProfile} onClick={handleAdd}><FiPlus />&nbsp;{t("folders.add_folder")}</Button>}>
      <FilterBar
        columns={columns}
        value={query}
        onChange={setQuery}
        placeholder={t("folders.search_folders")}
      />
      {
        userProfile &&
        <SelectSelector changeFunction={setSearchStatus} searchStatus={searchStatus} />
      }
      {}
      <DataTable columns={columns} data={paginate(filteredFolder)} pageSize={pageSize} />

      {}
      <PaginationBar total={filteredFolder.length} />
      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editing ? t("folders.edit_folder") : t("folders.add_folder")}>
        <FolderForm initial={editing ?? undefined} onCancel={modal.close} onSave={handleSave} />
      </Modal>
    </PageLayout>
  );
};

export default FolderPage;