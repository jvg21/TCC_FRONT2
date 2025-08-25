import { t } from "i18next";

export const taskStatus = [
    { value: '1', label: t('task.priority.todo') },
    { value: '2', label: t('task.priority.inprogress') },
    { value: '3', label: t('task.priority.inreview') },
    { value: '4', label: t('task.priority.done') },
    { value: '5', label: t('task.priority.canceled') },
];