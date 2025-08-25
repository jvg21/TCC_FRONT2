import { t } from "i18next"
import { FiEdit, FiMinusCircle, FiPlusCircle } from "react-icons/fi"

interface ActionButtonsProps {
    onEdit: (row: any) => void
    onToggleStatus: (id: number) => void
    row:any
    id:number
}


export const ActionButtons = ({ onEdit,onToggleStatus,row,id }:ActionButtonsProps) => {
    return (
        <div style={{ display: "flex", gap: 8 }}>
            <button title={t("actions.edit")} onClick={() => onEdit(row)}>
                <FiEdit />
            </button>
            <button
                title={row.IsActive ? t("actions.deactivate") : t("actions.activate")}
                onClick={() => onToggleStatus(id)}
            >
                {row.IsActive ? <FiMinusCircle /> : <FiPlusCircle />}
            </button>
        </div>
    )
}