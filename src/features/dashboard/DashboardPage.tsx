import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiFile, FiCheckSquare, FiTrendingUp } from "react-icons/fi";

import { useAuthContext } from "../../context/AuthContext";

import { useUser } from "../user/useUser";
import { useDocument } from "../document/useDocument";
import { useTask } from "../task/useTask";
import { useTypedTranslation } from "../../context/LanguageContext";
import PageLayout from "../../components/common/PageLayout";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}15 0%, ${({ theme }) => theme.colors.primary}05 100%);
  border-radius: 12px;
  padding: 32px;
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
`;

const WelcomeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const WelcomeTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const WelcomeSubtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.primary}15;
    border-color: ${({ theme }) => theme.colors.primary}40;
  }
`;

const StatCardIcon = styled.div<{ bgColor: string; color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: ${({ bgColor }) => bgColor};
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const StatCardTitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 8px 0;
`;

const StatCardValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px 0;
`;

const StatCardChange = styled.div<{ positive: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${({ positive, theme }) => positive ? '#22c55e' : '#ef4444'};
  display: flex;
  align-items: center;
  gap: 4px;
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

  // Hooks para buscar dados do banco
  const { get: getUsers, activeUser } = useUser();
  const { get: getDocuments, activeDocument } = useDocument();
  const { get: getTasks, activeTask } = useTask();

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Buscar dados reais do banco de dados
        await Promise.all([
          getUsers(),
          getDocuments(),
          getTasks()
        ]);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      }
    };

    loadStats();
  }, []);

  // Calcular estatísticas baseadas nos dados reais
  useEffect(() => {
    const completedTasks = activeTask.filter(task => task.Status === 4).length;
    const pendingTasks = activeTask.filter(task => task.Status === 1).length;

    setStats({
      totalUsers: activeUser.length,
      totalCompanies: 0, // Manter em 0 ou adicionar useCompanies se necessário
      totalDocuments: activeDocument.length,
      totalTasks: activeTask.length,
      completedTasks: completedTasks,
      pendingTasks: pendingTasks,
    });
  }, [activeUser, activeDocument, activeTask]);

  // Função de saudação usando traduções - seguindo padrão identificado
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("dashboard.greeting.good_morning") || "Bom dia";
    if (hour < 18) return t("dashboard.greeting.good_afternoon") || "Boa tarde";
    return t("dashboard.greeting.good_evening") || "Boa noite";
  };

  // Função de perfil usando traduções - seguindo padrão identificado
  const getProfileName = (profile: number) => {
    switch (profile) {
      case 1: return t("dashboard.profiles.administrator") || "Administrador";
      case 2: return t("dashboard.profiles.manager") || "Gerente";
      case 3: return t("dashboard.profiles.employee") || "Funcionário";
      default: return t("dashboard.profiles.user") || "Usuário";
    }
  };

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  // Array de estatísticas usando traduções - seguindo padrão identificado
  const statCards = [
    {
      title: t("dashboard.stats.total_users") || "Total de Usuários",
      value: stats.totalUsers,
      change: "+12%",
      positive: true,
      icon: FiUsers,
      color: "#3b82f6",
      bgColor: "#3b82f615",
      route: "/user"
    },
    {
      title: t("dashboard.stats.documents") || "Documentos",
      value: stats.totalDocuments,
      change: "+28%",
      positive: true,
      icon: FiFile,
      color: "#f59e0b",
      bgColor: "#f59e0b15",
      route: "/document"
    },
    {
      title: t("dashboard.stats.completed_tasks") || "Tarefas Concluídas",
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
    <PageLayout title={t("dashboard.title") || "Dashboard"}>
      <DashboardContainer>
        {/* Welcome Section */}
        <WelcomeSection>
          <WelcomeContent>
            <WelcomeTitle>
              {getGreeting()}, {user?.Name || t("dashboard.profiles.user") || "Usuário"}!
            </WelcomeTitle>
            <WelcomeSubtitle>
              {getProfileName(user?.Profile || 0)} • {t("dashboard.stats.welcome_to_control_panel") || "Bem-vindo ao seu painel de controle"}
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
                  {stat.change} {t("dashboard.stats.vs_previous_month") || "vs mês anterior"}
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