import React, { useEffect, useState } from "react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import type { Group } from "./types";
import { useTranslation } from "react-i18next";
import { Row } from "../../components/common/Row";
import { Col } from "../../components/common/Col";
import { useUser } from "../user/useUser";
import { useGroup } from "./useGroup";
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

  // Estados para gerenciamento de usuários
  const { activeUser } = useUser();
  const { getUsersByGroup, addUserToGroup, removeUserFromGroup } = useGroup();
  const [groupUsers, setGroupUsers] = useState<any[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showUserSection, setShowUserSection] = useState(false);

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
    // Filtrar usuários disponíveis (não estão no grupo)
    const usersNotInGroup = activeUser.filter(user => 
      !groupUsers.some(groupUser => groupUser.UserId === user.UserId)
    );
    setAvailableUsers(usersNotInGroup);
  }, [activeUser, groupUsers]);

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
          <Input 
            label={t("groups.description")} 
            required 
            value={Description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
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
                  <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #e0e0e0", borderRadius: "4px" }}>
                    {groupUsers.map(user => (
                      <div 
                        key={user.UserId} 
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 12px",
                          borderBottom: "1px solid #f0f0f0"
                        }}
                      >
                        <span>{user.Name} ({user.Email})</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={() => handleRemoveUser(user.UserId)}
                          style={{ padding: "4px", color: "#dc3545" }}
                        >
                          <FiX />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#6c757d", fontStyle: "italic", margin: "8px 0" }}>
                    {t("groups.no_users_in_group")}
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}
      
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button variant="ghost" type="button" onClick={onCancel}>{t("actions.cancel")}</Button>
        <Button type="submit" disabled={!canSave}>{t("actions.save")}</Button>
      </div>
    </form>
  );
};