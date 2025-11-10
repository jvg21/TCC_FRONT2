import React, { useEffect, useRef, useState } from 'react';
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

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { useReports } from './useReports';
import type { ReportsData } from './types';


const Page = {
  surface: (t: any) => t?.colors?.surface ?? (t?.isDark ? '#0b1220' : '#ffffff'),
  surfaceAlt: (t: any) => t?.colors?.surfaceAlt ?? (t?.isDark ? '#0f172a' : '#f7fafc'),
  border: (t: any) => t?.colors?.border ?? (t?.isDark ? '#2d3748' : '#e2e8f0'),
  text: (t: any) => t?.colors?.text ?? (t?.isDark ? '#e5e7eb' : '#1f2937'),
  textMuted: (t: any) => t?.colors?.textMuted ?? (t?.isDark ? '#9ca3af' : '#4a5568'),
  primary: (t: any) => t?.colors?.primary ?? '#6366f1',
  
  textStrong: (t: any) => t?.colors?.textStrong ?? (t?.isDark ? '#ffffff' : '#111827'),
};

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
  color: ${({ theme }) => Page.text(theme)};

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const ResponsivePageSubtitle = styled.p`
  color: ${({ theme }) => Page.textMuted(theme)};
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
  background: ${({ theme }) => Page.surfaceAlt(theme)};
  padding: 15px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => Page.border(theme)};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px;
  }
`;

const ResponsiveFilterLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: ${({ theme }) => Page.text(theme)};
  background: ${({ theme }) => Page.surface(theme)};
  border: 1px solid ${({ theme }) => Page.border(theme)};
  border-radius: 10px;
  padding: 6px 10px;

  svg { color: ${({ theme }) => Page.primary(theme)}; }

  @media (max-width: 768px) {
    margin-bottom: 5px;
  }
`;

const ResponsiveFilterSelect = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => Page.border(theme)};
  background: ${({ theme }) => Page.surface(theme)};
  color: ${({ theme }) => Page.text(theme)};
  min-width: 170px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => (theme?.isDark ? 'rgba(99,102,241,.35)' : 'rgba(99,102,241,.25)')};
    border-color: ${({ theme }) => Page.primary(theme)};
  }

  option {
    background: ${({ theme }) => Page.surface(theme)};
    color: ${({ theme }) => Page.text(theme)};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ResponsiveFilterInput = styled.input`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => Page.border(theme)};
  background: ${({ theme }) => Page.surface(theme)};
  color: ${({ theme }) => Page.text(theme)};

  &::placeholder {
    color: ${({ theme }) => Page.textMuted(theme)};
  }

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
  gap: 6px;
  padding: 10px 16px;
  border-radius: 8px;
  background: ${({ theme }) => Page.primary(theme)};
  color: #ffffff;
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 600;
  transition: filter 0.2s, transform 0.02s;

  &:hover { filter: brightness(0.95); }
  &:active { transform: translateY(1px); }

  &:disabled {
    opacity: ${({ theme }) => (theme?.isDark ? 0.55 : 0.6)};
    cursor: not-allowed;
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
  background: ${({ theme }) => Page.surface(theme)};
  border-radius: 12px;
  padding: 20px;
  border: 1px solid ${({ theme }) => Page.border(theme)};
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.16s, box-shadow 0.16s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(0,0,0,0.15);
  }

  @media (max-width: 768px) {
    padding: 16px;
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
  color: ${({ theme }) => Page.primary(theme)};
`;

const ResponsiveCardTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => Page.text(theme)};
`;

const ResponsiveCardValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
  color: ${({ theme }) => Page.textStrong(theme)}; /* forte no dark */

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const ResponsiveCardDescription = styled.div`
  color: ${({ theme }) =>
    theme?.isDark ? Page.text(theme) : Page.textMuted(theme)};
  opacity: ${({ theme }) => (theme?.isDark ? 0.9 : 1)};
  font-size: 14px;
`;

const ResponsiveDetailedSection = styled.section`
  background: ${({ theme }) => Page.surface(theme)};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid ${({ theme }) => Page.border(theme)};
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);

  @media (max-width: 768px) {
    padding: 16px;
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
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => Page.text(theme)};

  @media (max-width: 768px) {
    font-size: 16px;
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
  background: ${({ theme }) => Page.surfaceAlt(theme)};
  border: 1px solid ${({ theme }) => Page.border(theme)};
  border-radius: 12px;
  padding: 15px;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const ResponsiveStatLabel = styled.div`
  color: ${({ theme }) =>
    theme?.isDark ? Page.text(theme) : Page.textMuted(theme)};
  opacity: 0.95;
  font-size: 14px;
  margin-bottom: 5px;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const ResponsiveStatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => Page.textStrong(theme)};

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const ResponsiveSectionHeading = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 15px;
  color: ${({ theme }) => Page.text(theme)};

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
  padding:50px;
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
  /* min-height menor para valores pequenos sem distorcer o gráfico */
  min-height: 6%;
  background: ${({ theme }) => Page.primary(theme)};
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
  top: -22px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => Page.text(theme)};
