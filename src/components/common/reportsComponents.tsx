import styled from "styled-components";

// Componentes estilizados com suporte a tema claro/escuro
export const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

export const PageHeader = styled.div`
  margin-bottom: 32px;
`;

export const PageTitle = styled.h1`
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const PageSubtitle = styled.p`
  margin: 0;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.mutedText || theme.colors.muted};
`;

export const FilterSection = styled.div`
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

export const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FilterSelect = styled.select`
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

export const FilterInput = styled.input`
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

export const ApplyFilterButton = styled.button`
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

export const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

export const ReportCard = styled.div`
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

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const CardIcon = styled.div`
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

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const CardValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 16px 0;
`;

export const CardDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedText || theme.colors.muted};
  line-height: 1.5;
`;

export const DetailedSection = styled.div`
  background: ${({ theme }) => theme.colors.surface || theme.colors.cardBackground};
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border || 'rgba(0, 0, 0, 0.06)'};
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const DownloadButton = styled.button`
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

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

export const StatItem = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors.backgroundAlt || theme.colors.background};
  border-radius: 12px;
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
`;

export const StatLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.mutedText || theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

export const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.border || 'rgba(0, 0, 0, 0.06)'};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 12px;
`;

export const ProgressFill = styled.div<{ percentage: number; color?: string }>`
  height: 100%;
  width: ${props => props.percentage}%;
  background: ${props => props.color || props.theme.colors.primary};
  transition: width 0.3s ease;
`;

export const ChartContainer = styled.div`
  margin-top: 24px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.backgroundAlt || theme.colors.background};
  border-radius: 12px;
`;

export const BarChartContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 200px;
  padding: 20px 0;
`;

export const Bar = styled.div<{ height: number; color?: string }>`
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

export const BarLabel = styled.div`
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.mutedText || theme.colors.muted};
  margin-top: 8px;
  font-weight: 600;
`;

export const BarValue = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
`;

export const TagCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
`;

export const TagItem = styled.div<{ size: number }>`
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

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

export const Th = styled.th`
  text-align: left;
  padding: 12px;
  background: ${({ theme }) => theme.colors.backgroundAlt || theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  font-size: 14px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border || 'rgba(0, 0, 0, 0.06)'};
`;

export const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border || 'rgba(0, 0, 0, 0.06)'};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
`;

export const SectionHeading = styled.h3`
  margin-top: 32px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text};
`;