import React, { useEffect, useState } from "react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import type { Task } from "./types";
import { Select } from "../../components/common/Select";
import { useTranslation } from "react-i18next";
import { Row } from "../../components/common/Row";
import { Col } from "../../components/common/Col";
import { getTaskStatus, taskStatus } from "../../enum/taskStatus";
import { getTaskPriority, taskPriority } from "../../enum/taskPriority";
import { useUser } from "../user/useUser";
import styled from "styled-components";


const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 6px;
`;

export const TaskForm: React.FC<{
  initial?: Partial<Task>;
  isEditing?: boolean;
  onCancel: () => void;
  onSave: (data: Partial<Task>) => void;
}> = ({ initial = {}, isEditing = false, onCancel, onSave }) => {
  const [Title, setTitle] = useState(initial.Title ?? "");
  const [Description, setDescription] = useState(initial.Description ?? "");
  const [DueDate, setDueDate] = useState(initial.DueDate ?? "");
  const [Priority, setPriority] = useState(initial.Priority ?? 0);
  const [Status, setStatus] = useState(initial.Status ?? 0);
  const [AssigneeId, setAssigneeId] = useState(initial.AssigneeId ?? 0);
  const { t } = useTranslation();
  const { activeUser } = useUser();

  useEffect(() => {
    setTitle(initial.Title ?? "");
    setDescription(initial.Description ?? "");
    setDueDate(initial.DueDate ?? "");
    setPriority(initial.Priority ?? 0);
    setStatus(initial.Status ?? 0);
    setAssigneeId(initial.AssigneeId ?? 0);
  }, [initial.Title, initial.Description, initial.DueDate, initial.Priority, initial.Status, initial.AssigneeId]);

  const validateFields = () => {
    const isTitleValid = Title.trim().length > 0;
    return isTitleValid;
  };

  const canSave = validateFields();

  const assigneeOptions = [
    { value: "", label: t("tasks.select_assignee") },
    ...activeUser.map(user => ({
      value: user.UserId,
      label: user.Name
    }))
  ];

  const taskStatusOptions = getTaskStatus(t).map(status => ({
    value: status.value,
    label: status.label
  }));

  const taskPriorityOptions = getTaskPriority(t).map(priority => ({
    value: priority.value,
    label: priority.label
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    onSave({ Title, Description, DueDate, Priority, Status, AssigneeId });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Col>
          <Input
            label={t("tasks.title_field")}
            maxLength={30}
            minLength={3}
            required
            value={Title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          {/* Substituído o Input por um TextArea */}
          <Label>{t("tasks.description")}</Label>
          <TextArea
            required
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("tasks.description_placeholder") || ""}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <Input
            label={t("tasks.due_date")}
            type="date"
            value={DueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </Col>
        <Col>
          <Select
            label={t("tasks.priority")}
            value={Priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            options={taskPriorityOptions}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <Select
            label={t("tasks.status")}
            value={Status}
            onChange={(e) => setStatus(Number(e.target.value))}
            options={taskStatusOptions}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <Select
            label={t("tasks.assignee")}
            value={AssigneeId}
            onChange={(e) => setAssigneeId(Number(e.target.value))}
            options={assigneeOptions}
          />
        </Col>
      </Row>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button variant="ghost" type="button" onClick={onCancel}>
          {t("actions.cancel")}
        </Button>
        <Button type="submit" disabled={!canSave}>
          {t("actions.save")}
        </Button>
      </div>
    </form>
  );
};
