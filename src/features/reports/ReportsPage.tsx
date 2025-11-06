import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

import { PageContainer,ApplyFilterButton,Bar,BarLabel,BarValue,CardDescription,CardHeader,CardIcon,CardTitle,CardValue,ChartContainer,DetailedSection,DownloadButton,FilterInput,FilterLabel,FilterSection,FilterSelect,PageHeader,PageSubtitle,PageTitle,ProgressBar,ProgressFill,ReportCard,ReportsGrid,SectionHeader,SectionTitle,StatItem,StatLabel,StatValue,StatsGrid,Table,TagCloud,TagItem,BarChartContainer,SectionHeading, Th, Td } from '../../components/common/reportsComponents';


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