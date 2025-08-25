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

type Props = {
    initial?: Partial<Task>;
    isEditing?: boolean;
    onCancel: () => void;
    onSave: (data: Partial<Task>) => void;
};

export const TaskForm: React.FC<Props> = ({ initial = {}, isEditing = false, onCancel, onSave }) => {
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
        console.log("Validation results:", {
            isTitleValid,
        });
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
                    <Input
                        label={t("tasks.description")}
                        required
                        value={Description}
                        onChange={(e) => setDescription(e.target.value)}
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