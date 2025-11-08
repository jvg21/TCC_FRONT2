import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  FiFileText,
  FiCheckCircle,
  FiList,
  FiCpu,
  FiDownload,
  FiCalendar,
  FiFilter,
  FiUsers,
  FiClock,
} from 'react-icons/fi';

// Componentes responsivos
const ResponsivePageContainer = styled.div`
  padding: 20px;
  max-width: 100%;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ResponsivePageHeader = styled.header`
  margin-bottom: 25px;
  
  @media (max-width: 768px) {
    margin-bottom: 15px;
  }
`;

const ResponsivePageTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  
  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const ResponsivePageSubtitle = styled.p`
  color: #666;
  font-size: 16px;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ResponsiveFilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  background: #f9fafb;
  padding: 15px;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px;
  }
`;

const ResponsiveFilterLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
  
  @media (max-width: 768px) {
    margin-bottom: 5px;
  }
`;

const ResponsiveFilterSelect = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: white;
  min-width: 150px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ResponsiveFilterInput = styled.input`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: white;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ResponsiveButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-left: auto;
  
  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 10px;
    width: 100%;
    justify-content: space-between;
  }
`;

const ResponsiveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 15px;
  border-radius: 4px;
  background: #4299e1;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
  
  &:hover {
    background: #3182ce;
  }
  
  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
  }
`;

const ResponsiveReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ResponsiveReportCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const ResponsiveCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const ResponsiveCardIcon = styled.div`
  font-size: 20px;
  color: #4299e1;
`;

const ResponsiveCardTitle = styled.h2`
  font-size: 16px;
  font-weight: 500;
`;

const ResponsiveCardValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const ResponsiveCardDescription = styled.div`
  color: #666;
  font-size: 14px;
`;

const ResponsiveDetailedSection = styled.section`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const ResponsiveSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const ResponsiveSectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ResponsiveDownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 4px;
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: #edf2f7;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const ResponsiveStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const ResponsiveStatItem = styled.div`
  background: #f7fafc;
  border-radius: 8px;
  padding: 15px;
  
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const ResponsiveStatLabel = styled.div`
  color: #4a5568;
  font-size: 14px;
  margin-bottom: 5px;
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const ResponsiveStatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #2d3748;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const ResponsiveSectionHeading = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
  color: #4a5568;
  
  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const ResponsiveBarChartContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 200px;
  margin-top: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
  
  @media (max-width: 768px) {
    padding-left: 5px;
    padding-right: 5px;
    min-width: calc(100% + 10px);
    margin-left: -5px;
    margin-right: -5px;
  }
`;

const ResponsiveBar = styled.div<{ height: number }>`
  width: 40px;
  height: ${props => props.height}%;
  min-height: 20px;
  background: #4299e1;
  border-radius: 4px 4px 0 0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 30px;
  }
`;

const ResponsiveBarValue = styled.span`
  position: absolute;
  top: -25px;
  font-size: 12px;
  font-weight: 500;
`;

const ResponsiveBarLabel = styled.span`
  margin-top: 8px;
  font-size: 12px;
  position: absolute;
  bottom: -25px;
`;

const ResponsiveTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
  }
`;

const ResponsiveTh = styled.th`
  text-align: left;
  padding: 12px 10px;
  border-bottom: 1px solid #edf2f7;
  font-weight: 500;
  color: #4a5568;
  font-size: 14px;
  
  @media (max-width: 768px) {
    padding: 10px 8px;
    white-space: nowrap;
  }
`;

const ResponsiveTd = styled.td`
  padding: 12px 10px;
  border-bottom: 1px solid #edf2f7;
  color: #2d3748;
  
  @media (max-width: 768px) {
    padding: 10px 8px;
    white-space: nowrap;
  }
`;

const ResponsiveProgressBar = styled.div`
  height: 8px;
  background: #edf2f7;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
