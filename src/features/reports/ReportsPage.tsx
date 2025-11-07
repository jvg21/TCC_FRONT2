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
  FiUsers, 
} from 'react-icons/fi';

import { PageContainer, ApplyFilterButton, Bar, BarLabel, BarValue, CardDescription, CardHeader, CardIcon, CardTitle, CardValue, ChartContainer, DetailedSection, DownloadButton, FilterInput, FilterLabel, FilterSection, FilterSelect, PageHeader, PageSubtitle, PageTitle, ProgressBar, ProgressFill, ReportCard, ReportsGrid, SectionHeader, SectionTitle, StatItem, StatLabel, StatValue, StatsGrid, Table, TagCloud, TagItem, BarChartContainer, SectionHeading, Th, Td } from '../../components/common/reportsComponents';
import { useReports } from './useReports';
import type { ReportsData } from './types';



const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const { getAllReports, loading, clearFilters, updateFilters } = useReports();

  const documentReportData = reportsData ? reportsData.documents : null;
  const documentMonthReportData = reportsData ? reportsData.documentMonths : null;
  const aiUsersReportData = reportsData ? reportsData.aiUsers : null;
  const validationsReportData = reportsData ? reportsData.validations : null;
  const validatorsReportData = reportsData ? reportsData.validators : null;
  const tasksReportData = reportsData ? reportsData.tasks : null;
  const taskPrioritysReportData = reportsData ? reportsData.taskPrioritys : null;
  const aiReportData = reportsData ? reportsData.ai : null;
  const userActivityData = reportsData ? reportsData.userActivity || [] : []; 


  useEffect(() => {
    const fetchData = async () => {
      const allReports = await getAllReports();
      setReportsData(allReports);
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

  
  const handleDownloadReport = () => {
    alert('Download de relatório em PDF iniciado');
  };

  const handleApplyFilter = () => {
    let dateFilters = {};

    if (timeFilter === 'custom' && startDate && endDate) {
      dateFilters = {
        CreatedAtFrom: startDate,
        CreatedAtTo: endDate
      };
    } else if (timeFilter !== 'all') {
      
      const today = new Date();
      const endDateStr = today.toISOString().split('T')[0];
      let startDateStr;

      switch (timeFilter) {
        case 'today':
          startDateStr = endDateStr;
          break;
        case 'week':
          const lastWeek = new Date(today);
          lastWeek.setDate(today.getDate() - 7);
          startDateStr = lastWeek.toISOString().split('T')[0];
          break;
        case 'month':
          const lastMonth = new Date(today);
          lastMonth.setMonth(today.getMonth() - 1);
          startDateStr = lastMonth.toISOString().split('T')[0];
          break;
        case 'quarter':
          const lastQuarter = new Date(today);
          lastQuarter.setMonth(today.getMonth() - 3);
          startDateStr = lastQuarter.toISOString().split('T')[0];
          break;
        case 'year':
          const lastYear = new Date(today);
          lastYear.setFullYear(today.getFullYear() - 1);
          startDateStr = lastYear.toISOString().split('T')[0];
          break;
      }

      if (startDateStr) {
        dateFilters = {
          CreatedAtFrom: startDateStr,
          CreatedAtTo: endDateStr
        };
      }
    }

    
    getAllReports(dateFilters);
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{t('reports.title')}</PageTitle>
        <PageSubtitle>{t('reports.subtitle')}</PageSubtitle>
      </PageHeader>

      {}
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
            <FilterLabel>{t('reports.filters.start_date')}:</FilterLabel>
            <FilterInput
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <FilterLabel>{t('reports.filters.end_date')}:</FilterLabel>
            <FilterInput
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </>
        )}

        <ApplyFilterButton onClick={handleApplyFilter}>
          <FiFilter /> {t('reports.filters.apply')}
        </ApplyFilterButton>
      </FilterSection>

      {}
      <ReportsGrid>
        <ReportCard onClick={() => setSelectedReport('documents')}>
          <CardHeader>
            <CardIcon><FiFileText /></CardIcon>
            <CardTitle>{t('reports.cards.documents')}</CardTitle>
          </CardHeader>
          <CardValue>{documentsData.total}</CardValue>
          <CardDescription>
            {documentsData.active} {t('reports.cards.active')}
          </CardDescription>
        </ReportCard>

        <ReportCard onClick={() => setSelectedReport('validations')}>
          <CardHeader>
            <CardIcon><FiCheckCircle /></CardIcon>
            <CardTitle>{t('reports.cards.validations')}</CardTitle>
          </CardHeader>
          <CardValue>{validationsData.total}</CardValue>
          <CardDescription>
            {validationsData.approvalRate}% {t('reports.cards.approved')}
          </CardDescription>
        </ReportCard>

        <ReportCard onClick={() => setSelectedReport('tasks')}>
          <CardHeader>
            <CardIcon><FiClock /></CardIcon>
            <CardTitle>{t('reports.cards.tasks')}</CardTitle>
          </CardHeader>
          <CardValue>{tasksData.total}</CardValue>
          <CardDescription>
            {tasksData.completionRate}% {t('reports.cards.completed')}
          </CardDescription>
        </ReportCard>

        <ReportCard onClick={() => setSelectedReport('ai')}>
          <CardHeader>
            <CardIcon><FiCpu /></CardIcon>
            <CardTitle>{t('reports.cards.ai_usage')}</CardTitle>
          </CardHeader>
          <CardValue>{aiData.totalRequests}</CardValue>
          <CardDescription>
            {aiData.totalTokens.toLocaleString()} {t('reports.cards.tokens')}
          </CardDescription>
        </ReportCard>
      </ReportsGrid>

      {}
      <DetailedSection>
        <SectionHeader>
          <SectionTitle>
            <FiFileText /> {t('reports.sections.documents')}
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
            <StatLabel>{t('reports.sections.awaiting_validation')}</StatLabel>
            <StatValue>{documentsData.pending}</StatValue>
          </StatItem>
        </StatsGrid>

        <SectionHeading>
          {t('reports.sections.documents_created_period')}
        </SectionHeading>
        <BarChartContainer>
          {documentsData.byPeriod.map((month, index) => (
            <Bar
              key={index}
              height={(month.totalDocumentos / Math.max(...documentsData.byPeriod.map(m => m.totalDocumentos))) * 100}
            >
              <BarValue>{month.totalDocumentos}</BarValue>
              <BarLabel>{month.nomeMes.substring(0, 3)}</BarLabel>
            </Bar>
          ))}
        </BarChartContainer>
      </DetailedSection>

      {}
      <DetailedSection>
        <SectionHeader>
          <SectionTitle>
            <FiCheckCircle /> {t('reports.sections.validations')}
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
            <StatLabel>{t('reports.cards.approved')}</StatLabel>
            <StatValue>{validationsData.approved}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>{t('reports.cards.rejected')}</StatLabel>
            <StatValue>{validationsData.rejected}</StatValue>
          </StatItem>
        </StatsGrid>

        <SectionHeading>
          {t('reports.sections.top_validators')}
        </SectionHeading>
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
                <Td><strong>{validator.totalValidations}</strong></Td>
                <Td>
                  <ProgressBar>
                    <ProgressFill
                      percentage={(validator.totalValidations / validationsData.total) * 100}
                      color="#48bb78"
                    />
                  </ProgressBar>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </DetailedSection>

      {}
      <DetailedSection>
        <SectionHeader>
          <SectionTitle>
            <FiList /> {t('reports.sections.tasks')}
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
            <StatValue>{tasksData.overdue}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>{t('reports.cards.completed')}</StatLabel>
            <StatValue>{tasksData.completed}</StatValue>
          </StatItem>
        </StatsGrid>

        <SectionHeading>
          {t('reports.sections.priority_distribution')}
        </SectionHeading>
        <ChartContainer>
          <StatsGrid>
            <StatItem>
              <StatLabel>{t('reports.sections.high_priority')}</StatLabel>
              <ProgressBar>
                <ProgressFill
                  percentage={(tasksData.byPriority.high / tasksData.total) * 100}
                  color="#e53e3e"
                />
              </ProgressBar>
            </StatItem>
            <StatItem>
              <StatLabel>{t('reports.sections.medium_priority')}</StatLabel>
              <ProgressBar>
                <ProgressFill
                  percentage={(tasksData.byPriority.medium / tasksData.total) * 100}
                  color="#ed8936"
                />
              </ProgressBar>
            </StatItem>
            <StatItem>
              <StatLabel>{t('reports.sections.low_priority')}</StatLabel>
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

      {}
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

      {}
      <DetailedSection>
        <SectionHeader>
          <SectionTitle>
            <FiUsers /> {t('reports.sections.user_activity')}
          </SectionTitle>
          <DownloadButton onClick={handleDownloadReport}>
            <FiDownload /> {t('reports.sections.export_report')}
          </DownloadButton>
        </SectionHeader>

        <SectionHeading>
          {t('reports.sections.top_active_users')}
        </SectionHeading>
        <Table>
          <thead>
            <tr>
              <Th>{t('reports.sections.user')}</Th>
              <Th>{t('reports.sections.modifications')}</Th>
              <Th>{t('reports.sections.comments')}</Th>
              <Th>{t('reports.sections.approvals')}</Th>
              <Th>{t('reports.sections.total_activity')}</Th>
            </tr>
          </thead>
          <tbody>
            {userActivityData.map((user, index) => (
              <tr key={index}>
                <Td>{'mengo'}</Td>
                <Td><strong>{'mengo'}</strong></Td>
                <Td><strong>{'mengo'}</strong></Td>
                <Td><strong>{'mengo'}</strong></Td>
                <Td>
                  <ProgressBar>
                    <ProgressFill
                      percentage={(1 / (1 || 1)) * 100}
                      color="#4299e1"
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