import React, { useEffect, useState } from "react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import type { Group } from "./types";
import { useTranslation } from "react-i18next";
import { Row } from "../../components/common/Row";
import { Col } from "../../components/common/Col";
import { useUser } from "../user/useUser";
import { useGroup } from "./useGroup";
import { useFolder } from "../folder/useFolder";
import { FiPlus, FiX } from "react-icons/fi";

type Props = {
  initial?: Partial<Group>;
  isEditing?: boolean;
  onCancel: () => void;
  onSave: (data: Omit<Group, "GroupId" | "CreatedAt" | "UpdatedAt" | "IsActive"> & Partial<Group>) => void;
};

export const GroupForm: React.FC<Props> = ({ initial = {}, isEditing = false, onCancel, onSave }) => {
  const [Name, setName] = useState(initial.Name ?? "");
  const [Description, setDescription] = useState(initial.Description ?? "");
  const [IsActive, setIsActive] = useState(initial.IsActive ?? "");
  const { t } = useTranslation();
  const { activeUser } = useUser();
  const { getUsersByGroup, addUserToGroup, removeUserFromGroup, getFoldersByGroup } = useGroup();
  const [groupUsers, setGroupUsers] = useState<any[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showUserSection, setShowUserSection] = useState(false);
  const { activeFolder, addFolderXGroup, deleteFolderXGroup, getListFolderXGroupByFolder } = useFolder();
  const [groupFolders, setGroupFolders] = useState<any[]>([]);
  const [availableFolders, setAvailableFolders] = useState<any[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [showFolderSection, setShowFolderSection] = useState(false);

  useEffect(() => {
    setName(initial.Name ?? "");
    setDescription(initial.Description ?? "");
    setIsActive(initial.IsActive ? 'true' : 'false');
  }, [initial.Name, initial.Description, initial.IsActive]);

  useEffect(() => {
    if (initial?.GroupId && showUserSection) {
      loadGroupUsers();
    }
  }, [initial?.GroupId, showUserSection]);

  useEffect(() => {
    if (initial?.GroupId && showFolderSection) {
      loadGroupFolders();
    }
  }, [initial?.GroupId, showFolderSection]);

  useEffect(() => {
    
    const usersNotInGroup = activeUser.filter(user =>
      !groupUsers.some(groupUser => groupUser.UserId === user.UserId)
    );
    setAvailableUsers(usersNotInGroup);
  }, [activeUser, groupUsers]);

  useEffect(() => {
    
    const foldersNotInGroup = activeFolder.filter(folder =>
      !groupFolders.some(groupFolder => groupFolder.FolderId === folder.FolderId)
    );
    setAvailableFolders(foldersNotInGroup);
  }, [activeFolder, groupFolders]);

  const loadGroupUsers = async () => {
    if (initial?.GroupId) {
      try {
        const users = await getUsersByGroup(initial.GroupId);
        setGroupUsers(users);
      } catch (error) {
        console.error("Erro ao carregar usuários do grupo:", error);
      }
    }
  };

  const loadGroupFolders = async () => {
    if (initial?.GroupId) {
      try {
        const folders = await getFoldersByGroup(initial.GroupId);
        setGroupFolders(folders);
      } catch (error) {
        console.error("Erro ao carregar pastas do grupo:", error);
      }
    }
  };

  const handleAddUser = async () => {
    if (selectedUserId && initial?.GroupId) {
      try {
        await addUserToGroup(selectedUserId, initial.GroupId);
        setSelectedUserId(null);
        loadGroupUsers();
      } catch (error) {
        console.error("Erro ao adicionar usuário:", error);
      }
    }
  };

  const handleRemoveUser = async (userId: number) => {
    if (initial?.GroupId) {
      try {
        await removeUserFromGroup(userId, initial.GroupId);
        loadGroupUsers();
      } catch (error) {
        console.error("Erro ao remover usuário:", error);
      }
    }
  };

  const handleAddFolder = async () => {
    if (selectedFolderId && initial?.GroupId) {
      try {
        await addFolderXGroup(selectedFolderId, initial.GroupId);
        setSelectedFolderId(null);
        loadGroupFolders();
      } catch (error) {
        console.error("Erro ao adicionar pasta:", error);
      }
    }
  };

  const handleRemoveFolder = async (folderId: number) => {
    if (initial?.GroupId) {
      try {
        await deleteFolderXGroup(folderId, initial.GroupId);
        loadGroupFolders();
      } catch (error) {
        console.error("Erro ao remover pasta:", error);
      }
    }
  };

  const validateFields = () => {
    const isNameValid = Name.trim().length > 0;
    console.log("Validation results:", {
      isNameValid,
    });
    return isNameValid;
  };

  const canSave = validateFields();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    const formattedIsActive = IsActive === "true";

    onSave({ Name, Description, IsActive: formattedIsActive });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Col>
          <Input
            label={t("groups.name")}
            maxLength={20}
            minLength={3}
            required
            value={Name}
            onChange={(e) => setName(e.target.value)}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          {}
          <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
            {t("groups.description")}
          </label>
          <textarea
            required
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              fontSize: 14,
              resize: "vertical",
              fontFamily: "inherit",
              outline: "none",
            }}
            placeholder=""
          />
          {}
        </Col>
      </Row>

      {/* Seção de gerenciamento de usuários - apenas para grupos existentes */}
      {initial?.GroupId && (
        <>
          <hr style={{ margin: "20px 0" }} />
          <div style={{ marginBottom: "16px" }}>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowUserSection(!showUserSection)}
            >
              {showUserSection ? t("groups.hide_group_users") : t("groups.manage_users")}
            </Button>
          </div>

          {showUserSection && (
            <div>
              <h4 style={{ marginBottom: "12px" }}>{t("groups.manage_users")}</h4>

              {/* Adicionar usuário */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px", alignItems: "end" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: "500" }}>
                    {t("groups.add_user")}
                  </label>
                  <select
                    value={selectedUserId || ""}
                    onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "14px"
                    }}
                  >
                    <option value="">{t("groups.select_user")}</option>
                    {availableUsers.map(user => (
                      <option key={user.UserId} value={user.UserId}>
                        {user.Name} ({user.Email})
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  type="button"
                  onClick={handleAddUser}
                  disabled={!selectedUserId}
                  style={{ height: "36px" }}
                >
                  <FiPlus />
                </Button>
              </div>

              {/* Lista de usuários no grupo */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                  {t("groups.users_in_group")} ({groupUsers.length})
                </label>
                {groupUsers.length > 0 ? (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {groupUsers.map(user => (
                      <li key={user.UserId} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px",
                        borderBottom: "1px solid #eee"
                      }}>
                        <span>{user.Name} ({user.Email})</span>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleRemoveUser(user.UserId)}
                          style={{ padding: "4px" }}
                        >
                          <FiX />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "#666", fontStyle: "italic" }}>
                    {t("groups.no_users_in_group")}
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Seção de gerenciamento de pastas - apenas para grupos existentes */}
      {initial?.GroupId && (
        <>
          <hr style={{ margin: "20px 0" }} />
          <div style={{ marginBottom: "16px" }}>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowFolderSection(!showFolderSection)}
            >
              {showFolderSection ? t("folders.hide_group_folders") : t("folders.manage_folders")}
            </Button>
          </div>

          {showFolderSection && (
            <div>
              <h4 style={{ marginBottom: "12px" }}>{t("folders.manage_folders")}</h4>

              {/* Adicionar pasta */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px", alignItems: "end" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: "500" }}>
                    {t("folders.add_folder")}
                  </label>
                  <select
                    value={selectedFolderId || ""}
                    onChange={(e) => setSelectedFolderId(e.target.value ? Number(e.target.value) : null)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "14px"
                    }}
                  >
                    <option value="">{t("folders.select_folder")}</option>
                    {availableFolders.map(folder => (
                      <option key={folder.FolderId} value={folder.FolderId}>
                        {folder.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  type="button"
                  onClick={handleAddFolder}
                  disabled={!selectedFolderId}
                  style={{ height: "36px" }}
                >
                  <FiPlus />
                </Button>
              </div>

              {/* Lista de pastas no grupo */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                  {t("folders.folders_in_group")} ({groupFolders.length})
                </label>
                {groupFolders.length > 0 ? (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {groupFolders.map(folder => (
                      <li key={folder.FolderId} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px",
                        borderBottom: "1px solid #eee"
                      }}>
                        <span>{folder.FolderName || folder.Name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleRemoveFolder(folder.FolderId)}
                          style={{ padding: "4px" }}
                        >
                          <FiX />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "#666", fontStyle: "italic" }}>
                    {t("folders.no_folders_in_group")}
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}

      <div style={{ marginTop: "20px", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
        <Button type="button" variant="primary" onClick={onCancel}>
          {t("actions.cancel")}
        </Button>
        <Button type="submit" disabled={!canSave}>
          {t("actions.save")}
        </Button>
      </div>
    </form>
  );
};
