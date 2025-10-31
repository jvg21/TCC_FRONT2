import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { 
  FiFileText, 
  FiCheckCircle, 
  FiClock, 
  FiTag, 
  FiList,
  FiUsers,
  FiCpu,
  FiDownload,
  FiCalendar,
  FiFilter,

} from 'react-icons/fi';


// Componentes estilizados com suporte a tema claro/escuro
const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const PageSubtitle = styled.p`
  margin: 0;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.mutedText || theme.colors.muted};
`;

const FilterSection = styled.div`
  background: ${({ theme }) => theme.colors.surface || theme.colors.cardBackground};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterSelect = styled.select`
  padding: 10px 16px;
  border: 2px solid ${({ theme }) => theme.colors.border || 'rgba(0, 0, 0, 0.06)'};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.inputBackground || theme.colors.background};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}33`};
  }
`;

const FilterInput = styled.input`
  padding: 10px 16px;
  border: 2px solid ${({ theme }) => theme.colors.border || 'rgba(0, 0, 0, 0.06)'};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.inputBackground || theme.colors.background};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}33`};
  }
`;

const ApplyFilterButton = styled.button`
  padding: 10px 24px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: ${({ theme }) => `${theme.colors.primary}dd`};
  }
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const ReportCard = styled.div`
  background: ${({ theme }) => theme.colors.surface || theme.colors.cardBackground};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const CardValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 16px 0;
`;

const CardDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedText || theme.colors.muted};
  line-height: 1.5;
`;

const DetailedSection = styled.div`
  background: ${({ theme }) => theme.colors.surface || theme.colors.cardBackground};
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border || 'rgba(0, 0, 0, 0.06)'};
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const StatItem = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors.backgroundAlt || theme.colors.background};
  border-radius: 12px;
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
`;

const StatLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.mutedText || theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.border || 'rgba(0, 0, 0, 0.06)'};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 12px;
`;

const ProgressFill = styled.div<{ percentage: number; color?: string }>`
  height: 100%;
  width: ${props => props.percentage}%;
  background: ${props => props.color || props.theme.colors.primary};
  transition: width 0.3s ease;
`;

const ChartContainer = styled.div`
  margin-top: 24px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.backgroundAlt || theme.colors.background};
  border-radius: 12px;
`;

const BarChartContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 200px;
  padding: 20px 0;
`;

const Bar = styled.div<{ height: number; color?: string }>`
  flex: 1;
  background: ${props => props.color || props.theme.colors.primary};
  height: ${props => props.height}%;
  border-radius: 8px 8px 0 0;
  transition: height 0.3s ease;
  position: relative;
  min-height: 20px;

  &:hover {
    opacity: 0.8;
  }
`;

const BarLabel = styled.div`
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.mutedText || theme.colors.muted};
  margin-top: 8px;
  font-weight: 600;
`;

const BarValue = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
`;

const TagCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
`;

const TagItem = styled.div<{ size: number }>`
  padding: ${props => 8 + props.size * 2}px ${props => 16 + props.size * 3}px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 24px;
  font-size: ${props => 12 + props.size * 2}px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  background: ${({ theme }) => theme.colors.backgroundAlt || theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  font-size: 14px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border || 'rgba(0, 0, 0, 0.06)'};
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border || 'rgba(0, 0, 0, 0.06)'};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
`;

const SectionHeading = styled.h3`
  margin-top: 32px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

