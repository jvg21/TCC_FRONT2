import { t } from "i18next";

export const taskStatus = [
    { value: '1', label: t('tasks.statusTask.todo') },
    { value: '2', label: t('tasks.statusTask.inprogress') },
    { value: '3', label: t('tasks.statusTask.inreview') },
    { value: '4', label: t('tasks.statusTask.done') },
    { value: '5', label: t('tasks.statusTask.canceled') },
    { value: '6', label: t('historico') },
];

export const getTaskStatus = (t: any) => [
    { value: '1', label: t('tasks.statusTask.todo') },
    { value: '2', label: t('tasks.statusTask.inprogress') },
    { value: '3', label: t('tasks.statusTask.inreview') },
    { value: '4', label: t('tasks.statusTask.done') },
    { value: '5', label: t('tasks.statusTask.canceled') },
    { value: '6', label: t('historico') },
];