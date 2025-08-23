import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/common/PageLayout";
import { useTypedTranslation } from "../../context/LanguageContext";
import { useAuthContext } from "../../context/AuthContext";
import { 
  FiUsers, 
  FiFile, 
  FiCheckSquare, 
  FiTrendingUp
} from "react-icons/fi";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}15, 
    ${({ theme }) => theme.colors.primary}05
  );
  border-radius: 16px;
  padding: 32px;
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
    background: ${({ theme }) => theme.colors.primary}10;
    border-radius: 50%;
    transform: translate(50%, -50%);
  }
`;

const WelcomeContent = styled.div`
  position: relative;
  z-index: 1;
`;

const WelcomeTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px 0;
`;

const WelcomeSubtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0 0 16px 0;
`;

const QuickStats = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const QuickStatItem = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 160px;
  border: 1px solid rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    min-width: auto;
  }
`;

const QuickStatIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ color }) => color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
`;

const QuickStatInfo = styled.div``;

const QuickStatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const QuickStatLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ theme }) => theme.colors.primary};
  }
`;

const StatCardHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const StatCardIcon = styled.div<{ bgColor: string; color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ bgColor }) => bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
  margin-bottom: 16px;
`;

const StatCardTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 8px 0;
`;

const StatCardValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
`;

const StatCardChange = styled.div<{ positive: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ positive }) => positive ? '#22c55e' : '#ef4444'};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 400px;
  margin: 0 auto;
`;

const ActivityCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(0, 0, 0, 0.06);
`;

const ActivityHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const ActivityTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid rgba(0, 0, 0, 0.04);
`;

const ActivityItemIcon = styled.div<{ bgColor: string; color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ bgColor }) => bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
  flex-shrink: 0;
`;

const ActivityItemContent = styled.div`
  flex: 1;
`;

const ActivityItemTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const ActivityItemDesc = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

const ActivityItemTime = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 4px;
`;

const ChartCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  grid-column: span 2;

  @media (max-width: 1200px) {
    grid-column: span 1;
  }
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const ChartPeriod = styled.select`
  padding: 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
`;

const SimpleChart = styled.div`
  height: 200px;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}15, 
    ${({ theme }) => theme.colors.primary}05
  );
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10%;
    right: 10%;
    height: 60%;
    background: ${({ theme }) => theme.colors.primary}30;
    border-radius: 8px 8px 0 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 30%;
    right: 30%;
    height: 40%;
    background: ${({ theme }) => theme.colors.primary}50;
    border-radius: 8px 8px 0 0;
  }
`;

const DashboardPage: React.FC = () => {
  const { t } = useTypedTranslation();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalDocuments: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });

  useEffect(() => {
    // Simular carregamento de estatísticas
    const loadStats = async () => {
      // Aqui você faria as chamadas para sua API
      setStats({
        totalUsers: 24,
        totalCompanies: 5,
        totalDocuments: 142,
        totalTasks: 89,
        completedTasks: 67,
        pendingTasks: 22,
      });
    };

    loadStats();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const getProfileName = (profile: number) => {
    switch (profile) {
      case 1: return "Administrador";
      case 2: return "Gerente";
      case 3: return "Funcionário";
      default: return "Usuário";
    }
  };

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  const statCards = [
    {
      title: "Total de Usuários",
      value: stats.totalUsers,
      change: "+12%",
      positive: true,
      icon: FiUsers,
      color: "#3b82f6",
      bgColor: "#3b82f615",
      route: "/user"
    },
    {
      title: "Documentos",
      value: stats.totalDocuments,
      change: "+28%",
      positive: true,
      icon: FiFile,
      color: "#f59e0b",
      bgColor: "#f59e0b15",
      route: "/document"
    },
    {
      title: "Tarefas Concluídas",
      value: `${stats.completedTasks}/${stats.totalTasks}`,
      change: "+15%",
      positive: true,
      icon: FiCheckSquare,
      color: "#22c55e",
      bgColor: "#22c55e15",
      route: "/task"
    }
  ];

  return (
    <PageLayout title="Dashboard">
      <DashboardContainer>
        {/* Welcome Section */}
        <WelcomeSection>
          <WelcomeContent>
            <WelcomeTitle>
              {getGreeting()}, {user?.Name || "Usuário"}!
            </WelcomeTitle>
            <WelcomeSubtitle>
              {getProfileName(user?.Profile || 0)} • Bem-vindo ao seu painel de controle
            </WelcomeSubtitle>
          </WelcomeContent>
        </WelcomeSection>

        {/* Stats Grid */}
        <StatsGrid>
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <StatCard key={index} onClick={() => handleCardClick(stat.route)}>
                <StatCardIcon bgColor={stat.bgColor} color={stat.color}>
                  <Icon size={24} />
                </StatCardIcon>
                <StatCardTitle>{stat.title}</StatCardTitle>
                <StatCardValue>{stat.value}</StatCardValue>
                <StatCardChange positive={stat.positive}>
                  <FiTrendingUp size={14} />
                  {stat.change} vs mês anterior
                </StatCardChange>
              </StatCard>
            );
          })}
        </StatsGrid>


      </DashboardContainer>
    </PageLayout>
  );
};

export default DashboardPage;