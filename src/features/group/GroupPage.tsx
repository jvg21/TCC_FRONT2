import React, { useState, useEffect } from "react";
import { FilterBar } from "../../components/lib/FilterBar";
import { DataTable } from "../../components/lib/DataTable";
import { Button } from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import { FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { ColumnDef } from "../../types";
import PageLayout from "../../components/common/PageLayout";
import type { Group } from "./types";
import { GroupForm } from "./GroupForm";
import { useGroup } from "./useGroup";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../context/AuthContext";
import { SelectSelector } from "../../components/lib/StatusSelector";
import { ActiveLabel } from "../../components/lib/ActiveLabel";
import { ActionButtons } from "../../components/lib/ActionButtons";

const GroupPage: React.FC = () => {
  const { activeGroup, deactiveGroup, create, update, softDelete } = useGroup();
  const [searchStatus, setSearchStatus] = useState<number>(1);
  const Group = searchStatus === 1 ? activeGroup : searchStatus === 2 ? deactiveGroup : [...activeGroup, ...deactiveGroup];
  const [editing, setEditing] = useState<Group | null>(null);
  const [query, setQuery] = useState("");
  const modal = useModal();
  const { t } = useTranslation();
  const { userProfile } = useAuthContext();


  // ==== Paginação (adição) ====
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const resetToFirstPage = () => setCurrentPage(1);

  useEffect(() => {
    resetToFirstPage();
  }, [query, searchStatus]);

  const paginate = (rows: Group[]) => {
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

    // helper para fallback de i18n quando a key não existir
    const tt = (key: string, fallback: string) => {
      const v = t(key) as unknown as string;
      return v && v !== key ? v : fallback;
    };

    useEffect(() => {
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
    }, [totalPages]);

    if (total === 0) return null;

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
        {/* Texto "Exibindo X–Y de Z" */}
        <div style={{ fontSize: 14, color: '#666', textAlign: isNarrow ? 'center' : 'left', gridColumn: isNarrow ? '1 / -1' : undefined }}>
          {tt('pagination.showing', 'Mostrando')} {(currentPage - 1) * pageSize + 1}
          –{Math.min(currentPage * pageSize, total)} {tt('pagination.of', 'de')} {total}
        </div>

        {/* Seletor de Linhas por página */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 14, color: '#666' }}>{tt('pagination.rows_per_page', 'Itens/pág.')}</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              resetToFirstPage();
            }}
            style={{ padding: '6px 8px', border: '1px solid #ced4da', borderRadius: 6 }}
          >
            {[5, 10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Navegação */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifySelf: isNarrow ? 'end' : 'flex-end' }}>
          <Button
            variant="ghost"
            aria-label={tt('pagination.prev', 'Anterior')}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={!canPrev}
          >
            <FiChevronLeft /> {!isNarrow && tt('pagination.prev', 'Anterior')}
          </Button>
          <div style={{ minWidth: 64, textAlign: 'center' }}>
            {currentPage} / {totalPages}
          </div>
          <Button
            variant="ghost"
            aria-label={tt('pagination.next', 'Próxima')}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={!canNext}
          >
            {!isNarrow && tt('pagination.next', 'Próxima')} <FiChevronRight />
          </Button>
        </div>
      </div>
    );
  };
  // ==== fim paginação ====

  const Columns = (onEdit: (c: Group) => void, onToggleStatus: (id: number) => void): ColumnDef<Group>[] => {
    const baseCols: ColumnDef<Group>[] = [
      { key: "Name", header: t("groups.name"), render: (row) => row.Name || "-" },
      { key: "Description", header: t("groups.description"), render: (row) => row.Description || "-" },
      {
        key: "IsActive",
        header: t("groups.is_active"),
        render: (row) => <ActiveLabel IsActive={row.IsActive} />
      },
    ];
    if (userProfile) {
      baseCols.push({
        key: "actions",
        header: t("actions.actions"),
        render: (row) => (
          <ActionButtons onEdit={onEdit} onToggleStatus={onToggleStatus} row={row} id={row.GroupId} />
        )
      });
    }
    return baseCols;
  };

  const filteredGroup = React.useMemo(() => {
    if (!query) return Group;

    const searchQuery = query.toLowerCase();
    return Group.filter(group => {
      const searchableText = [group.Name || '', group.Description || ''].join(' ').toLowerCase();
      return searchableText.includes(searchQuery);
    });
  }, [Group, query]);

  const handleAdd = () => {
    setEditing(null);
    modal.open();
  };

  const handleEdit = (c: Group) => {
    setEditing(c);
    modal.open();
  };

  const handleSave = (payload: any) => {
    if (editing) {
      update(editing.GroupId, payload);
    } else {
      create(payload);
    }
    modal.close();
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await softDelete(id);
    } catch (error) {
      console.error('Erro ao alterar status do grupo:', error);
    }
  };

  const columns = Columns(handleEdit, handleToggleStatus);

  return (
    <PageLayout title={t('groups.title')} actions={<Button disabled={!userProfile} onClick={handleAdd}><FiPlus />&nbsp;{t('groups.add_group')}</Button>}>
      <FilterBar columns={columns} value={query} onChange={setQuery} placeholder={t('groups.search_groups')} />
      {userProfile && <SelectSelector changeFunction={setSearchStatus} searchStatus={searchStatus} />}

      {(() => {
        const total = filteredGroup.length;
        const page = paginate(filteredGroup);
        return (
          <>
            <DataTable columns={columns} data={page} />
            <PaginationBar total={total} />
          </>
        );
      })()}

      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editing ? t('groups.edit_group') : t('groups.add_group')}>
        <GroupForm initial={editing ?? undefined} onCancel={modal.close} onSave={handleSave} />
      </Modal>
    </PageLayout>
  );
};

export default GroupPage;




