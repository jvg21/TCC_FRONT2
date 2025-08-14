import React, { useEffect, useState } from "react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import styled from "styled-components";
import type { Task } from "./types";
import { Select } from "../../components/common/Select";




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


    useEffect(() => {
        setTitle(initial.Title ?? "");
        setDescription(initial.Description ?? "");
        setDueDate(initial.DueDate ?? "");
        setPriority(initial.Priority ?? "");
        setStatus(initial.Status ?? "");
        setAssigneeId(initial.AssigneeId ?? "");
        setUserId(initial.UserId ?? "");
        setIsActive(initial.IsActive ?? "");
    }, [initial]);

    const canSave = Title.trim().length > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSave) return;
        onSave({ Title, Description, DueDate, Priority, Status, AssigneeId, UserId, IsActive });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Row>
                <Col><Input label="Titulo" value={Title} onChange={(e) => setTitle(e.target.value)} /></Col>
            </Row>
            <Row>
                <Col><Input label="Description" value={Description} onChange={(e) => setDescription(e.target.value)} /></Col>
            </Row>
            <Row>
                    <Col><Select label="Usuário" options={[
                      { value: "false", label: "Desativado" },
                      { value: "true", label: "Ativado" },
                    ]} /></Col>
                    <Col><Select label="Responsável" options={[
                      { value: "false", label: "Desativado" },
                      { value: "true", label: "Ativado" },
                    ]} /></Col>
                  </Row>
            
            <Row>
                <Col><Select label="Ativo" options={[
                    { value: "false", label: "Desativado" },
                    { value: "true", label: "Ativado" },
                ]} /></Col>
            </Row>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <Button variant="ghost" type="button" onClick={onCancel}>Cancelar</Button>
                <Button type="submit" disabled={!canSave}>Salvar</Button>
            </div>
        </form>
    );
};