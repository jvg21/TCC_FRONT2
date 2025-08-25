import { t } from "i18next"

interface LabelProps {
    IsActive?: boolean
}

export const ActiveLabel = ({ IsActive }: LabelProps) => {
    return (
        <span style={{
            color: IsActive ? '#28a745' : '#dc3545',
            fontWeight: 'bold'
        }}>
            {IsActive ? t("status.enabled") : t("status.disabled")}
        </span>
    )
}