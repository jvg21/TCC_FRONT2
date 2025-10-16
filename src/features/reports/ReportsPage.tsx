import React, { useState } from 'react';
import styled from 'styled-components';
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

// Styled Components
const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  color: white;
`;

const PageSubtitle = styled.p`
  margin: 0;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
`;

const FilterSection = styled.div`
  background: white;
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
  color: #4a5568;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterSelect = styled.select`
  padding: 10px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #2d3748;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #667eea;
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const FilterInput = styled.input`
  padding: 10px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #2d3748;
  background: white;
  transition: all 0.2s ease;

  &:hover {
    border-color: #667eea;
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const ApplyFilterButton = styled.button`
  padding: 10px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PieChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  position: relative;
`;

const PieChart = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    #667eea 0deg 216deg,
    #48bb78 216deg 288deg,
    #f56565 288deg 324deg,
    #ed8936 324deg 360deg
  );
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    background: white;
    border-radius: 50%;
  }
`;

const PieLegend = styled.div`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: ${props => props.color};
`;

const LegendLabel = styled.span`
  color: #4a5568;
  font-weight: 500;
`;

const LegendValue = styled.span`
  color: #2d3748;
  font-weight: 700;
`;

const LineChartContainer = styled.div`
  height: 300px;
  position: relative;
`;

const LineChartSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

const ChartAxis = styled.line`
  stroke: #e2e8f0;
  stroke-width: 2;
`;

const ChartLine = styled.polyline`
  fill: none;
  stroke: url(#lineGradient);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const ChartPoint = styled.circle`
  fill: #667eea;
  stroke: white;
  stroke-width: 3;
  cursor: pointer;
  transition: r 0.2s ease;

  &:hover {
    r: 8;
  }
`;

const ChartLabel = styled.text`
  fill: #718096;
  font-size: 12px;
  font-weight: 600;
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const ReportCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  color: #2d3748;
`;

const CardValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #667eea;
  margin: 16px 0;
`;

const CardDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #718096;
  line-height: 1.5;
`;

const DetailedSection = styled.div`
  background: white;
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
  border-bottom: 2px solid #e2e8f0;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: #f7fafc;
  border-radius: 12px;
  border-left: 4px solid #667eea;
`;

const StatLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 12px;
`;

const ProgressFill = styled.div<{ percentage: number; color?: string }>`
  height: 100%;
  width: ${props => props.percentage}%;
  background: ${props => props.color || '#667eea'};
  transition: width 0.3s ease;
`;

const ChartContainer = styled.div`
  margin-top: 24px;
  padding: 20px;
  background: #f7fafc;
  border-radius: 12px;
`;

const BarChart = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 200px;
  padding: 20px 0;
`;

const Bar = styled.div<{ height: number; color?: string }>`
  flex: 1;
  background: ${props => props.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
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
  color: #718096;
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
  color: #2d3748;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: #f7fafc;
  color: #4a5568;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 2px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  color: #2d3748;
  font-size: 14px;
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