`;

const ResponsiveBarLabel = styled.span`
  margin-top: 8px;
  font-size: 12px;
  position: absolute;
  bottom: -25px;
  color: ${({ theme }) => Page.textMuted(theme)};
`;

const ResponsiveTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: ${({ theme }) => Page.text(theme)};

  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
  }
`;

const ResponsiveTh = styled.th`
  text-align: left;
  padding: 12px 10px;
  border-bottom: 1px solid ${({ theme }) => Page.border(theme)};
  font-weight: 700;
  color: ${({ theme }) => Page.text(theme)};
  font-size: 14px;
  background: ${({ theme }) => Page.surface(theme)};

  @media (max-width: 768px) {
    padding: 10px 8px;
    white-space: nowrap;
  }
`;

const ResponsiveTd = styled.td`
  padding: 12px 10px;
  border-bottom: 1px solid ${({ theme }) => Page.border(theme)};
  color: ${({ theme }) => Page.text(theme)};

  @media (max-width: 768px) {
    padding: 10px 8px;
    white-space: nowrap;
  }
`;

const ResponsiveProgressBar = styled.div`
  height: 8px;
  background: ${({ theme }) => (theme?.isDark ? '#1f2937' : '#edf2f7')};
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
  border: 1px solid ${({ theme }) => Page.border(theme)};
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

/** --------- UTIL: arredonda o máximo para 1–2–5×10ⁿ --------- */
const getNiceMax = (v: number) => {
  const value = Math.max(1, v);
  const exp = Math.floor(Math.log10(value));
  const base = Math.pow(10, exp);
  const candidates = [1, 2, 5, 10].map(m => m * base);
  const nice = candidates.find(c => c >= value) ?? 10 * base;
  return nice;
};

const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const [_, setSelectedReport] = useState<string | null>(null);
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const documentsRef = useRef<HTMLDivElement | null>(null);
  const validationsRef = useRef<HTMLDivElement | null>(null);
  const tasksRef = useRef<HTMLDivElement | null>(null);
  const aiRef = useRef<HTMLDivElement | null>(null);
  const usersRef = useRef<HTMLDivElement | null>(null);

  const {
    getAllReports, clearFilters, updateFilters,
    getAIUserStats, getAIStats, getDocumentMonthsStats,
    getTaskPriorityStats, getValidationStats, getValidatorsStats,
    getDocumentStats, getTaskStats
  } = useReports();

  useEffect(() => {
    const fetchData = async () => {
      const allReports = await getAllReports();
      setReportsData(allReports);
    };
    fetchData();
  }, []);

  const documentReportData = reportsData ? reportsData.documents : null;
  const documentMonthReportData = reportsData ? reportsData.documentMonths : null;
  const aiUsersReportData = reportsData ? reportsData.aiUsers : null;
  const validationsReportData = reportsData ? reportsData.validations : null;
  const validatorsReportData = reportsData ? reportsData.validators : null;
  const tasksReportData = reportsData ? reportsData.tasks : null;
  const taskPrioritysReportData = reportsData ? reportsData.taskPrioritys : null;
  const aiReportData = reportsData ? reportsData.ai : null;
  const userActivityData = reportsData ? reportsData.userActivity || [] : [];

  const documentsData = {
    total: documentReportData?.totalDocuments ?? 0,
    active: documentReportData?.activeDocuments ?? 0,
    inactive: documentReportData?.inactiveDocuments ?? 0,
    validated: documentReportData?.approvedDocuments ?? 0,
    pending: documentReportData?.pendingDocuments ?? 0,
    byPeriod: documentMonthReportData ?? []
  };

  const validationsData = {
    total: validationsReportData?.totalValidations ?? 0,
    approved: validationsReportData?.totalApproved ?? 0,
    rejected: validationsReportData?.totalRejected ?? 0,
    returned: validationsReportData?.totalInRevision ?? 0,
    approvalRate: validationsReportData
      ? (validationsReportData.totalApproved / Math.max(validationsReportData.totalValidations, 1) * 100).toFixed(2)
      : 0,
    topValidators: validatorsReportData ?? []
  };

  const tasksData = {
    total: tasksReportData?.totalTasks ?? 0,
    completed: tasksReportData?.totalCompleted ?? 0,
    overdue: tasksReportData?.totalLate ?? 0,
    completionRate: tasksReportData?.completionRate ?? 0,
    byPriority: {
      high: taskPrioritysReportData ? taskPrioritysReportData.filter(t => t.priority === 'Alta').reduce((s, t) => s + t.total, 0) : 0,
      medium: taskPrioritysReportData ? taskPrioritysReportData.filter(t => t.priority === 'Média').reduce((s, t) => s + t.total, 0) : 0,
      low: taskPrioritysReportData ? taskPrioritysReportData.filter(t => t.priority === 'Baixa').reduce((s, t) => s + t.total, 0) : 0,
    }
  };

  const aiData = {
    totalRequests: aiReportData?.totalRequests ?? 0,
    totalTokens: aiReportData?.totalTokens ?? 0,
    avgTokensPerRequest: aiReportData?.requestAverageTokens ?? 0,
    estimatedCost: aiReportData?.estimatedCost ?? 0,
    topUsers: aiUsersReportData ?? []
  };

  
  const periodLabel = () => {
    if (timeFilter === 'custom' && startDate && endDate) {
      return `${t('reports.filters.start_date')}: ${startDate} • ${t('reports.filters.end_date')}: ${endDate}`;
    }
    const labels: Record<string, string> = {
      all: t('reports.filters.all_periods'),
      today: t('reports.filters.today'),
      week: t('reports.filters.last_week'),
      month: t('reports.filters.last_month'),
      quarter: t('reports.filters.last_quarter'),
      year: t('reports.filters.last_year'),
      custom: t('reports.filters.custom'),
    };
    return labels[timeFilter] || labels.all;
  };

  const renderNodeToCanvas = async (node: HTMLElement) => {
    const prevOverflow = node.style.overflow;
    const prevWidth = node.style.width;
    const prevBg = node.style.background;

    node.style.overflow = 'visible';
    node.style.width = 'auto';
    node.style.background = '#ffffff'; 

    const overflowNodes: Array<{ el: HTMLElement; prev: { overflowX: string; width: string } }> = [];
    node.querySelectorAll<HTMLElement>('*').forEach(el => {
      const style = getComputedStyle(el);
      if (style.overflowX === 'auto' || style.overflowX === 'scroll') {
        overflowNodes.push({ el, prev: { overflowX: el.style.overflowX, width: el.style.width } });
        el.style.overflowX = 'visible';
        if (el.scrollWidth > el.clientWidth) el.style.width = `${el.scrollWidth}px`;
      }
    });

    const canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      windowWidth: Math.max(document.documentElement.clientWidth, node.scrollWidth),
    });

    node.style.overflow = prevOverflow;
    node.style.width = prevWidth;
    node.style.background = prevBg;
    overflowNodes.forEach(({ el, prev }) => {
      el.style.overflowX = prev.overflowX;
      el.style.width = prev.width;
    });

    return canvas;
  };

  const drawHeader = (pdf: jsPDF, title: string, margin: number) => {
    const pageWidth = pdf.internal.pageSize.getWidth();
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text(title, margin, 12);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(periodLabel(), margin, 18);
    pdf.setDrawColor(230, 230, 230);
    pdf.line(margin, 20, pageWidth - margin, 20);
  };

  const drawFooter = (pdf: jsPDF, margin: number, pageNum: number) => {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.setDrawColor(230, 230, 230);
    pdf.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    pdf.setFontSize(9);
    pdf.text(`${t('reports.sections.export_report')} • ${new Date().toLocaleString()}`, margin, pageHeight - 6);
    pdf.text(`${pageNum}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
  };

  const addSectionToPdf = async (pdf: jsPDF, sectionRef: React.RefObject<HTMLElement>, title: string, pageNumStart: number) => {
    const node = sectionRef.current;
    if (!node) return pageNumStart;

    const margin = 12;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const canvas = await renderNodeToCanvas(node);
    const contentWidth = pageWidth - margin * 2;
    const imgWidth = contentWidth;

    const contentHeightMM = pageHeight - 22 - 12; 
    const canvasPageHeight = (contentHeightMM * canvas.width) / contentWidth;

    let sY = 0;
    const sWidth = canvas.width;

    const pageCanvas = document.createElement('canvas');
    const pageCtx = pageCanvas.getContext('2d')!;
    pageCanvas.width = sWidth;

    let currentPage = pageNumStart;
    let firstSlice = true;

    while (sY < canvas.height) {
      if (!firstSlice) {
        pdf.addPage();
        currentPage += 1;
      }
      drawHeader(pdf, title, margin);

      const sliceHeight = Math.min(canvasPageHeight, canvas.height - sY);
      pageCanvas.height = sliceHeight;

      pageCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
      pageCtx.drawImage(canvas, 0, sY, sWidth, sliceHeight, 0, 0, sWidth, sliceHeight);

      const imgDataPage = pageCanvas.toDataURL('image/png');
      const pageImgHeightMM = (sliceHeight * imgWidth) / sWidth;

      pdf.addImage(imgDataPage, 'PNG', margin, 22, imgWidth, pageImgHeightMM, undefined, 'FAST');
      drawFooter(pdf, margin, currentPage);

      sY += sliceHeight;
      firstSlice = false;
    }

    return currentPage;
  };

  const handleExportAll = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let pageNum = 1;

    const sections = [
      { ref: documentsRef as React.RefObject<HTMLElement>, title: t('reports.sections.documents') },
      { ref: validationsRef as React.RefObject<HTMLElement>, title: t('reports.sections.validations') },
      { ref: tasksRef as React.RefObject<HTMLElement>, title: t('reports.sections.tasks') },
      { ref: aiRef as React.RefObject<HTMLElement>, title: t('reports.sections.ai_usage') },
      { ref: usersRef as React.RefObject<HTMLElement>, title: t('reports.sections.user_activity') },
    ];

    for (let i = 0; i < sections.length; i++) {
      if (i > 0) { pdf.addPage(); pageNum += 1; }
      pageNum = await addSectionToPdf(pdf, sections[i].ref, sections[i].title, pageNum);
    }

    pdf.save('Relatorios_Documentin.pdf');
  };

  
  const handleApplyFilter = async () => {
    setLoading(true);

    try {
      let dateFilters: any = {};
      const formatDateUTCMinus3 = (date: Date) => {
        const utcMinus3 = new Date(date.getTime() - 3 * 60 * 60 * 1000);
        return utcMinus3.toISOString().split('T')[0];
      };

      if (timeFilter === 'custom' && startDate && endDate) {
        dateFilters = {
          CreatedAtFrom: formatDateUTCMinus3(new Date(startDate)),
          CreatedAtTo: formatDateUTCMinus3(new Date(endDate)),
        };
      } else if (timeFilter !== 'all') {
        const today = new Date();
        const endDateStr = formatDateUTCMinus3(today);
        let startDateStr;

        switch (timeFilter) {
          case 'today': startDateStr = endDateStr; break;
          case 'week': { const d = new Date(today); d.setDate(today.getDate() - 7); startDateStr = formatDateUTCMinus3(d); break; }
          case 'month': { const d = new Date(today); d.setMonth(today.getMonth() - 1); startDateStr = formatDateUTCMinus3(d); break; }
          case 'quarter': { const d = new Date(today); d.setMonth(today.getMonth() - 3); startDateStr = formatDateUTCMinus3(d); break; }
          case 'year': { const d = new Date(today); d.setFullYear(today.getFullYear() - 1); startDateStr = formatDateUTCMinus3(d); break; }
        }

        if (startDateStr) {
          dateFilters = { CreatedAtFrom: startDateStr, CreatedAtTo: endDateStr };
        }
      }

      const [
        documents, documentMonths, ai, aiUsers,
        validations, validators, tasks, taskPrioritys,
      ] = await Promise.all([
        getDocumentStats(dateFilters),
        getDocumentMonthsStats(dateFilters),
        getAIStats(dateFilters),
        getAIUserStats(dateFilters),
        getValidationStats(dateFilters),
        getValidatorsStats(dateFilters),
        getTaskStats(dateFilters),
        getTaskPriorityStats(dateFilters),
      ]);

      setReportsData({ documents, documentMonths, ai, aiUsers, validations, validators, tasks, taskPrioritys });
      updateFilters(dateFilters);
    } catch (err) {
      console.error('Erro ao aplicar filtros:', err);
    } finally {
      setLoading(false);
    }
  };

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

      setReportsData({ documents, documentMonths, ai, aiUsers, validations, validators, tasks, taskPrioritys });
    } catch (err) {
      console.error('Erro ao limpar filtros:', err);
    } finally {
      setLoading(false);
    }
  };

  /* --------- Escala “nice” para o gráfico de barras --------- */
  const rawMaxDocuments = Math.max(
    1,
    ...(documentsData.byPeriod?.map((m: any) => m.totalDocumentos) ?? [1])
  );
  const yMaxDocuments = getNiceMax(rawMaxDocuments);

  
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
            <ResponsiveFilterInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

            <ResponsiveFilterLabel>{t('reports.filters.end_date')}:</ResponsiveFilterLabel>
            <ResponsiveFilterInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </>
        )}

        <ResponsiveButtonGroup>
          <ResponsiveButton onClick={handleApplyFilter} disabled={loading}>
            <FiFilter /> {t('reports.filters.apply_filter')}
          </ResponsiveButton>

          <ResponsiveButton onClick={handleClearFilters} disabled={loading}>
            <FiFilter /> {t('reports.filters.clear_filters')}
          </ResponsiveButton>

          <ResponsiveButton onClick={handleExportAll} disabled={loading}>
            <FiDownload /> {t('reports.sections.export_report')}
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
            {`${validationsData.approvalRate}% ${t('reports.cards.approved')}`}
          </ResponsiveCardDescription>
        </ResponsiveReportCard>

        <ResponsiveReportCard onClick={() => setSelectedReport('tasks')}>
          <ResponsiveCardHeader>
            <ResponsiveCardIcon><FiClock /></ResponsiveCardIcon>
            <ResponsiveCardTitle>{t('reports.cards.tasks')}</ResponsiveCardTitle>
          </ResponsiveCardHeader>
          <ResponsiveCardValue>{tasksData.total}</ResponsiveCardValue>
          <ResponsiveCardDescription>
            {`${tasksData.completionRate}% ${t('reports.cards.completed')}`}
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

      {/* Documentos */}
      <ResponsiveDetailedSection ref={documentsRef as any}>
        <ResponsiveSectionHeader>
          <ResponsiveSectionTitle>
            <FiFileText /> {t('reports.sections.documents')}
          </ResponsiveSectionTitle>
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
          {documentsData.byPeriod.map((month: any, index: number) => {
            // altura normalizada usando yMaxDocuments e com folga superior (<=96%)
            const normalized = (month.totalDocumentos / yMaxDocuments) * 100;
            const height = Math.min(96, Math.max(6, normalized));
            return (
              <ResponsiveBar key={index} height={height}>
                <ResponsiveBarValue>{month.totalDocumentos}</ResponsiveBarValue>
                <ResponsiveBarLabel>{month.nomeMes?.substring(0, 3)}</ResponsiveBarLabel>
              </ResponsiveBar>
            );
          })}
        </ResponsiveBarChartContainer>
      </ResponsiveDetailedSection>

      {/* Validações */}
      <ResponsiveDetailedSection ref={validationsRef as any}>
        <ResponsiveSectionHeader>
          <ResponsiveSectionTitle>
            <FiCheckCircle /> {t('reports.sections.validations')}
          </ResponsiveSectionTitle>
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
            {validationsData.topValidators.map((validator: any, index: number) => (
              <tr key={index}>
                <ResponsiveTd>{validator.name}</ResponsiveTd>
                <ResponsiveTd><strong>{validator.totalValidations}</strong></ResponsiveTd>
                <ResponsiveTd>
                  <ResponsiveProgressBar>
                    <ResponsiveProgressFill
                      percentage={(validator.totalValidations / Math.max(validationsData.total, 1)) * 100}
                      color="#48bb78"
                    />
                  </ResponsiveProgressBar>
                </ResponsiveTd>
              </tr>
            ))}
          </tbody>
        </ResponsiveTable>
      </ResponsiveDetailedSection>

      {}
      <ResponsiveDetailedSection ref={tasksRef as any}>
        <ResponsiveSectionHeader>
          <ResponsiveSectionTitle>
            <FiList /> {t('reports.sections.tasks')}
          </ResponsiveSectionTitle>
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
                  percentage={(tasksData.byPriority.high / Math.max(tasksData.total, 1)) * 100}
                  color="#e53e3e"
                />
              </ResponsiveProgressBar>
            </ResponsiveStatItem>
            <ResponsiveStatItem>
              <ResponsiveStatLabel>{t('reports.sections.medium_priority')}</ResponsiveStatLabel>
              <ResponsiveStatValue>{tasksData.byPriority.medium}</ResponsiveStatValue>
              <ResponsiveProgressBar>
                <ResponsiveProgressFill
                  percentage={(tasksData.byPriority.medium / Math.max(tasksData.total, 1)) * 100}
                  color="#ed8936"
                />
              </ResponsiveProgressBar>
            </ResponsiveStatItem>
            <ResponsiveStatItem>
              <ResponsiveStatLabel>{t('reports.sections.low_priority')}</ResponsiveStatLabel>
              <ResponsiveStatValue>{tasksData.byPriority.low}</ResponsiveStatValue>
              <ResponsiveProgressBar>
                <ResponsiveProgressFill
                  percentage={(tasksData.byPriority.low / Math.max(tasksData.total, 1)) * 100}
                  color="#38b2ac"
                />
              </ResponsiveProgressBar>
            </ResponsiveStatItem>
          </ResponsiveStatsGrid>
        </ResponsiveChartContainer>
      </ResponsiveDetailedSection>

      {}
      <ResponsiveDetailedSection ref={aiRef as any}>
        <ResponsiveSectionHeader>
          <ResponsiveSectionTitle>
            <FiCpu /> {t('reports.sections.ai_usage')}
          </ResponsiveSectionTitle>
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
            {aiData.topUsers.map((user: any, index: number) => (
              <tr key={index}>
                <ResponsiveTd>{user.name}</ResponsiveTd>
                <ResponsiveTd><strong>{user.totalRequests}</strong></ResponsiveTd>
                <ResponsiveTd>
                  <ResponsiveProgressBar>
                    <ResponsiveProgressFill
                      percentage={(user.totalRequests / Math.max(aiData.topUsers[0]?.totalRequests || 1, 1)) * 100}
                      color="#667eea"
                    />
                  </ResponsiveProgressBar>
                </ResponsiveTd>
              </tr>
            ))}
          </tbody>
        </ResponsiveTable>
      </ResponsiveDetailedSection>

      {/* Usuários */}
      <ResponsiveDetailedSection ref={usersRef as any}>
        <ResponsiveSectionHeader>
          <ResponsiveSectionTitle>
            <FiUsers /> {t('reports.sections.user_activity')}
          </ResponsiveSectionTitle>
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
            {userActivityData.map((_: any, index: number) => (
              <tr key={index}>
                <ResponsiveTd>{'mengo'}</ResponsiveTd>
                <ResponsiveTd><strong>{'mengo'}</strong></ResponsiveTd>
                <ResponsiveTd><strong>{'mengo'}</strong></ResponsiveTd>
                <ResponsiveTd><strong>{'mengo'}</strong></ResponsiveTd>
                <ResponsiveTd>
                  <ResponsiveProgressBar>
                    <ResponsiveProgressFill percentage={(1 / (1 || 1)) * 100} color="#4299e1" />
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

