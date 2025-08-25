import { useTranslation } from "react-i18next";
import { Button } from "../common/Button";

interface SelectSelectorProps {
  searchStatus: number;
  changeFunction: (id: number) => void;
}

export const SelectSelector = ({ searchStatus, changeFunction }: SelectSelectorProps) => {
  const { t } = useTranslation();
  
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Button
        variant={searchStatus === 1 ? "primary" : "ghost"}
        onClick={() => changeFunction(1)}
      >
        {t("status.active")}
      </Button>
      <Button
        variant={searchStatus === 2 ? "primary" : "ghost"}
        onClick={() => changeFunction(2)}
      >
        {t("status.inactive")}
      </Button>
      <Button
        variant={searchStatus === 0 ? "primary" : "ghost"}
        onClick={() => changeFunction(0)}
      >
        {t("status.all")}
      </Button>
    </div>
  );
};