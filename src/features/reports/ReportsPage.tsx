import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiList,
  FiCpu,
  FiDownload,
  FiCalendar,
  FiFilter,

} from 'react-icons/fi';

import { PageContainer, ApplyFilterButton, Bar, BarLabel, BarValue, CardDescription, CardHeader, CardIcon, CardTitle, CardValue, ChartContainer, DetailedSection, DownloadButton, FilterInput, FilterLabel, FilterSection, FilterSelect, PageHeader, PageSubtitle, PageTitle, ProgressBar, ProgressFill, ReportCard, ReportsGrid, SectionHeader, SectionTitle, StatItem, StatLabel, StatValue, StatsGrid, Table, TagCloud, TagItem, BarChartContainer, SectionHeading, Th, Td } from '../../components/common/reportsComponents';
import { useReports } from './useReports';
import type { ReportsData } from './types';


// Componente Principal
const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const { getAllReports } = useReports();

  const documentReportData = reportsData ? reportsData.documents : null;
  const documentMonthReportData = reportsData ? reportsData.documentMonths : null;
  const aiUsersReportData = reportsData ? reportsData.aiUsers : null;
  const validationsReportData = reportsData ? reportsData.validations : null;
  const validatorsReportData = reportsData ? reportsData.validators : null;
  const tasksReportData = reportsData ? reportsData.tasks : null;
  const taskPrioritysReportData = reportsData ? reportsData.taskPrioritys : null;
  const aiReportData = reportsData ? reportsData.ai : null;


  useEffect(() => {
    const fetchData = async () => {
      const allReports = await getAllReports();
      setReportsData(allReports);
      // console.log("Relatórios carregados com sucesso:", allReports);
    }
    fetchData();
  }, []);


  const documentsData = {
    total: documentReportData ? documentReportData.totalDocuments : 0,
    active: documentReportData ? documentReportData.activeDocuments : 0,
    inactive: documentReportData ? documentReportData.inactiveDocuments : 0,
    validated: documentReportData ? documentReportData.approvedDocuments : 0,
    pending: documentReportData ? documentReportData.pendingDocuments : 0,
    byPeriod: documentMonthReportData ? documentMonthReportData : []
  };

  const validationsData = {
    total: validationsReportData ? validationsReportData.totalValidations : 0,
    approved: validationsReportData ? validationsReportData.totalApproved : 0,
    rejected: validationsReportData ? validationsReportData.totalRejected : 0,
    returned: validationsReportData ? validationsReportData.totalInRevision : 0,
    approvalRate: validationsReportData ? (validationsReportData.totalApproved / validationsReportData.totalValidations * 100).toFixed(2) : 0,
    topValidators: validatorsReportData ? validatorsReportData : []
  };

  const tasksData = {
    total: tasksReportData ? tasksReportData.totalTasks : 0,
    completed: tasksReportData ? tasksReportData.totalCompleted : 0,
    overdue: tasksReportData ? tasksReportData.totalLate : 0,
    completionRate: tasksReportData ? tasksReportData.completionRate : 0,
    byPriority: {
      high: taskPrioritysReportData ? taskPrioritysReportData.filter((t => t.priority === 'Alta')).reduce((sum, t) => sum + t.total, 0) : 0,
      medium: taskPrioritysReportData ? taskPrioritysReportData.filter((t => t.priority === 'Média')).reduce((sum, t) => sum + t.total, 0) : 0,
      low: taskPrioritysReportData ? taskPrioritysReportData.filter((t => t.priority === 'Baixa')).reduce((sum, t) => sum + t.total, 0) : 0
    }
  };

  const aiData = {
    totalRequests: aiReportData ? aiReportData.totalRequests : 0,
    totalTokens: aiReportData ? aiReportData.totalTokens : 0,
    avgTokensPerRequest: aiReportData ? aiReportData.requestAverageTokens : 0,
    estimatedCost: aiReportData ? aiReportData.estimatedCost : 0,
    topUsers: aiUsersReportData ? aiUsersReportData : []
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
                  height={(item.totalDocumentos / Math.max(...documentsData.byPeriod.map(i => i.totalDocumentos))) * 100}
                >
                  <BarValue>{item.totalDocumentos}</BarValue>
                </Bar>
                <BarLabel>{item.nomeMes}</BarLabel>
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
            <StatLabel>{t('reports.sections.pending')}</StatLabel>
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
                  <Td><strong>{validator.totalValidations}</strong></Td>
                  <Td>
                    <ProgressBar>
                      <ProgressFill
                        percentage={(validator.totalValidations / validationsData.topValidators[0].totalValidations) * 100}
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
                <Td><strong>{user.totalRequests}</strong></Td>
                <Td>
                  <ProgressBar>
                    <ProgressFill
                      percentage={(user.totalRequests / aiData.topUsers[0].totalRequests) * 100}
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