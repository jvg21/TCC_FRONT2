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
  FiPieChart,
  FiBarChart2
} from 'react-icons/fi';
import { ApplyFilterButton, Bar, BarLabel, BarValue, CardDescription, CardHeader, CardIcon, CardTitle, CardValue, ChartAxis, ChartCard, ChartContainer, ChartLabel, ChartPoint, ChartsGrid, ChartTitle, DetailedSection, DownloadButton, FilterInput, FilterLabel, FilterSection, FilterSelect, LegendColor, LegendItem, LegendLabel, LegendValue, LineChartContainer, LineChartSvg, PageContainer, PageHeader, PageSubtitle, PageTitle, PieChartContainer, PieLegend, ProgressBar, ProgressFill, ReportCard, ReportsGrid, SectionHeader, SectionTitle, StatItem, StatLabel, StatsGrid, StatValue, Table, TagCloud, TagItem, Td, Th } from '../../components/common/reportsComponents';
import { BarChart, ChartLine, PieChart } from 'lucide-react';


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
    completed: 289,
    pending: 134,
    overdue: 33,
    completionRate: 63.4,
    byPriority: {
      high: 67,
      medium: 245,
      low: 144
    }
  };

  const groupsData = {
    total: 23,
    members: 187,
    avgMembersPerGroup: 8.1,
    topGroups: [
      { name: 'Desenvolvimento', members: 34 },
      { name: 'Comercial', members: 28 },
      { name: 'Financeiro', members: 19 }
    ]
  };

  const aiData = {
    totalRequests: 2345,
    totalTokens: 1234567,
    avgTokensPerRequest: 526,
    topUsers: [
      { name: 'Ana Paula', requests: 234 },
      { name: 'Carlos Eduardo', requests: 198 },
      { name: 'Beatriz Lima', requests: 167 }
    ],
    estimatedCost: 'R$ 247,89'
  };

  const documentsOverTime = [
    { month: 'Jan', value: 98 },
    { month: 'Fev', value: 112 },
    { month: 'Mar', value: 135 },
    { month: 'Abr', value: 156 },
    { month: 'Mai', value: 178 },
    { month: 'Jun', value: 142 }
  ];

  const validationStatusData = {
    approved: 745,
    rejected: 89,
    returned: 58,
    pending: 306
  };

  const handleDownloadReport = () => {
    alert(t('reports.sections.export_report'));
  };

  const handleApplyFilter = () => {
    console.log('Filtro aplicado:', { timeFilter, startDate, endDate });
  };

  const maxCount = Math.max(...documentsData.byPeriod.map(d => d.count));

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>📊 {t('reports.title')}</PageTitle>
        <PageSubtitle>{t('reports.subtitle')}</PageSubtitle>
      </PageHeader>

      {/* Filtro de Tempo */}
      <FilterSection>
        <FilterLabel>
          <FiCalendar /> {t('reports.filters.period')}:
        </FilterLabel>
        <FilterSelect
          value={timeFilter} 
          onChange={(e) => setTimeFilter(e.target.value)}
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
            <FilterLabel>{t('reports.filters.from')}:</FilterLabel>
            <FilterInput 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <FilterLabel>{t('reports.filters.to')}:</FilterLabel>
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
            {groupsData.members} {t('reports.cards.total_members')}
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

      {/* Gráficos */}
      <ChartsGrid>
        <ChartCard>
          <ChartTitle>
            <FiPieChart /> {t('reports.charts.validation_distribution')}
          </ChartTitle>
          <PieChartContainer>
            <PieChart />
            <PieLegend>
              <LegendItem>
                <LegendColor color="#667eea" />
                <LegendLabel>{t('reports.charts.approved')}:</LegendLabel>
                <LegendValue>{validationStatusData.approved}</LegendValue>
              </LegendItem>
              <LegendItem>
                <LegendColor color="#48bb78" />
                <LegendLabel>{t('reports.charts.rejected')}:</LegendLabel>
                <LegendValue>{validationStatusData.rejected}</LegendValue>
              </LegendItem>
              <LegendItem>
                <LegendColor color="#f56565" />
                <LegendLabel>{t('reports.charts.returned')}:</LegendLabel>
                <LegendValue>{validationStatusData.returned}</LegendValue>
              </LegendItem>
              <LegendItem>
                <LegendColor color="#ed8936" />
                <LegendLabel>{t('reports.charts.pending')}:</LegendLabel>
                <LegendValue>{validationStatusData.pending}</LegendValue>
              </LegendItem>
            </PieLegend>
          </PieChartContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>
            <FiBarChart2 /> {t('reports.charts.document_evolution')}
          </ChartTitle>
          <LineChartContainer>
            <LineChartSvg viewBox="0 0 600 300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
              <ChartAxis x1="50" y1="250" x2="550" y2="250" />
              <ChartAxis x1="50" y1="50" x2="50" y2="250" />
              <ChartLine
                points={documentsOverTime.map((d, i) => 
                  `${50 + (i * 85)},${250 - (d.value * 1.1)}`
                ).join(' ')}
              />
              {documentsOverTime.map((d, i) => (
                <ChartPoint
                  key={i}
                  cx={50 + (i * 85)}
                  cy={250 - (d.value * 1.1)}
                  r="6"
                />
              ))}
              {documentsOverTime.map((d, i) => (
                <ChartLabel
                  key={i}
                  x={50 + (i * 85)}
                  y="270"
                  textAnchor="middle"
                >
                  {d.month}
                </ChartLabel>
              ))}
            </LineChartSvg>
          </LineChartContainer>
        </ChartCard>
      </ChartsGrid>

      {/* Relatório de Documentos */}
      <DetailedSection>
        <SectionHeader>
          <SectionTitle>
            <FiFileText /> {t('reports.sections.detailed_analysis')}
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
            <ProgressBar>
              <ProgressFill 
                percentage={(documentsData.active / documentsData.total) * 100} 
                color="#48bb78"
              />
            </ProgressBar>
          </StatItem>
          <StatItem>
            <StatLabel>{t('reports.sections.validated_documents')}</StatLabel>
            <StatValue>{documentsData.validated}</StatValue>
            <ProgressBar>
              <ProgressFill 
                percentage={(documentsData.validated / documentsData.total) * 100} 
                color="#667eea"
              />
            </ProgressBar>
          </StatItem>
          <StatItem>
            <StatLabel>{t('reports.sections.awaiting_validation')}</StatLabel>
            <StatValue>{documentsData.pending}</StatValue>
            <ProgressBar>
              <ProgressFill 
                percentage={(documentsData.pending / documentsData.total) * 100} 
                color="#ed8936"
              />
            </ProgressBar>
          </StatItem>
        </StatsGrid>

        <ChartContainer>
          <h3 style={{ marginBottom: '20px', color: '#2d3748' }}>
            {t('reports.sections.documents_created_period')}
          </h3>
          <BarChart>
            {documentsData.byPeriod.map((item, index) => (
              <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Bar height={(item.count / maxCount) * 100}>
                  <BarValue>{item.count}</BarValue>
                </Bar>
                <BarLabel>{item.month}</BarLabel>
              </div>
            ))}
          </BarChart>
        </ChartContainer>
      </DetailedSection>

      {/* Relatório de Validações */}
      <DetailedSection>
        <SectionHeader>
          <SectionTitle>
            <FiCheckCircle /> {t('reports.sections.validation_report')}
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
            <StatLabel>{t('reports.sections.approval_rate')}</StatLabel>
            <StatValue>{validationsData.approvalRate}%</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>{t('reports.sections.average_time')}</StatLabel>
            <StatValue>{validationsData.avgTime}</StatValue>
          </StatItem>
        </StatsGrid>

        <h3 style={{ marginTop: '32px', marginBottom: '16px', color: '#2d3748' }}>
          {t('reports.sections.top_validators')}
        </h3>
        <Table>
          <thead>
            <tr>
              <Th>{t('reports.sections.validator')}</Th>
              <Th>{t('reports.sections.validations')}</Th>
              <Th>{t('reports.sections.participation')}</Th>
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
                      percentage={(validator.count / validationsData.total) * 100} 
                      color="#667eea"
                    />
                  </ProgressBar>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>

        <ChartContainer>
          <h3 style={{ marginBottom: '20px', color: '#2d3748' }}>
            {t('reports.sections.status_distribution')}
          </h3>
          <StatsGrid>
            <StatItem>
              <StatLabel>{t('reports.charts.approved')}</StatLabel>
              <StatValue>{validationsData.approved}</StatValue>
              <ProgressBar>
                <ProgressFill 
                  percentage={(validationsData.approved / validationsData.total) * 100} 
                  color="#48bb78"
                />
              </ProgressBar>
            </StatItem>
            <StatItem>
              <StatLabel>{t('reports.charts.rejected')}</StatLabel>
              <StatValue>{validationsData.rejected}</StatValue>
              <ProgressBar>
                <ProgressFill 
                  percentage={(validationsData.rejected / validationsData.total) * 100} 
                  color="#f56565"
                />
              </ProgressBar>
            </StatItem>
            <StatItem>
              <StatLabel>{t('reports.charts.returned')}</StatLabel>
              <StatValue>{validationsData.returned}</StatValue>
              <ProgressBar>
                <ProgressFill 
                  percentage={(validationsData.returned / validationsData.total) * 100} 
                  color="#ed8936"
                />
              </ProgressBar>
            </StatItem>
          </StatsGrid>
        </ChartContainer>
      </DetailedSection>

      {/* Relatório de Versões */}
      <DetailedSection>
        <SectionHeader>
          <SectionTitle>
            <FiClock /> {t('reports.sections.version_control')}
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

        <h3 style={{ marginTop: '32px', marginBottom: '16px', color: '#2d3748' }}>
          {t('reports.sections.most_edited')}
        </h3>
        <Table>
          <thead>
            <tr>
              <Th>{t('reports.sections.document')}</Th>
              <Th>{t('reports.sections.versions')}</Th>
              <Th>{t('reports.sections.activity')}</Th>
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

        <h3 style={{ marginTop: '32px', marginBottom: '16px', color: '#2d3748' }}>
          {t('reports.sections.tag_cloud')}
        </h3>
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
          <h3 style={{ marginBottom: '20px', color: '#2d3748' }}>
            {t('reports.sections.priority_distribution')}
          </h3>
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
                  color="#48bb78"
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
            <StatValue>{groupsData.members}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>{t('reports.sections.average_per_group')}</StatLabel>
            <StatValue>{groupsData.avgMembersPerGroup}</StatValue>
          </StatItem>
        </StatsGrid>

        <h3 style={{ marginTop: '32px', marginBottom: '16px', color: '#2d3748' }}>
          {t('reports.sections.most_populous')}
        </h3>
        <Table>
          <thead>
            <tr>
              <Th>{t('reports.sections.group')}</Th>
              <Th>{t('reports.sections.members')}</Th>
              <Th>{t('reports.sections.distribution')}</Th>
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

        <h3 style={{ marginTop: '32px', marginBottom: '16px', color: '#2d3748' }}>
          {t('reports.sections.top_users')}
        </h3>
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