`;

const ResponsiveProgressFill = styled.div<{ percentage: number; color: string }>`
  height: 100%;
  width: ${props => props.percentage}%;
  background: ${props => props.color};
  border-radius: 4px;
`;

const ResponsiveChartContainer = styled.div`
  margin-top: 20px;
  
  @media (max-width: 768px) {
    overflow-x: auto;
  }
`;

// Importando os tipos
import { useReports } from './useReports';
import type { ReportsData } from './types';

const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const [_, setSelectedReport] = useState<string | null>(null);
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { getAllReports, clearFilters, updateFilters, getAIUserStats, getAIStats, getDocumentMonthsStats, getTaskPriorityStats, getValidationStats, getValidatorsStats, getDocumentStats, getTaskStats } = useReports();

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

  const handleApplyFilter = async () => {
    setLoading(true);

    try {
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
      const [documents, documentMonths, ai, aiUsers, validations, validators, tasks, taskPrioritys] = await Promise.all([
        getDocumentStats(dateFilters),
        getDocumentMonthsStats(dateFilters),
        getAIStats(dateFilters),
        getAIUserStats(dateFilters),
        getValidationStats(dateFilters),
        getValidatorsStats(dateFilters),
        getTaskStats(dateFilters),
        getTaskPriorityStats(dateFilters),
      ]);

      // Criar manualmente o objeto de dados
      const newData = {
        documents,
        documentMonths,
        ai,
        aiUsers,
        validations,
        validators,
        tasks,
        taskPrioritys,
      };

      setReportsData(newData);
      updateFilters(dateFilters);
    } catch (err) {
      console.error("Erro ao aplicar filtros:", err);
    } finally {
      setLoading(false);
    }

  }

  const handleClearFilters = async () => {
    setLoading(true);

    try {
      setTimeFilter('all');
      setStartDate('');
      setEndDate('');

      await clearFilters();

      const [documents, documentMonths, ai, aiUsers, validations, validators, tasks, taskPrioritys] = await Promise.all([
        getDocumentStats(),
        getDocumentMonthsStats(),
        getAIStats(),
        getAIUserStats(),
        getValidationStats(),
        getValidatorsStats(),
        getTaskStats(),
        getTaskPriorityStats(),
      ]);

      // Criar manualmente o objeto de dados
      const newData = {
        documents,
        documentMonths,
        ai,
        aiUsers,
        validations,
        validators,
        tasks,
        taskPrioritys,
      };

      setReportsData(newData);
    } catch (err) {
      console.error("Erro ao limpar filtros:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ResponsivePageContainer>
      <ResponsivePageHeader>
        <ResponsivePageTitle>{t('reports.title')}</ResponsivePageTitle>
        <ResponsivePageSubtitle>{t('reports.subtitle')}</ResponsivePageSubtitle>
      </ResponsivePageHeader>

      <ResponsiveFilterSection>
        <ResponsiveFilterLabel>
          <FiCalendar /> {t('reports.filters.period')}:
        </ResponsiveFilterLabel>
        <ResponsiveFilterSelect
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
        </ResponsiveFilterSelect>

        {timeFilter === 'custom' && (
          <>
            <ResponsiveFilterLabel>{t('reports.filters.start_date')}:</ResponsiveFilterLabel>
            <ResponsiveFilterInput
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <ResponsiveFilterLabel>{t('reports.filters.end_date')}:</ResponsiveFilterLabel>
            <ResponsiveFilterInput
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </>
        )}

        <ResponsiveButtonGroup>
          <ResponsiveButton onClick={handleApplyFilter} disabled={loading}>
            <FiFilter /> {t('reports.filters.apply_filter')}
          </ResponsiveButton>

          <ResponsiveButton onClick={handleClearFilters} disabled={loading}>
            <FiFilter /> {t('reports.filters.clear_filters')}
          </ResponsiveButton>
        </ResponsiveButtonGroup>
      </ResponsiveFilterSection>

      <ResponsiveReportsGrid>
        <ResponsiveReportCard onClick={() => setSelectedReport('documents')}>
          <ResponsiveCardHeader>
            <ResponsiveCardIcon><FiFileText /></ResponsiveCardIcon>
            <ResponsiveCardTitle>{t('reports.cards.documents')}</ResponsiveCardTitle>
          </ResponsiveCardHeader>
          <ResponsiveCardValue>{documentsData.total}</ResponsiveCardValue>
          <ResponsiveCardDescription>
            {documentsData.active} {t('reports.cards.active')}
          </ResponsiveCardDescription>
        </ResponsiveReportCard>

        <ResponsiveReportCard onClick={() => setSelectedReport('validations')}>
          <ResponsiveCardHeader>
            <ResponsiveCardIcon><FiCheckCircle /></ResponsiveCardIcon>
            <ResponsiveCardTitle>{t('reports.cards.validations')}</ResponsiveCardTitle>
          </ResponsiveCardHeader>
          <ResponsiveCardValue>{validationsData.total}</ResponsiveCardValue>
          <ResponsiveCardDescription>
            {validationsData.approvalRate}% {t('reports.cards.approved')}
          </ResponsiveCardDescription>
        </ResponsiveReportCard>

        <ResponsiveReportCard onClick={() => setSelectedReport('tasks')}>
          <ResponsiveCardHeader>
            <ResponsiveCardIcon><FiClock /></ResponsiveCardIcon>
            <ResponsiveCardTitle>{t('reports.cards.tasks')}</ResponsiveCardTitle>
          </ResponsiveCardHeader>
          <ResponsiveCardValue>{tasksData.total}</ResponsiveCardValue>
          <ResponsiveCardDescription>
            {tasksData.completionRate}% {t('reports.cards.completed')}
          </ResponsiveCardDescription>
        </ResponsiveReportCard>

        <ResponsiveReportCard onClick={() => setSelectedReport('ai')}>
          <ResponsiveCardHeader>
            <ResponsiveCardIcon><FiCpu /></ResponsiveCardIcon>
            <ResponsiveCardTitle>{t('reports.cards.ai_usage')}</ResponsiveCardTitle>
          </ResponsiveCardHeader>
          <ResponsiveCardValue>{aiData.totalRequests}</ResponsiveCardValue>
          <ResponsiveCardDescription>
            {aiData.totalTokens.toLocaleString()} {t('reports.cards.tokens')}
          </ResponsiveCardDescription>
        </ResponsiveReportCard>
      </ResponsiveReportsGrid>

      <ResponsiveDetailedSection>
        <ResponsiveSectionHeader>
          <ResponsiveSectionTitle>
            <FiFileText /> {t('reports.sections.documents')}
          </ResponsiveSectionTitle>
          <ResponsiveDownloadButton onClick={handleDownloadReport}>
            <FiDownload /> {t('reports.sections.export_report')}
          </ResponsiveDownloadButton>
        </ResponsiveSectionHeader>

        <ResponsiveStatsGrid>
          <ResponsiveStatItem>
            <ResponsiveStatLabel>{t('reports.sections.total_documents')}</ResponsiveStatLabel>
            <ResponsiveStatValue>{documentsData.total}</ResponsiveStatValue>
          </ResponsiveStatItem>
          <ResponsiveStatItem>
            <ResponsiveStatLabel>{t('reports.sections.active_documents')}</ResponsiveStatLabel>
            <ResponsiveStatValue>{documentsData.active}</ResponsiveStatValue>
          </ResponsiveStatItem>
          <ResponsiveStatItem>
            <ResponsiveStatLabel>{t('reports.sections.inactive_documents')}</ResponsiveStatLabel>
            <ResponsiveStatValue>{documentsData.inactive}</ResponsiveStatValue>
          </ResponsiveStatItem>
          <ResponsiveStatItem>
            <ResponsiveStatLabel>{t('reports.sections.awaiting_validation')}</ResponsiveStatLabel>
            <ResponsiveStatValue>{documentsData.pending}</ResponsiveStatValue>
          </ResponsiveStatItem>
        </ResponsiveStatsGrid>

        <ResponsiveSectionHeading>
          {t('reports.sections.documents_created_period')}
        </ResponsiveSectionHeading>
        <ResponsiveBarChartContainer>
          {documentsData.byPeriod.map((month, index) => (
            <ResponsiveBar
              key={index}
              height={(month.totalDocumentos / Math.max(...documentsData.byPeriod.map(m => m.totalDocumentos))) * 100}
            >
              <ResponsiveBarValue>{month.totalDocumentos}</ResponsiveBarValue>
              <ResponsiveBarLabel>{month.nomeMes.substring(0, 3)}</ResponsiveBarLabel>
            </ResponsiveBar>
          ))}
        </ResponsiveBarChartContainer>
      </ResponsiveDetailedSection>

      <ResponsiveDetailedSection>
        <ResponsiveSectionHeader>
          <ResponsiveSectionTitle>
            <FiCheckCircle /> {t('reports.sections.validations')}
          </ResponsiveSectionTitle>
          <ResponsiveDownloadButton onClick={handleDownloadReport}>
            <FiDownload /> {t('reports.sections.export_report')}
          </ResponsiveDownloadButton>
        </ResponsiveSectionHeader>

        <ResponsiveStatsGrid>
          <ResponsiveStatItem>
            <ResponsiveStatLabel>{t('reports.sections.total_validations')}</ResponsiveStatLabel>
            <ResponsiveStatValue>{validationsData.total}</ResponsiveStatValue>
          </ResponsiveStatItem>
          <ResponsiveStatItem>
            <ResponsiveStatLabel>{t('reports.sections.approval_rate')}</ResponsiveStatLabel>
            <ResponsiveStatValue>{validationsData.approvalRate}%</ResponsiveStatValue>
          </ResponsiveStatItem>
          <ResponsiveStatItem>
            <ResponsiveStatLabel>{t('reports.cards.approved')}</ResponsiveStatLabel>
            <ResponsiveStatValue>{validationsData.approved}</ResponsiveStatValue>
          </ResponsiveStatItem>
          <ResponsiveStatItem>
            <ResponsiveStatLabel>{t('reports.cards.rejected')}</ResponsiveStatLabel>
            <ResponsiveStatValue>{validationsData.rejected}</ResponsiveStatValue>
          </ResponsiveStatItem>
        </ResponsiveStatsGrid>

        <ResponsiveSectionHeading>
          {t('reports.sections.top_validators')}
        </ResponsiveSectionHeading>
        <ResponsiveTable>
          <thead>
            <tr>
              <ResponsiveTh>{t('reports.sections.validator')}</ResponsiveTh>
              <ResponsiveTh>{t('reports.sections.validations')}</ResponsiveTh>
              <ResponsiveTh>{t('reports.sections.participation')}</ResponsiveTh>
            </tr>
          </thead>
          <tbody>
            {validationsData.topValidators.map((validator, index) => (
              <tr key={index}>
                <ResponsiveTd>{validator.name}</ResponsiveTd>
                <ResponsiveTd><strong>{validator.totalValidations}</strong></ResponsiveTd>
                <ResponsiveTd>
                  <ResponsiveProgressBar>
                    <ResponsiveProgressFill
                      percentage={(validator.totalValidations / validationsData.total) * 100}
                      color="#48bb78"
                    />
                  </ResponsiveProgressBar>
                </ResponsiveTd>
              </tr>
            ))}
          </tbody>
        </ResponsiveTable>
      </ResponsiveDetailedSection>

      <ResponsiveDetailedSection>
        <ResponsiveSectionHeader>
          <ResponsiveSectionTitle>
            <FiList /> {t('reports.sections.tasks')}
          </ResponsiveSectionTitle>
          <ResponsiveDownloadButton onClick={handleDownloadReport}>
            <FiDownload /> {t('reports.sections.export_report')}
          </ResponsiveDownloadButton>
        </ResponsiveSectionHeader>

        <ResponsiveStatsGrid>
          <ResponsiveStatItem>
            <ResponsiveStatLabel>{t('reports.sections.total_tasks')}</ResponsiveStatLabel>
            <ResponsiveStatValue>{tasksData.total}</ResponsiveStatValue>
          </ResponsiveStatItem>
          <ResponsiveStatItem>
            <ResponsiveStatLabel>{t('reports.sections.completion_rate')}</ResponsiveStatLabel>
            <ResponsiveStatValue>{tasksData.completionRate}%</ResponsiveStatValue>
          </ResponsiveStatItem>
          <ResponsiveStatItem>
            <ResponsiveStatLabel>{t('reports.sections.overdue_tasks')}</ResponsiveStatLabel>
            <ResponsiveStatValue>{tasksData.overdue}</ResponsiveStatValue>
          </ResponsiveStatItem>
          <ResponsiveStatItem>
            <ResponsiveStatLabel>{t('reports.cards.completed')}</ResponsiveStatLabel>
            <ResponsiveStatValue>{tasksData.completed}</ResponsiveStatValue>
          </ResponsiveStatItem>
        </ResponsiveStatsGrid>

        <ResponsiveSectionHeading>
          {t('reports.sections.priority_distribution')}
        </ResponsiveSectionHeading>
        <ResponsiveChartContainer>
          <ResponsiveStatsGrid>
            <ResponsiveStatItem>
              <ResponsiveStatLabel>{t('reports.sections.high_priority')}</ResponsiveStatLabel>
              <ResponsiveStatValue>{tasksData.byPriority.high}</ResponsiveStatValue>
              <ResponsiveProgressBar>
                <ResponsiveProgressFill
                  percentage={(tasksData.byPriority.high / tasksData.total) * 100}
                  color="#e53e3e"
                />
              </ResponsiveProgressBar>
            </ResponsiveStatItem>
            <ResponsiveStatItem>
              <ResponsiveStatLabel>{t('reports.sections.medium_priority')}</ResponsiveStatLabel>
              <ResponsiveStatValue>{tasksData.byPriority.medium}</ResponsiveStatValue>
              <ResponsiveProgressBar>
                <ResponsiveProgressFill
                  percentage={(tasksData.byPriority.medium / tasksData.total) * 100}
                  color="#ed8936"
                />
              </ResponsiveProgressBar>
            </ResponsiveStatItem>
            <ResponsiveStatItem>
              <ResponsiveStatLabel>{t('reports.sections.low_priority')}</ResponsiveStatLabel>
              <ResponsiveStatValue>{tasksData.byPriority.low}</ResponsiveStatValue>
              <ResponsiveProgressBar>
                <ResponsiveProgressFill
                  percentage={(tasksData.byPriority.low / tasksData.total) * 100}
                  color="#38b2ac"
                />
              </ResponsiveProgressBar>
            </ResponsiveStatItem>
          </ResponsiveStatsGrid>
        </ResponsiveChartContainer>
      </ResponsiveDetailedSection>

      <ResponsiveDetailedSection>
        <ResponsiveSectionHeader>
          <ResponsiveSectionTitle>
            <FiCpu /> {t('reports.sections.ai_usage')}
          </ResponsiveSectionTitle>
          <ResponsiveDownloadButton onClick={handleDownloadReport}>
            <FiDownload /> {t('reports.sections.export_report')}
          </ResponsiveDownloadButton>
        </ResponsiveSectionHeader>

        <ResponsiveStatsGrid>
          <ResponsiveStatItem>
            <ResponsiveStatLabel>{t('reports.sections.total_requests')}</ResponsiveStatLabel>
            <ResponsiveStatValue>{aiData.totalRequests}</ResponsiveStatValue>
          </ResponsiveStatItem>
          <ResponsiveStatItem>
            <ResponsiveStatLabel>{t('reports.sections.tokens_used')}</ResponsiveStatLabel>
            <ResponsiveStatValue>{aiData.totalTokens.toLocaleString()}</ResponsiveStatValue>
          </ResponsiveStatItem>
          <ResponsiveStatItem>
            <ResponsiveStatLabel>{t('reports.sections.average_per_request')}</ResponsiveStatLabel>
            <ResponsiveStatValue>{aiData.avgTokensPerRequest}</ResponsiveStatValue>
          </ResponsiveStatItem>
          <ResponsiveStatItem>
            <ResponsiveStatLabel>{t('reports.sections.estimated_cost')}</ResponsiveStatLabel>
            <ResponsiveStatValue style={{ color: '#48bb78' }}>{aiData.estimatedCost}</ResponsiveStatValue>
          </ResponsiveStatItem>
        </ResponsiveStatsGrid>

        <ResponsiveSectionHeading>
          {t('reports.sections.top_users')}
        </ResponsiveSectionHeading>
        <ResponsiveTable>
          <thead>
            <tr>
              <ResponsiveTh>{t('reports.sections.user')}</ResponsiveTh>
              <ResponsiveTh>{t('reports.sections.requests')}</ResponsiveTh>
              <ResponsiveTh>{t('reports.sections.usage')}</ResponsiveTh>
            </tr>
          </thead>
          <tbody>
            {aiData.topUsers.map((user, index) => (
              <tr key={index}>
                <ResponsiveTd>{user.name}</ResponsiveTd>
                <ResponsiveTd><strong>{user.totalRequests}</strong></ResponsiveTd>
                <ResponsiveTd>
                  <ResponsiveProgressBar>
                    <ResponsiveProgressFill
                      percentage={(user.totalRequests / aiData.topUsers[0].totalRequests) * 100}
                      color="#667eea"
                    />
                  </ResponsiveProgressBar>
                </ResponsiveTd>
              </tr>
            ))}
          </tbody>
        </ResponsiveTable>
      </ResponsiveDetailedSection>

      <ResponsiveDetailedSection>
        <ResponsiveSectionHeader>
          <ResponsiveSectionTitle>
            <FiUsers /> {t('reports.sections.user_activity')}
          </ResponsiveSectionTitle>
          <ResponsiveDownloadButton onClick={handleDownloadReport}>
            <FiDownload /> {t('reports.sections.export_report')}
          </ResponsiveDownloadButton>
        </ResponsiveSectionHeader>

        <ResponsiveSectionHeading>
          {t('reports.sections.top_active_users')}
        </ResponsiveSectionHeading>
        <ResponsiveTable>
          <thead>
            <tr>
              <ResponsiveTh>{t('reports.sections.user')}</ResponsiveTh>
              <ResponsiveTh>{t('reports.sections.modifications')}</ResponsiveTh>
              <ResponsiveTh>{t('reports.sections.comments')}</ResponsiveTh>
              <ResponsiveTh>{t('reports.sections.approvals')}</ResponsiveTh>
              <ResponsiveTh>{t('reports.sections.total_activity')}</ResponsiveTh>
            </tr>
          </thead>
          <tbody>
            {userActivityData.map((_, index) => (
              <tr key={index}>
                <ResponsiveTd>{'mengo'}</ResponsiveTd>
                <ResponsiveTd><strong>{'mengo'}</strong></ResponsiveTd>
                <ResponsiveTd><strong>{'mengo'}</strong></ResponsiveTd>
                <ResponsiveTd><strong>{'mengo'}</strong></ResponsiveTd>
                <ResponsiveTd>
                  <ResponsiveProgressBar>
                    <ResponsiveProgressFill
                      percentage={(1 / (1 || 1)) * 100}
                      color="#4299e1"
                    />
                  </ResponsiveProgressBar>
                </ResponsiveTd>
              </tr>
            ))}
          </tbody>
        </ResponsiveTable>
      </ResponsiveDetailedSection>
    </ResponsivePageContainer>
  );
};

export default ReportsPage;