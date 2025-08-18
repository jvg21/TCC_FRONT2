import PageLayout from "../../components/common/PageLayout";
import { useTypedTranslation } from "../../context/LanguageContext";


const DashboardPage: React.FC = () => {
const { t } = useTypedTranslation();
  return(
    <PageLayout title="Dashboard"><div>Home</div></PageLayout>
  );
};

export default DashboardPage;