// Componente Principal
const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Dados simulados
  const documentsData = {
    total: 1247,
    active: 1198,
    inactive: 49,
    validated: 892,
    pending: 306,
    byPeriod: [
      { month: 'Jan', count: 98 },
      { month: 'Fev', count: 112 },
      { month: 'Mar', count: 135 },
      { month: 'Abr', count: 156 },
      { month: 'Mai', count: 178 },
      { month: 'Jun', count: 142 }
    ]
  };

  const validationsData = {
    total: 892,
    approved: 745,
    rejected: 89,
    returned: 58,
    approvalRate: 83.5,
    avgTime: '2.3 dias',
    topValidators: [
      { name: 'João Silva', count: 234 },
      { name: 'Maria Santos', count: 198 },
      { name: 'Pedro Costa', count: 167 }
    ]
  };

  const versionsData = {
    total: 3456,
    mostEdited: [
      { title: 'Manual de Onboarding', versions: 23 },
      { title: 'Política de Segurança', versions: 19 },
      { title: 'Processo de Vendas', versions: 17 }
    ]
  };

  const tagsData = {
    total: 45,
    topTags: [
      { name: 'Processo', count: 234, size: 3 },
      { name: 'Manual', count: 198, size: 2 },
      { name: 'Política', count: 167, size: 2 },
      { name: 'Treinamento', count: 145, size: 1 },
      { name: 'Financeiro', count: 123, size: 1 },
      { name: 'RH', count: 98, size: 0 }
    ]
  };

  const tasksData = {
    total: 456,
    completed: 345,
    overdue: 23,
    completionRate: 75,
    byPriority: {
      high: 78,
      medium: 189,
      low: 189
    }
  };

  const groupsData = {
    total: 15,
    totalMembers: 134,
    avgMembersPerGroup: 8.9,
    topGroups: [
      { name: 'Financeiro', members: 23 },
      { name: 'Desenvolvimento', members: 18 },
      { name: 'Marketing', members: 15 },
      { name: 'RH', members: 12 },
      { name: 'Comercial', members: 10 }
    ]
  };

  const aiData = {
    totalRequests: 1234,
    totalTokens: 5678912,
    avgTokensPerRequest: 4602,
    estimatedCost: '$56.79',
    topUsers: [
      { name: 'João Silva', requests: 234 },
      { name: 'Maria Santos', requests: 198 },
      { name: 'Pedro Costa', requests: 167 }
    ]
  };

  // Manipuladores de eventos
  const handleDownloadReport = () => {
    alert('Download de relatório em PDF iniciado');
  };

  const handleApplyFilter = () => {
    alert(`Filtro aplicado: ${timeFilter}${timeFilter === 'custom' ? ` de ${startDate} a ${endDate}` : ''}`);
  };

  // Helper para renderizar o relatório selecionado
  const renderSelectedReport = () => {
    // Implementação futura para relatórios detalhados específicos
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{t('reports.title') || "Relatórios e Análises"}</PageTitle>
        <PageSubtitle>{t('reports.subtitle') || "Visualize insights e métricas do sistema Documentin"}</PageSubtitle>
      </PageHeader>

      {/* Filtros */}
      <FilterSection>
        <FilterLabel>
          <FiCalendar /> {t('reports.filters.period')}:
        </FilterLabel>
        <FilterSelect 
          value={timeFilter}
          onChange={(e) => {
            setTimeFilter(e.target.value);
            if (e.target.value !== 'custom') {
              setStartDate('');
              setEndDate('');
            }
          }}
        >
          <option value="all">{t('reports.filters.all_periods')}</option>
          <option value="today">{t('reports.filters.today')}</option>
          <option value="week">{t('reports.filters.last_week')}</option>
          <option value="month">{t('reports.filters.last_month')}</option>
          <option value="quarter">{t('reports.filters.last_quarter')}</option>
          <option value="year">{t('reports.filters.last_year')}</option>
          <option value="custom">{t('reports.filters.custom')}</option>
        </FilterSelect>

        {timeFilter === 'custom' && (
          <>
            <FilterLabel>
              <FiCalendar /> {t('reports.filters.from')}:
            </FilterLabel>
            <FilterInput 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <FilterLabel>
              <FiCalendar /> {t('reports.filters.to')}:
            </FilterLabel>
            <FilterInput 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </>
        )}

        <ApplyFilterButton onClick={handleApplyFilter}>
          <FiFilter /> {t('reports.filters.apply_filter')}
        </ApplyFilterButton>
      </FilterSection>

      {/* Cards de Resumo */}
      <ReportsGrid>
        <ReportCard onClick={() => setSelectedReport('documents')}>
          <CardHeader>
            <CardIcon><FiFileText /></CardIcon>
          </CardHeader>
          <CardTitle>{t('reports.cards.documents')}</CardTitle>
          <CardValue>{documentsData.total}</CardValue>
          <CardDescription>
            {documentsData.active} {t('reports.cards.active')} • {documentsData.validated} {t('reports.cards.validated')}
          </CardDescription>
        </ReportCard>

        <ReportCard onClick={() => setSelectedReport('validations')}>
          <CardHeader>
            <CardIcon><FiCheckCircle /></CardIcon>
          </CardHeader>
          <CardTitle>{t('reports.cards.validations')}</CardTitle>
          <CardValue>{validationsData.total}</CardValue>
          <CardDescription>
            {t('reports.cards.approval_rate')}: {validationsData.approvalRate}%
          </CardDescription>
        </ReportCard>

        <ReportCard onClick={() => setSelectedReport('versions')}>
          <CardHeader>
            <CardIcon><FiClock /></CardIcon>
          </CardHeader>
          <CardTitle>{t('reports.cards.versions')}</CardTitle>
          <CardValue>{versionsData.total}</CardValue>
          <CardDescription>
            {t('reports.cards.complete_history')}
          </CardDescription>
        </ReportCard>

        <ReportCard onClick={() => setSelectedReport('tags')}>
          <CardHeader>
            <CardIcon><FiTag /></CardIcon>
          </CardHeader>
          <CardTitle>{t('reports.cards.tags')}</CardTitle>
          <CardValue>{tagsData.total}</CardValue>
          <CardDescription>
            {t('reports.cards.active_system')}
          </CardDescription>
        </ReportCard>

        <ReportCard onClick={() => setSelectedReport('tasks')}>
          <CardHeader>
            <CardIcon><FiList /></CardIcon>
          </CardHeader>
          <CardTitle>{t('reports.cards.tasks')}</CardTitle>
          <CardValue>{tasksData.total}</CardValue>
          <CardDescription>
            {tasksData.completed} {t('reports.cards.completed')} • {tasksData.overdue} {t('reports.cards.overdue')}
          </CardDescription>
        </ReportCard>

        <ReportCard onClick={() => setSelectedReport('groups')}>
          <CardHeader>
            <CardIcon><FiUsers /></CardIcon>
          </CardHeader>
          <CardTitle>{t('reports.cards.groups')}</CardTitle>
          <CardValue>{groupsData.total}</CardValue>
          <CardDescription>
            {groupsData.totalMembers} {t('reports.cards.total_members')}
          </CardDescription>
        </ReportCard>

        <ReportCard onClick={() => setSelectedReport('ai')}>
          <CardHeader>
            <CardIcon><FiCpu /></CardIcon>
          </CardHeader>
          <CardTitle>{t('reports.cards.ai')}</CardTitle>
          <CardValue>{aiData.totalRequests}</CardValue>
          <CardDescription>
            {t('reports.cards.processed_requests')}
          </CardDescription>
        </ReportCard>
      </ReportsGrid>

      {/* Relatório de Documentos */}
      <DetailedSection>
        <SectionHeader>
          <SectionTitle>
            <FiFileText /> {t('reports.sections.document_stats')}
          </SectionTitle>
          <DownloadButton onClick={handleDownloadReport}>
            <FiDownload /> {t('reports.sections.export_report')}
          </DownloadButton>
        </SectionHeader>

        <StatsGrid>
          <StatItem>
            <StatLabel>{t('reports.sections.total_documents')}</StatLabel>
            <StatValue>{documentsData.total}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>{t('reports.sections.active_documents')}</StatLabel>
            <StatValue>{documentsData.active}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>{t('reports.sections.validated_documents')}</StatLabel>
            <StatValue>{documentsData.validated}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>{t('reports.sections.pending_documents')}</StatLabel>
            <StatValue>{documentsData.pending}</StatValue>
          </StatItem>
        </StatsGrid>

        <ChartContainer>
          <SectionHeading>
            {t('reports.sections.documents_by_period')}
          </SectionHeading>
          <BarChartContainer>
            {documentsData.byPeriod.map((item, index) => (
              <div key={index} style={{ flex: '1' }}>
                <Bar 
                  height={(item.count / Math.max(...documentsData.byPeriod.map(i => i.count))) * 100}
                >
                  <BarValue>{item.count}</BarValue>
                </Bar>
                <BarLabel>{item.month}</BarLabel>
              </div>
            ))}
          </BarChartContainer>
        </ChartContainer>
      </DetailedSection>

      {/* Relatório de Validações */}
      <DetailedSection>
        <SectionHeader>
          <SectionTitle>
            <FiCheckCircle /> {t('reports.sections.validation_stats')}
          </SectionTitle>
          <DownloadButton onClick={handleDownloadReport}>
            <FiDownload /> {t('reports.sections.export_report')}
          </DownloadButton>
        </SectionHeader>

        <StatsGrid>
          <StatItem>
            <StatLabel>{t('reports.sections.total_validations')}</StatLabel>
            <StatValue>{validationsData.total}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>{t('reports.sections.approved_documents')}</StatLabel>
            <StatValue>{validationsData.approved}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>{t('reports.sections.rejected_documents')}</StatLabel>
            <StatValue style={{ color: '#f56565' }}>{validationsData.rejected}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>{t('reports.sections.returned_for_revision')}</StatLabel>
            <StatValue style={{ color: '#ed8936' }}>{validationsData.returned}</StatValue>
          </StatItem>
        </StatsGrid>

        <ChartContainer>
          <SectionHeading>
            {t('reports.sections.top_validators')}
          </SectionHeading>
          <Table>
            <thead>
              <tr>
                <Th>{t('reports.sections.validator')}</Th>
                <Th>{t('reports.sections.documents_validated')}</Th>
                <Th>{t('reports.sections.contribution')}</Th>
              </tr>
            </thead>
            <tbody>
              {validationsData.topValidators.map((validator, index) => (
                <tr key={index}>
                  <Td>{validator.name}</Td>
                  <Td><strong>{validator.count}</strong></Td>
                  <Td>
                    <ProgressBar>
                      <ProgressFill 
                        percentage={(validator.count / validationsData.topValidators[0].count) * 100} 
                        color="#667eea"
                      />
                    </ProgressBar>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ChartContainer>
      </DetailedSection>

      {/* Relatório de Versões */}
      <DetailedSection>
        <SectionHeader>
          <SectionTitle>
            <FiClock /> {t('reports.sections.version_history')}
          </SectionTitle>
          <DownloadButton onClick={handleDownloadReport}>
            <FiDownload /> {t('reports.sections.export_report')}
          </DownloadButton>
        </SectionHeader>

        <StatsGrid>
          <StatItem>
            <StatLabel>{t('reports.sections.total_versions')}</StatLabel>
            <StatValue>{versionsData.total}</StatValue>
          </StatItem>
        </StatsGrid>

        <SectionHeading>
          {t('reports.sections.most_edited_documents')}
        </SectionHeading>
        <Table>
          <thead>
            <tr>
              <Th>{t('reports.sections.document')}</Th>
              <Th>{t('reports.sections.version_count')}</Th>
              <Th>{t('reports.sections.relative')}</Th>
            </tr>
          </thead>
          <tbody>
            {versionsData.mostEdited.map((doc, index) => (
              <tr key={index}>
                <Td>{doc.title}</Td>
                <Td><strong>{doc.versions}</strong></Td>
                <Td>
                  <ProgressBar>
                    <ProgressFill 
                      percentage={(doc.versions / versionsData.mostEdited[0].versions) * 100} 
                      color="#667eea"
                    />
                  </ProgressBar>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </DetailedSection>

      {/* Relatório de Tags */}
      <DetailedSection>
        <SectionHeader>
          <SectionTitle>
            <FiTag /> {t('reports.sections.tags_analysis')}
          </SectionTitle>
          <DownloadButton onClick={handleDownloadReport}>
            <FiDownload /> {t('reports.sections.export_report')}
          </DownloadButton>
        </SectionHeader>

        <StatsGrid>
          <StatItem>
            <StatLabel>{t('reports.sections.total_tags')}</StatLabel>
            <StatValue>{tagsData.total}</StatValue>
          </StatItem>
        </StatsGrid>

        <SectionHeading>
          {t('reports.sections.tag_cloud')}
        </SectionHeading>
        <TagCloud>
          {tagsData.topTags.map((tag, index) => (
            <TagItem key={index} size={tag.size}>
              {tag.name} ({tag.count})
            </TagItem>
          ))}
        </TagCloud>
      </DetailedSection>

      {/* Relatório de Tarefas */}
      <DetailedSection>
        <SectionHeader>
          <SectionTitle>
            <FiList /> {t('reports.sections.tasks_analysis')}
          </SectionTitle>
          <DownloadButton onClick={handleDownloadReport}>
            <FiDownload /> {t('reports.sections.export_report')}
          </DownloadButton>
        </SectionHeader>

        <StatsGrid>
          <StatItem>
            <StatLabel>{t('reports.sections.total_tasks')}</StatLabel>
            <StatValue>{tasksData.total}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>{t('reports.sections.completion_rate')}</StatLabel>
            <StatValue>{tasksData.completionRate}%</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>{t('reports.sections.overdue_tasks')}</StatLabel>
            <StatValue style={{ color: '#f56565' }}>{tasksData.overdue}</StatValue>
          </StatItem>
        </StatsGrid>

        <ChartContainer>
          <SectionHeading>
            {t('reports.sections.priority_distribution')}
          </SectionHeading>
          <StatsGrid>
            <StatItem>
              <StatLabel>{t('reports.sections.high_priority')}</StatLabel>
              <StatValue>{tasksData.byPriority.high}</StatValue>
              <ProgressBar>
                <ProgressFill 
                  percentage={(tasksData.byPriority.high / tasksData.total) * 100} 
                  color="#f56565"
                />
              </ProgressBar>
            </StatItem>
            <StatItem>
              <StatLabel>{t('reports.sections.medium_priority')}</StatLabel>
              <StatValue>{tasksData.byPriority.medium}</StatValue>
              <ProgressBar>
                <ProgressFill 
                  percentage={(tasksData.byPriority.medium / tasksData.total) * 100} 
                  color="#ed8936"
                />
              </ProgressBar>
            </StatItem>
            <StatItem>
              <StatLabel>{t('reports.sections.low_priority')}</StatLabel>
              <StatValue>{tasksData.byPriority.low}</StatValue>
              <ProgressBar>
                <ProgressFill 
                  percentage={(tasksData.byPriority.low / tasksData.total) * 100} 
                  color="#38b2ac"
                />
              </ProgressBar>
            </StatItem>
          </StatsGrid>
        </ChartContainer>
      </DetailedSection>

      {/* Relatório de Grupos */}
      <DetailedSection>
        <SectionHeader>
          <SectionTitle>
            <FiUsers /> {t('reports.sections.groups_analysis')}
          </SectionTitle>
          <DownloadButton onClick={handleDownloadReport}>
            <FiDownload /> {t('reports.sections.export_report')}
          </DownloadButton>
        </SectionHeader>

        <StatsGrid>
          <StatItem>
            <StatLabel>{t('reports.sections.total_groups')}</StatLabel>
            <StatValue>{groupsData.total}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>{t('reports.sections.total_members')}</StatLabel>
            <StatValue>{groupsData.totalMembers}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>{t('reports.sections.avg_members_per_group')}</StatLabel>
            <StatValue>{groupsData.avgMembersPerGroup}</StatValue>
          </StatItem>
        </StatsGrid>

        <SectionHeading>
          {t('reports.sections.largest_groups')}
        </SectionHeading>
        <Table>
          <thead>
            <tr>
              <Th>{t('reports.sections.group')}</Th>
              <Th>{t('reports.sections.members')}</Th>
              <Th>{t('reports.sections.relative_size')}</Th>
            </tr>
          </thead>
          <tbody>
            {groupsData.topGroups.map((group, index) => (
              <tr key={index}>
                <Td>{group.name}</Td>
                <Td><strong>{group.members}</strong></Td>
                <Td>
                  <ProgressBar>
                    <ProgressFill 
                      percentage={(group.members / groupsData.topGroups[0].members) * 100} 
                      color="#667eea"
                    />
                  </ProgressBar>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </DetailedSection>

      {/* Relatório de IA */}
      <DetailedSection>
        <SectionHeader>
          <SectionTitle>
            <FiCpu /> {t('reports.sections.ai_usage')}
          </SectionTitle>
          <DownloadButton onClick={handleDownloadReport}>
            <FiDownload /> {t('reports.sections.export_report')}
          </DownloadButton>
        </SectionHeader>

        <StatsGrid>
          <StatItem>
            <StatLabel>{t('reports.sections.total_requests')}</StatLabel>
            <StatValue>{aiData.totalRequests}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>{t('reports.sections.tokens_used')}</StatLabel>
            <StatValue>{aiData.totalTokens.toLocaleString()}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>{t('reports.sections.average_per_request')}</StatLabel>
            <StatValue>{aiData.avgTokensPerRequest}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>{t('reports.sections.estimated_cost')}</StatLabel>
            <StatValue style={{ color: '#48bb78' }}>{aiData.estimatedCost}</StatValue>
          </StatItem>
        </StatsGrid>

        <SectionHeading>
          {t('reports.sections.top_users')}
        </SectionHeading>
        <Table>
          <thead>
            <tr>
              <Th>{t('reports.sections.user')}</Th>
              <Th>{t('reports.sections.requests')}</Th>
              <Th>{t('reports.sections.usage')}</Th>
            </tr>
          </thead>
          <tbody>
            {aiData.topUsers.map((user, index) => (
              <tr key={index}>
                <Td>{user.name}</Td>
                <Td><strong>{user.requests}</strong></Td>
                <Td>
                  <ProgressBar>
                    <ProgressFill
                      percentage={(user.requests / aiData.topUsers[0].requests) * 100} 
                      color="#667eea"
                    />
                  </ProgressBar>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </DetailedSection>
    </PageContainer>
  );
};

export default ReportsPage;