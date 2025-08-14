import React, { useEffect, useState } from "react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import styled from "styled-components";
import type { Task } from "./types";
import { Select } from "../../components/common/Select";
import { useTranslation } from "react-i18next";




const Row = styled.div` display:flex; gap:12px; margin-bottom: 12px; `;
const Col = styled.div` flex:1; `;

type Props = {
    initial?: Partial<Task>;
    isEditing?: boolean;
    onCancel: () => void;
    onSave: (data: Omit<Task, "TaskId" | "CreatedAt" | "UpdatedAt" | "IsActive" | "DueDate" | "Priority" | "Status" | "AssigneeId" | "UserId" | "ParentTaskId"> & Partial<Task>) => void;
};

export const TaskForm: React.FC<Props> = ({ initial = {}, isEditing = false, onCancel, onSave }) => {
    const [Title, setTitle] = useState(initial.Title ?? "");
    const [Description, setDescription] = useState(initial.Description ?? "");
    const [DueDate, setDueDate] = useState(initial.DueDate ?? "");
    const [Priority, setPriority] = useState(initial.Priority ?? "");
    const [Status, setStatus] = useState(initial.Status ?? "");
    const [AssigneeId, setAssigneeId] = useState(initial.AssigneeId ?? "");
    const [UserId, setUserId] = useState(initial.UserId ?? "");
    const [IsActive, setIsActive] = useState(initial.IsActive ?? "");
    const { t } = useTranslation();


    useEffect(() => {
        setTitle(initial.Title ?? "");
        setDescription(initial.Description ?? "");
        setDueDate(initial.DueDate ?? "");
        setPriority(initial.Priority ?? "");
        setStatus(initial.Status ?? "");
        setAssigneeId(initial.AssigneeId ?? "");
        setUserId(initial.UserId ?? "");
        setIsActive(initial.IsActive ?? "");
    }, [initial.Title, initial.Description, initial.DueDate, initial.Priority, initial.Status, initial.AssigneeId, initial.UserId, initial.IsActive]);

    const canSave = Title.trim().length > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSave) return;
        onSave({ Title, Description, DueDate, Priority, Status, AssigneeId, UserId, IsActive });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Row>
                <Col><Input label={t("tasks.title_field")} value={Title} onChange={(e) => setTitle(e.target.value)} /></Col>
            </Row>
            <Row>
                <Col><Input label={t("tasks.description")} value={Description} onChange={(e) => setDescription(e.target.value)} /></Col>
            </Row>
            <Row>
                <Col><Select label={t("tasks.user")} options={[
                  { value: "false", label: t("status.disabled") },
                  { value: "true", label: t("status.enabled") },
                ]} /></Col>
                <Col><Select label={t("tasks.assignee")} options={[
                  { value: "false", label: t("status.disabled") },
                  { value: "true", label: t("status.enabled") },
                ]} /></Col>
            </Row>
            
            <Row>
                <Col><Select label={t("tasks.is_active")} options={[
                    { value: "false", label: t("status.disabled") },
                    { value: "true", label: t("status.enabled") },
                ]} /></Col>
            </Row>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <Button variant="ghost" type="button" onClick={onCancel}>{t("actions.cancel")}</Button>
                <Button type="submit" disabled={!canSave}>{t("actions.save")}</Button>
            </div>
        </form>
    );
};