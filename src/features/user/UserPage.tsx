import React, { useState, useEffect } from "react";
import { FilterBar } from "../../components/lib/FilterBar";
import { DataTable } from "../../components/lib/DataTable";
import { Button } from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import { FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { ColumnDef } from "../../types";
import PageLayout from "../../components/common/PageLayout";
import type { User } from "./types";
import { UserForm } from "./UserForm";
import { useUser } from "./useUser";
import { useTranslation } from "react-i18next";
import { profiles } from "../../enum/userProfile";
import { SelectSelector } from "../../components/lib/StatusSelector";
import { useAuthContext } from "../../context/AuthContext";
import { ActiveLabel } from "../../components/lib/ActiveLabel";
import { ActionButtons } from "../../components/lib/ActionButtons";
import { useCompanies } from "../companies/useCompanies";

const UserPage: React.FC = () => {
  const { activeUser, deactiveUser, create, update, softDelete } = useUser();
  const { activeCompanies } = useCompanies();
  const [searchStatus, setSearchStatus] = useState<number>(1);
  const User = searchStatus === 1 ? activeUser : searchStatus === 2 ? deactiveUser : [...activeUser, ...deactiveUser];
  const [editing, setEditing] = useState<User | null>(null);
  const [query, setQuery] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

  const modal = useModal();
  const { t } = useTranslation();
  const { userProfile, user } = useAuthContext();
  const isDev = user?.Profile === 1;

  // ==== Paginação (adição) ====
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const resetToFirstPage = () => setCurrentPage(1);

  useEffect(() => {
    resetToFirstPage();
  }, [query, searchStatus, selectedCompanyId]);

  const paginate = (rows: User[]) => {
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
        <div style={{ fontSize: 14, color: '#666', textAlign: isNarrow ? 'center' : 'left', gridColumn: isNarrow ? '1 / -1' : undefined }}>
          {tt('pagination.showing', 'Mostrando')} {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, total)} {tt('pagination.of', 'de')} {total}
        </div>

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

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifySelf: isNarrow ? 'end' : 'flex-end' }}>
          <Button variant="ghost" aria-label={tt('pagination.prev', 'Anterior')} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={!canPrev}>
            <FiChevronLeft /> {!isNarrow && tt('pagination.prev', 'Anterior')}
          </Button>
          <div style={{ minWidth: 64, textAlign: 'center' }}>{currentPage} / {totalPages}</div>
          <Button variant="ghost" aria-label={tt('pagination.next', 'Próxima')} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={!canNext}>
            {!isNarrow && tt('pagination.next', 'Próxima')} <FiChevronRight />
          </Button>
        </div>
      </div>
    );
  };
  // ==== fim paginação ====

  const Columns = (onEdit: (c: User) => void, onToggleStatus: (id: number) => void): ColumnDef<User>[] => {
    const baseCols: ColumnDef<User>[] = [
      { key: "Name", header: t("users.name"), render: (row) => row.Name || "-" },
      {
        key: "Profile", header: t("users.profile"), render: (row) => {
          const profileObj = profiles.find(p => p.value === row.Profile.toString());
          return profileObj ? profileObj.label : "-";
        }
      },
      { key: "Email", header: t("users.email"), render: (row) => row.Email || "-" },
      {
        key: "IsActive",
        header: t("companies.is_active"),
        render: (row) => <ActiveLabel IsActive={row.IsActive} />
      },
    ];

    if (isDev) {
      baseCols.push({
        key: "CompanyId", header: t("users.company"), render: (row) => {
          const company = activeCompanies.find(c => c.CompanyId === row.CompanyId);
          return company ? company.Name : "-";
        }
      });
    }

    if (userProfile) {
      baseCols.push({
        key: "actions",
        header: t("actions.actions"),
        render: (row) => (
          <ActionButtons onEdit={onEdit} onToggleStatus={onToggleStatus} row={row} id={row.UserId} />
        )
      });
    }
    return baseCols;
  };

  const filteredUser = React.useMemo(() => {
    let filtered = User;

    if (isDev) {
      if (!selectedCompanyId) {
        return [];
      } else {
        filtered = filtered.filter(user => user.CompanyId === selectedCompanyId);
      }
    }

    if (query) {
      const searchQuery = query.toLowerCase();
      filtered = filtered.filter(user => {
        const searchableText = [user.Name || "", user.Profile || "", user.Email || ""].join(" ").toLowerCase();
        return searchableText.includes(searchQuery);
      });
    }

    return filtered;
  }, [User, query, isDev, selectedCompanyId]);

  const handleAdd = () => {
    setEditing(null);
    modal.open();
  };

  const handleEdit = (c: User) => {
    setEditing(c);
    modal.open();
  };

  const handleSave = (payload: any) => {
    if (editing) {
      if (isDev && selectedCompanyId) {
        payload.CompanyId = selectedCompanyId;
      }
      update(editing.UserId, payload);
    } else {
      if (isDev && selectedCompanyId) {
        payload.CompanyId = selectedCompanyId;
      }
      create(payload);
    }
    modal.close();
  };

  const handleDelete = (id: number) => {
    softDelete(id);
  };

  const columns = Columns(handleEdit, handleDelete);

  return (
    <PageLayout title={t("users.title")} actions={<Button disabled={isDev ? !selectedCompanyId : !userProfile} onClick={handleAdd}><FiPlus />&nbsp;{t("users.add_user")}</Button>}>
      <FilterBar columns={columns} value={query} onChange={setQuery} placeholder={t("users.search_users")} />
      {userProfile && <SelectSelector changeFunction={setSearchStatus} searchStatus={searchStatus} />}

      {isDev && (
        <div style={{ marginBottom: '16px' }}>
          <select
            value={selectedCompanyId || ""}
            onChange={(e) => setSelectedCompanyId(e.target.value ? Number(e.target.value) : null)}
            style={{ padding: '8px 12px', border: '1px solid #ffffff', borderRadius: '4px', fontSize: '14px', minWidth: '200px' }}
          >
            <option value="">{t("users.no_select")}</option>
            {activeCompanies.map(company => (
              <option key={company.CompanyId} value={company.CompanyId}>{company.Name}</option>
            ))}
          </select>
        </div>
      )}

      {(() => {
        const total = filteredUser.length;
        const page = paginate(filteredUser);
        return (
          <>
            <DataTable columns={columns} data={page} />
            <PaginationBar total={total} />
          </>
        );
      })()}

      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editing ? t("users.edit_user") : t("users.add_user")}>
        <UserForm initial={editing ?? undefined} onCancel={modal.close} onSave={handleSave} />
      </Modal>
    </PageLayout>
  );
};

export default UserPage;

